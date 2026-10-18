package com.codealpha.trading.service;

import com.codealpha.trading.dto.TradeRequest;
import com.codealpha.trading.dto.TradeResponse;
import com.codealpha.trading.exception.InsufficientBalanceException;
import com.codealpha.trading.exception.InsufficientStockException;
import com.codealpha.trading.exception.StockNotFoundException;
import com.codealpha.trading.model.PortfolioItem;
import com.codealpha.trading.model.Stock;
import com.codealpha.trading.model.Transaction;
import com.codealpha.trading.model.TransactionType;
import com.codealpha.trading.model.User;
import com.codealpha.trading.repository.StockRepository;
import com.codealpha.trading.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
@Transactional(isolation = Isolation.REPEATABLE_READ)
public class TradingService {

    private final UserRepository userRepository;
    private final StockRepository stockRepository;
    private final PortfolioService portfolioService;
    private final TransactionService transactionService;

    @Autowired
    public TradingService(UserRepository userRepository,
                          StockRepository stockRepository,
                          PortfolioService portfolioService,
                          TransactionService transactionService) {
        this.userRepository = userRepository;
        this.stockRepository = stockRepository;
        this.portfolioService = portfolioService;
        this.transactionService = transactionService;
    }

    /**
     * Executes a BUY order with atomic validation:
     * 1. Validate quantity > 0
     * 2. Find stock and retrieve current price
     * 3. Compute total order cost
     * 4. Verify user has sufficient cash
     * 5. Deduct cash balance
     * 6. Update/create portfolio holding
     * 7. Record immutable transaction audit log
     */
    public synchronized TradeResponse buyStock(TradeRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive integer greater than zero.");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + request.getUserId() + " not found."));

        Stock stock = stockRepository.findBySymbolIgnoreCase(request.getSymbol())
                .orElseThrow(() -> new StockNotFoundException("Stock with symbol '" + request.getSymbol() + "' does not exist."));

        BigDecimal unitPrice = stock.getCurrentPrice();
        BigDecimal totalCost = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity())).setScale(2, RoundingMode.HALF_UP);

        if (user.getVirtualCashBalance().compareTo(totalCost) < 0) {
            throw new InsufficientBalanceException(String.format(
                    "Insufficient cash balance to buy %d shares of %s. Required: %s %.2f, Available: %s %.2f",
                    request.getQuantity(), stock.getSymbol(), stock.getCurrency(), totalCost, stock.getCurrency(), user.getVirtualCashBalance()
            ));
        }

        // Deduct cash via encapsulated method
        user.deductCash(totalCost);
        userRepository.save(user);

        // Update portfolio
        portfolioService.updatePortfolioOnBuy(user, stock, request.getQuantity(), unitPrice);

        // Record transaction
        Transaction tx = transactionService.recordTransaction(
                user, stock.getSymbol(), stock.getCompanyName(),
                TransactionType.BUY, request.getQuantity(), unitPrice, totalCost
        );

        return TradeResponse.success(
                String.format("Successfully purchased %d shares of %s (%s) for %s %.2f",
                        request.getQuantity(), stock.getSymbol(), stock.getCompanyName(), stock.getCurrency(), totalCost),
                tx.getId(),
                stock.getSymbol(),
                stock.getCompanyName(),
                TransactionType.BUY,
                request.getQuantity(),
                unitPrice,
                totalCost,
                user.getVirtualCashBalance()
        );
    }

    /**
     * Executes a SELL order with atomic validation:
     * 1. Validate quantity > 0
     * 2. Verify user holds the stock and has sufficient quantity
     * 3. Find current stock price
     * 4. Compute total sale proceeds
     * 5. Credit user cash balance
     * 6. Deduct or remove portfolio holding
     * 7. Record transaction audit log
     */
    public synchronized TradeResponse sellStock(TradeRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive integer greater than zero.");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + request.getUserId() + " not found."));

        Stock stock = stockRepository.findBySymbolIgnoreCase(request.getSymbol())
                .orElseThrow(() -> new StockNotFoundException("Stock with symbol '" + request.getSymbol() + "' does not exist."));

        Optional<PortfolioItem> holdingOpt = portfolioService.getHolding(user.getId(), stock.getSymbol());
        if (holdingOpt.isEmpty() || holdingOpt.get().getQuantity() < request.getQuantity()) {
            int owned = holdingOpt.map(PortfolioItem::getQuantity).orElse(0);
            throw new InsufficientStockException(String.format(
                    "Cannot sell %d shares of %s. You currently only own %d share(s).",
                    request.getQuantity(), stock.getSymbol(), owned
            ));
        }

        BigDecimal unitPrice = stock.getCurrentPrice();
        BigDecimal proceeds = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity())).setScale(2, RoundingMode.HALF_UP);

        // Credit cash via encapsulated method
        user.addCash(proceeds);
        userRepository.save(user);

        // Update portfolio
        portfolioService.updatePortfolioOnSell(user, stock, request.getQuantity());

        // Record transaction
        Transaction tx = transactionService.recordTransaction(
                user, stock.getSymbol(), stock.getCompanyName(),
                TransactionType.SELL, request.getQuantity(), unitPrice, proceeds
        );

        return TradeResponse.success(
                String.format("Successfully sold %d shares of %s (%s) for %s %.2f",
                        request.getQuantity(), stock.getSymbol(), stock.getCompanyName(), stock.getCurrency(), proceeds),
                tx.getId(),
                stock.getSymbol(),
                stock.getCompanyName(),
                TransactionType.SELL,
                request.getQuantity(),
                unitPrice,
                proceeds,
                user.getVirtualCashBalance()
        );
    }

    /**
     * Reset user balance and portfolio for testing purposes.
     */
    public User resetAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));
        user.setVirtualCashBalance(new BigDecimal("100000.00"));
        user.getPortfolioItems().clear();
        return userRepository.save(user);
    }
}
