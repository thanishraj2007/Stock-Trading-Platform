package com.codealpha.trading.controller;

import com.codealpha.trading.dto.PortfolioSummaryResponse;
import com.codealpha.trading.dto.TradeRequest;
import com.codealpha.trading.dto.TradeResponse;
import com.codealpha.trading.model.Stock;
import com.codealpha.trading.model.Transaction;
import com.codealpha.trading.model.TransactionType;
import com.codealpha.trading.model.User;
import com.codealpha.trading.repository.UserRepository;
import com.codealpha.trading.service.PortfolioService;
import com.codealpha.trading.service.StockService;
import com.codealpha.trading.service.TradingService;
import com.codealpha.trading.service.TransactionService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST API Controller for CodeAlpha Stock Trading Platform.
 * Connects frontend clients with Spring Boot backend services.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // Allows cross-origin requests from frontend
public class StockTradingController {

    private final StockService stockService;
    private final TradingService tradingService;
    private final PortfolioService portfolioService;
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    @Autowired
    public StockTradingController(StockService stockService,
                                  TradingService tradingService,
                                  PortfolioService portfolioService,
                                  TransactionService transactionService,
                                  UserRepository userRepository) {
        this.stockService = stockService;
        this.tradingService = tradingService;
        this.portfolioService = portfolioService;
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    /**
     * Fetch user profile and virtual cash balance.
     * GET /api/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long userId) {
        return userRepository.findById(userId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Fetch all available stocks with current prices.
     * GET /api/stocks
     */
    @GetMapping("/stocks")
    public ResponseEntity<List<Stock>> getAllStocks() {
        return ResponseEntity.ok(stockService.getAllStocks());
    }

    /**
     * Fetch single stock details by symbol.
     * GET /api/stocks/{symbol}
     */
    @GetMapping("/stocks/{symbol}")
    public ResponseEntity<Stock> getStockBySymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(stockService.getStockBySymbol(symbol));
    }

    /**
     * Trigger simulated market price fluctuation.
     * POST /api/stocks/simulate-tick
     */
    @PostMapping("/stocks/simulate-tick")
    public ResponseEntity<List<Stock>> simulateMarketTick() {
        return ResponseEntity.ok(stockService.simulateMarketTick());
    }

    /**
     * Execute stock purchase order.
     * POST /api/trade/buy
     */
    @PostMapping("/trade/buy")
    public ResponseEntity<TradeResponse> buyStock(@Valid @RequestBody TradeRequest request) {
        TradeResponse response = tradingService.buyStock(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Execute stock sell order.
     * POST /api/trade/sell
     */
    @PostMapping("/trade/sell")
    public ResponseEntity<TradeResponse> sellStock(@Valid @RequestBody TradeRequest request) {
        TradeResponse response = tradingService.sellStock(request);
        return ResponseEntity.ok(response);
    }

    /**
     * Fetch complete portfolio summary with real-time valuations & P&L.
     * GET /api/portfolio/{userId}
     */
    @GetMapping("/portfolio/{userId}")
    public ResponseEntity<PortfolioSummaryResponse> getPortfolioSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(portfolioService.getPortfolioSummary(userId));
    }

    /**
     * Fetch transaction history for user with optional BUY/SELL filtering.
     * GET /api/transactions/{userId}?type=BUY
     */
    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<Transaction>> getTransactions(
            @PathVariable Long userId,
            @RequestParam(required = false) TransactionType type) {
        if (type != null) {
            return ResponseEntity.ok(transactionService.getUserTransactionsByType(userId, type));
        }
        return ResponseEntity.ok(transactionService.getUserTransactions(userId));
    }

    /**
     * Reset user balance and portfolio to initial demo state.
     * POST /api/user/{userId}/reset
     */
    @PostMapping("/user/{userId}/reset")
    public ResponseEntity<User> resetUserAccount(@PathVariable Long userId) {
        return ResponseEntity.ok(tradingService.resetAccount(userId));
    }
}
