package com.codealpha.trading.service;

import com.codealpha.trading.dto.PortfolioSummaryResponse;
import com.codealpha.trading.model.PortfolioItem;
import com.codealpha.trading.model.Stock;
import com.codealpha.trading.model.User;
import com.codealpha.trading.repository.PortfolioRepository;
import com.codealpha.trading.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PortfolioService {

    private final PortfolioRepository portfolioRepository;
    private final UserRepository userRepository;

    @Autowired
    public PortfolioService(PortfolioRepository portfolioRepository, UserRepository userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<PortfolioItem> getUserHoldings(Long userId) {
        return portfolioRepository.findByUserId(userId);
    }

    @Transactional(readOnly = true)
    public Optional<PortfolioItem> getHolding(Long userId, String stockSymbol) {
        return portfolioRepository.findByUserIdAndStockSymbolIgnoreCase(userId, stockSymbol);
    }

    public PortfolioItem updatePortfolioOnBuy(User user, Stock stock, int quantity, BigDecimal executionPrice) {
        Optional<PortfolioItem> existingOpt = portfolioRepository.findByUserAndStock(user, stock);
        PortfolioItem item;
        if (existingOpt.isPresent()) {
            item = existingOpt.get();
            item.addShares(quantity, executionPrice);
        } else {
            item = new PortfolioItem(user, stock, quantity, executionPrice);
        }
        return portfolioRepository.save(item);
    }

    public void updatePortfolioOnSell(User user, Stock stock, int quantity) {
        Optional<PortfolioItem> existingOpt = portfolioRepository.findByUserAndStock(user, stock);
        if (existingOpt.isEmpty()) {
            throw new IllegalStateException("Attempted to sell shares that are not in the portfolio.");
        }
        PortfolioItem item = existingOpt.get();
        if (item.getQuantity() == quantity) {
            portfolioRepository.delete(item);
        } else {
            item.removeShares(quantity);
            portfolioRepository.save(item);
        }
    }

    @Transactional(readOnly = true)
    public PortfolioSummaryResponse getPortfolioSummary(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User with ID " + userId + " not found."));

        List<PortfolioItem> items = portfolioRepository.findByUserId(userId);
        BigDecimal totalInvested = BigDecimal.ZERO;
        BigDecimal totalCurrentValue = BigDecimal.ZERO;
        List<PortfolioSummaryResponse.PortfolioItemDto> dtos = new ArrayList<>();

        for (PortfolioItem item : items) {
            BigDecimal invested = item.getTotalInvested();
            BigDecimal currentVal = item.calculateCurrentValue();
            BigDecimal pnl = item.calculateProfitLoss();
            BigDecimal pnlPct = item.calculateProfitLossPercentage();

            totalInvested = totalInvested.add(invested);
            totalCurrentValue = totalCurrentValue.add(currentVal);

            PortfolioSummaryResponse.PortfolioItemDto dto = new PortfolioSummaryResponse.PortfolioItemDto();
            dto.setId(item.getId());
            dto.setSymbol(item.getStock().getSymbol());
            dto.setCompanyName(item.getStock().getCompanyName());
            dto.setQuantity(item.getQuantity());
            dto.setAveragePurchasePrice(item.getAveragePurchasePrice());
            dto.setCurrentPrice(item.getStock().getCurrentPrice());
            dto.setTotalInvested(invested);
            dto.setCurrentValue(currentVal);
            dto.setProfitLoss(pnl);
            dto.setProfitLossPercentage(pnlPct);
            dto.setCurrency(item.getStock().getCurrency());
            dtos.add(dto);
        }

        BigDecimal overallProfitLoss = totalCurrentValue.subtract(totalInvested).setScale(2, RoundingMode.HALF_UP);
        BigDecimal overallProfitLossPercentage = BigDecimal.ZERO;
        if (totalInvested.compareTo(BigDecimal.ZERO) > 0) {
            overallProfitLossPercentage = overallProfitLoss
                    .divide(totalInvested, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100))
                    .setScale(2, RoundingMode.HALF_UP);
        }

        PortfolioSummaryResponse summary = new PortfolioSummaryResponse();
        summary.setUserId(user.getId());
        summary.setUsername(user.getUsername());
        summary.setVirtualCashBalance(user.getVirtualCashBalance());
        summary.setTotalPortfolioValue(totalCurrentValue.add(user.getVirtualCashBalance()).setScale(2, RoundingMode.HALF_UP));
        summary.setTotalInvested(totalInvested);
        summary.setOverallProfitLoss(overallProfitLoss);
        summary.setOverallProfitLossPercentage(overallProfitLossPercentage);
        summary.setOwnedStocksCount(dtos.size());
        summary.setHoldings(dtos);

        return summary;
    }
}
