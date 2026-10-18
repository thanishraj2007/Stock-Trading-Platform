export interface JavaFileItem {
  id: string;
  name: string;
  path: string;
  category: 'model' | 'service' | 'controller' | 'repository' | 'dto' | 'exception' | 'config' | 'config-files' | 'test' | 'docs';
  oopRole: string;
  description: string;
  content: string;
}

export const JAVA_PROJECT_FILES: JavaFileItem[] = [
  {
    id: 'pom',
    name: 'pom.xml',
    path: 'pom.xml',
    category: 'config-files',
    oopRole: 'Maven Build & Dependencies',
    description: 'Maven configuration containing Spring Boot 3, Spring Data JPA, H2/MySQL drivers, Jakarta validation, and JUnit 5.',
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.3</version>
        <relativePath/>
    </parent>

    <groupId>com.codealpha</groupId>
    <artifactId>stock-trading-platform</artifactId>
    <version>1.0.0</version>
    <name>stock-trading-platform</name>
    <description>CodeAlpha Java Programming Internship - Task 2: Stock Trading Platform</description>

    <properties>
        <java.version>17</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
  },
  {
    id: 'abstract-asset',
    name: 'AbstractFinancialAsset.java',
    path: 'src/main/java/com/codealpha/trading/model/AbstractFinancialAsset.java',
    category: 'model',
    oopRole: 'Abstraction & Inheritance (OOP)',
    description: 'Abstract base class establishing identity contracts and polymorphic valuation computation.',
    content: `package com.codealpha.trading.model;

import java.math.BigDecimal;

/**
 * Abstraction & Inheritance OOP Concept:
 * Abstract base class representing any tradable financial asset in the system.
 * Subclasses (such as Stock) inherit common properties like symbol, name, and currency,
 * and implement abstract behavior for calculating valuation.
 */
public abstract class AbstractFinancialAsset {

    private String symbol;
    private String companyName;
    private String currency;

    public AbstractFinancialAsset() {}

    public AbstractFinancialAsset(String symbol, String companyName, String currency) {
        this.symbol = symbol;
        this.companyName = companyName;
        this.currency = currency;
    }

    // Abstract method enforcing polymorphism across financial asset types
    public abstract BigDecimal calculateValuation(int units);

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
}`
  },
  {
    id: 'stock',
    name: 'Stock.java',
    path: 'src/main/java/com/codealpha/trading/model/Stock.java',
    category: 'model',
    oopRole: 'Inheritance & Encapsulation (OOP)',
    description: 'Stock entity extending AbstractFinancialAsset with strictly encapsulated properties.',
    content: `package com.codealpha.trading.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
public class Stock extends AbstractFinancialAsset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String symbol;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "current_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal currentPrice;

    @Column(name = "daily_price_change", nullable = false, precision = 15, scale = 2)
    private BigDecimal dailyPriceChange;

    @Column(name = "daily_change_percentage", nullable = false, precision = 8, scale = 2)
    private BigDecimal dailyChangePercentage;

    @Column(nullable = false, length = 10)
    private String currency;

    @Column(nullable = false, length = 100)
    private String sector;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public Stock() {
        super();
        this.updatedAt = LocalDateTime.now();
    }

    public Stock(String symbol, String companyName, BigDecimal currentPrice, 
                 BigDecimal dailyPriceChange, BigDecimal dailyChangePercentage, 
                 String currency, String sector) {
        super(symbol, companyName, currency);
        this.symbol = symbol;
        this.companyName = companyName;
        this.currentPrice = currentPrice;
        this.dailyPriceChange = dailyPriceChange;
        this.dailyChangePercentage = dailyChangePercentage;
        this.currency = currency;
        this.sector = sector;
        this.updatedAt = LocalDateTime.now();
    }

    @Override
    public BigDecimal calculateValuation(int units) {
        if (units <= 0 || currentPrice == null) return BigDecimal.ZERO;
        return currentPrice.multiply(BigDecimal.valueOf(units)).setScale(2, RoundingMode.HALF_UP);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; super.setSymbol(symbol); }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; super.setCompanyName(companyName); }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; this.updatedAt = LocalDateTime.now(); }
    public BigDecimal getDailyPriceChange() { return dailyPriceChange; }
    public void setDailyPriceChange(BigDecimal dailyPriceChange) { this.dailyPriceChange = dailyPriceChange; }
    public BigDecimal getDailyChangePercentage() { return dailyChangePercentage; }
    public void setDailyChangePercentage(BigDecimal dailyChangePercentage) { this.dailyChangePercentage = dailyChangePercentage; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; super.setCurrency(currency); }
    public String getSector() { return sector; }
    public void setSector(String sector) { this.sector = sector; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}`
  },
  {
    id: 'user',
    name: 'User.java',
    path: 'src/main/java/com/codealpha/trading/model/User.java',
    category: 'model',
    oopRole: 'Encapsulation & Domain Invariants (OOP)',
    description: 'Encapsulates virtual balance with deductCash() and addCash() invariant enforcement.',
    content: `package com.codealpha.trading.model;

import com.codealpha.trading.exception.InsufficientBalanceException;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(nullable = false, unique = true, length = 150)
    private String email;

    @Column(name = "virtual_cash_balance", nullable = false, precision = 15, scale = 2)
    private BigDecimal virtualCashBalance;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PortfolioItem> portfolioItems = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Transaction> transactions = new ArrayList<>();

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public User() {
        this.virtualCashBalance = new BigDecimal("100000.00");
        this.createdAt = LocalDateTime.now();
    }

    public User(String username, String fullName, String email, BigDecimal virtualCashBalance) {
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.virtualCashBalance = virtualCashBalance != null ? virtualCashBalance : new BigDecimal("100000.00");
        this.createdAt = LocalDateTime.now();
    }

    public synchronized void deductCash(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deduction amount must be greater than zero.");
        }
        if (this.virtualCashBalance.compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Insufficient virtual cash balance. Required: ₹" 
                    + amount + ", Available: ₹" + this.virtualCashBalance);
        }
        this.virtualCashBalance = this.virtualCashBalance.subtract(amount).setScale(2, RoundingMode.HALF_UP);
    }

    public synchronized void addCash(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Credit amount must be greater than zero.");
        }
        this.virtualCashBalance = this.virtualCashBalance.add(amount).setScale(2, RoundingMode.HALF_UP);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public BigDecimal getVirtualCashBalance() { return virtualCashBalance; }
    public void setVirtualCashBalance(BigDecimal virtualCashBalance) { this.virtualCashBalance = virtualCashBalance; }
    public List<PortfolioItem> getPortfolioItems() { return portfolioItems; }
    public void setPortfolioItems(List<PortfolioItem> portfolioItems) { this.portfolioItems = portfolioItems; }
    public List<Transaction> getTransactions() { return transactions; }
    public void setTransactions(List<Transaction> transactions) { this.transactions = transactions; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}`
  },
  {
    id: 'portfolio-item',
    name: 'PortfolioItem.java',
    path: 'src/main/java/com/codealpha/trading/model/PortfolioItem.java',
    category: 'model',
    oopRole: 'Encapsulation & Dynamic Math (OOP)',
    description: 'Manages holding quantity, weighted average purchase price, valuation and profit/loss.',
    content: `package com.codealpha.trading.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

@Entity
@Table(name = "portfolio_items", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "stock_id"})
})
public class PortfolioItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "stock_id", nullable = false)
    private Stock stock;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "average_purchase_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal averagePurchasePrice;

    @Column(name = "total_invested", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalInvested;

    public PortfolioItem() {}

    public PortfolioItem(User user, Stock stock, int quantity, BigDecimal purchasePrice) {
        this.user = user;
        this.stock = stock;
        this.quantity = quantity;
        this.averagePurchasePrice = purchasePrice;
        this.totalInvested = purchasePrice.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
    }

    public void addShares(int newQuantity, BigDecimal pricePerShare) {
        BigDecimal additionalInvestment = pricePerShare.multiply(BigDecimal.valueOf(newQuantity));
        int totalNewQuantity = this.quantity + newQuantity;
        BigDecimal newTotalInvested = this.totalInvested.add(additionalInvestment);

        this.quantity = totalNewQuantity;
        this.totalInvested = newTotalInvested.setScale(2, RoundingMode.HALF_UP);
        this.averagePurchasePrice = newTotalInvested.divide(BigDecimal.valueOf(totalNewQuantity), 2, RoundingMode.HALF_UP);
    }

    public void removeShares(int soldQuantity) {
        if (soldQuantity > this.quantity) throw new IllegalArgumentException("Cannot remove more shares than owned.");
        int remainingQuantity = this.quantity - soldQuantity;
        this.quantity = remainingQuantity;
        if (remainingQuantity == 0) {
            this.totalInvested = BigDecimal.ZERO;
            this.averagePurchasePrice = BigDecimal.ZERO;
        } else {
            this.totalInvested = this.averagePurchasePrice.multiply(BigDecimal.valueOf(remainingQuantity)).setScale(2, RoundingMode.HALF_UP);
        }
    }

    public BigDecimal calculateCurrentValue() {
        if (stock == null || stock.getCurrentPrice() == null) return BigDecimal.ZERO;
        return stock.getCurrentPrice().multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateProfitLoss() {
        return calculateCurrentValue().subtract(totalInvested).setScale(2, RoundingMode.HALF_UP);
    }

    public BigDecimal calculateProfitLossPercentage() {
        if (totalInvested.compareTo(BigDecimal.ZERO) == 0) return BigDecimal.ZERO;
        return calculateProfitLoss().divide(totalInvested, 4, RoundingMode.HALF_UP).multiply(BigDecimal.valueOf(100)).setScale(2, RoundingMode.HALF_UP);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Stock getStock() { return stock; }
    public void setStock(Stock stock) { this.stock = stock; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getAveragePurchasePrice() { return averagePurchasePrice; }
    public void setAveragePurchasePrice(BigDecimal averagePurchasePrice) { this.averagePurchasePrice = averagePurchasePrice; }
    public BigDecimal getTotalInvested() { return totalInvested; }
    public void setTotalInvested(BigDecimal totalInvested) { this.totalInvested = totalInvested; }
}`
  },
  {
    id: 'transaction-entity',
    name: 'Transaction.java',
    path: 'src/main/java/com/codealpha/trading/model/Transaction.java',
    category: 'model',
    oopRole: 'Encapsulation & Audit Entity (OOP)',
    description: 'Immutable record representing executed stock buy or sell orders.',
    content: `package com.codealpha.trading.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(name = "stock_symbol", nullable = false, length = 20)
    private String stockSymbol;

    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false, length = 10)
    private TransactionType transactionType;

    @Column(nullable = false)
    private int quantity;

    @Column(name = "execution_price", nullable = false, precision = 15, scale = 2)
    private BigDecimal executionPrice;

    @Column(name = "total_amount", nullable = false, precision = 15, scale = 2)
    private BigDecimal totalAmount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Transaction() {
        this.createdAt = LocalDateTime.now();
    }

    public Transaction(User user, String stockSymbol, String companyName,
                       TransactionType transactionType, int quantity,
                       BigDecimal executionPrice, BigDecimal totalAmount) {
        this.user = user;
        this.stockSymbol = stockSymbol;
        this.companyName = companyName;
        this.transactionType = transactionType;
        this.quantity = quantity;
        this.executionPrice = executionPrice;
        this.totalAmount = totalAmount;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getStockSymbol() { return stockSymbol; }
    public void setStockSymbol(String stockSymbol) { this.stockSymbol = stockSymbol; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public TransactionType getTransactionType() { return transactionType; }
    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public BigDecimal getExecutionPrice() { return executionPrice; }
    public void setExecutionPrice(BigDecimal executionPrice) { this.executionPrice = executionPrice; }
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}`
  },
  {
    id: 'trading-service',
    name: 'TradingService.java',
    path: 'src/main/java/com/codealpha/trading/service/TradingService.java',
    category: 'service',
    oopRole: 'Business Logic & ACID Transactions',
    description: 'Atomic trade execution service handling buy/sell orders, validation, balances, and audit records.',
    content: `package com.codealpha.trading.service;

import com.codealpha.trading.dto.TradeRequest;
import com.codealpha.trading.dto.TradeResponse;
import com.codealpha.trading.exception.InsufficientBalanceException;
import com.codealpha.trading.exception.InsufficientStockException;
import com.codealpha.trading.exception.StockNotFoundException;
import com.codealpha.trading.model.*;
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

    public synchronized TradeResponse buyStock(TradeRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive integer greater than zero.");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Stock stock = stockRepository.findBySymbolIgnoreCase(request.getSymbol())
                .orElseThrow(() -> new StockNotFoundException("Stock with symbol '" + request.getSymbol() + "' not found."));

        BigDecimal unitPrice = stock.getCurrentPrice();
        BigDecimal totalCost = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity())).setScale(2, RoundingMode.HALF_UP);

        if (user.getVirtualCashBalance().compareTo(totalCost) < 0) {
            throw new InsufficientBalanceException("Insufficient virtual cash. Required: " + totalCost + ", Available: " + user.getVirtualCashBalance());
        }

        user.deductCash(totalCost);
        userRepository.save(user);

        portfolioService.updatePortfolioOnBuy(user, stock, request.getQuantity(), unitPrice);

        Transaction tx = transactionService.recordTransaction(
                user, stock.getSymbol(), stock.getCompanyName(),
                TransactionType.BUY, request.getQuantity(), unitPrice, totalCost
        );

        return TradeResponse.success("Successfully bought " + request.getQuantity() + " shares of " + stock.getSymbol(),
                tx.getId(), stock.getSymbol(), stock.getCompanyName(), TransactionType.BUY, request.getQuantity(), unitPrice, totalCost, user.getVirtualCashBalance());
    }

    public synchronized TradeResponse sellStock(TradeRequest request) {
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new IllegalArgumentException("Quantity must be a positive integer.");
        }

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        Stock stock = stockRepository.findBySymbolIgnoreCase(request.getSymbol())
                .orElseThrow(() -> new StockNotFoundException("Stock not found."));

        Optional<PortfolioItem> holdingOpt = portfolioService.getHolding(user.getId(), stock.getSymbol());
        if (holdingOpt.isEmpty() || holdingOpt.get().getQuantity() < request.getQuantity()) {
            int owned = holdingOpt.map(PortfolioItem::getQuantity).orElse(0);
            throw new InsufficientStockException("Cannot sell " + request.getQuantity() + " shares. You only own " + owned);
        }

        BigDecimal unitPrice = stock.getCurrentPrice();
        BigDecimal proceeds = unitPrice.multiply(BigDecimal.valueOf(request.getQuantity())).setScale(2, RoundingMode.HALF_UP);

        user.addCash(proceeds);
        userRepository.save(user);

        portfolioService.updatePortfolioOnSell(user, stock, request.getQuantity());

        Transaction tx = transactionService.recordTransaction(
                user, stock.getSymbol(), stock.getCompanyName(),
                TransactionType.SELL, request.getQuantity(), unitPrice, proceeds
        );

        return TradeResponse.success("Successfully sold " + request.getQuantity() + " shares of " + stock.getSymbol(),
                tx.getId(), stock.getSymbol(), stock.getCompanyName(), TransactionType.SELL, request.getQuantity(), unitPrice, proceeds, user.getVirtualCashBalance());
    }

    public User resetAccount(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setVirtualCashBalance(new BigDecimal("100000.00"));
        user.getPortfolioItems().clear();
        return userRepository.save(user);
    }
}`
  },
  {
    id: 'stock-controller',
    name: 'StockTradingController.java',
    path: 'src/main/java/com/codealpha/trading/controller/StockTradingController.java',
    category: 'controller',
    oopRole: 'REST API Controller & HTTP Contract',
    description: 'Spring Boot REST controller handling HTTP requests and mapping responses.',
    content: `package com.codealpha.trading.controller;

import com.codealpha.trading.dto.*;
import com.codealpha.trading.model.*;
import com.codealpha.trading.repository.UserRepository;
import com.codealpha.trading.service.*;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class StockTradingController {

    private final StockService stockService;
    private final TradingService tradingService;
    private final PortfolioService portfolioService;
    private final TransactionService transactionService;
    private final UserRepository userRepository;

    @Autowired
    public StockTradingController(StockService stockService, TradingService tradingService,
                                  PortfolioService portfolioService, TransactionService transactionService,
                                  UserRepository userRepository) {
        this.stockService = stockService;
        this.tradingService = tradingService;
        this.portfolioService = portfolioService;
        this.transactionService = transactionService;
        this.userRepository = userRepository;
    }

    @GetMapping("/stocks")
    public ResponseEntity<List<Stock>> getAllStocks() {
        return ResponseEntity.ok(stockService.getAllStocks());
    }

    @GetMapping("/stocks/{symbol}")
    public ResponseEntity<Stock> getStockBySymbol(@PathVariable String symbol) {
        return ResponseEntity.ok(stockService.getStockBySymbol(symbol));
    }

    @PostMapping("/stocks/simulate-tick")
    public ResponseEntity<List<Stock>> simulateMarketTick() {
        return ResponseEntity.ok(stockService.simulateMarketTick());
    }

    @PostMapping("/trade/buy")
    public ResponseEntity<TradeResponse> buyStock(@Valid @RequestBody TradeRequest request) {
        return ResponseEntity.ok(tradingService.buyStock(request));
    }

    @PostMapping("/trade/sell")
    public ResponseEntity<TradeResponse> sellStock(@Valid @RequestBody TradeRequest request) {
        return ResponseEntity.ok(tradingService.sellStock(request));
    }

    @GetMapping("/portfolio/{userId}")
    public ResponseEntity<PortfolioSummaryResponse> getPortfolioSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(portfolioService.getPortfolioSummary(userId));
    }

    @GetMapping("/transactions/{userId}")
    public ResponseEntity<List<Transaction>> getTransactions(
            @PathVariable Long userId, @RequestParam(required = false) TransactionType type) {
        if (type != null) {
            return ResponseEntity.ok(transactionService.getUserTransactionsByType(userId, type));
        }
        return ResponseEntity.ok(transactionService.getUserTransactions(userId));
    }

    @PostMapping("/user/{userId}/reset")
    public ResponseEntity<User> resetUserAccount(@PathVariable Long userId) {
        return ResponseEntity.ok(tradingService.resetAccount(userId));
    }
}`
  },
  {
    id: 'test-suite',
    name: 'TradingServiceTest.java',
    path: 'src/test/java/com/codealpha/trading/TradingServiceTest.java',
    category: 'test',
    oopRole: 'Automated Unit Tests (JUnit 5 & Mockito)',
    description: 'Unit tests covering buy execution, balance enforcement, sell execution, and share limits.',
    content: `package com.codealpha.trading;

import com.codealpha.trading.dto.TradeRequest;
import com.codealpha.trading.dto.TradeResponse;
import com.codealpha.trading.exception.InsufficientBalanceException;
import com.codealpha.trading.exception.InsufficientStockException;
import com.codealpha.trading.model.*;
import com.codealpha.trading.repository.StockRepository;
import com.codealpha.trading.repository.UserRepository;
import com.codealpha.trading.service.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TradingServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private StockRepository stockRepository;
    @Mock private PortfolioService portfolioService;
    @Mock private TransactionService transactionService;

    @InjectMocks private TradingService tradingService;

    private User sampleUser;
    private Stock sampleStock;

    @BeforeEach
    void setUp() {
        sampleUser = new User("codealpha_trader", "CodeAlpha Intern", "trader@codealpha.edu", new BigDecimal("100000.00"));
        sampleUser.setId(1L);
        sampleStock = new Stock("TCS", "Tata Consultancy Services", new BigDecimal("3900.00"), new BigDecimal("50.00"), new BigDecimal("1.25"), "INR", "IT");
        sampleStock.setId(1L);
    }

    @Test
    @DisplayName("Should successfully buy stock when balance is sufficient")
    void testBuyStock_Success() {
        TradeRequest request = new TradeRequest(1L, "TCS", 10);
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(stockRepository.findBySymbolIgnoreCase("TCS")).thenReturn(Optional.of(sampleStock));
        when(transactionService.recordTransaction(any(), any(), any(), any(), anyInt(), any(), any()))
                .thenReturn(new Transaction(sampleUser, "TCS", "Tata Consultancy Services", TransactionType.BUY, 10, new BigDecimal("3900.00"), new BigDecimal("39000.00")));

        TradeResponse response = tradingService.buyStock(request);

        assertTrue(response.isSuccess());
        assertEquals(new BigDecimal("61000.00"), sampleUser.getVirtualCashBalance());
        verify(userRepository, times(1)).save(sampleUser);
    }

    @Test
    @DisplayName("Should throw InsufficientBalanceException when buying exceeds cash")
    void testBuyStock_InsufficientFunds() {
        sampleUser.setVirtualCashBalance(new BigDecimal("1000.00"));
        TradeRequest request = new TradeRequest(1L, "TCS", 10);

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(stockRepository.findBySymbolIgnoreCase("TCS")).thenReturn(Optional.of(sampleStock));

        assertThrows(InsufficientBalanceException.class, () -> tradingService.buyStock(request));
    }

    @Test
    @DisplayName("Should throw InsufficientStockException when selling more shares than owned")
    void testSellStock_InsufficientShares() {
        TradeRequest request = new TradeRequest(1L, "TCS", 10);
        PortfolioItem holding = new PortfolioItem(sampleUser, sampleStock, 3, new BigDecimal("3800.00"));

        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser));
        when(stockRepository.findBySymbolIgnoreCase("TCS")).thenReturn(Optional.of(sampleStock));
        when(portfolioService.getHolding(1L, "TCS")).thenReturn(Optional.of(holding));

        assertThrows(InsufficientStockException.class, () -> tradingService.sellStock(request));
    }
}`
  }
];
