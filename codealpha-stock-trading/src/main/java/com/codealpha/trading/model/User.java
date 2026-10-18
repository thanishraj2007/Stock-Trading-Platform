package com.codealpha.trading.model;

import com.codealpha.trading.exception.InsufficientBalanceException;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Encapsulation:
 * User entity encapsulating user identity, virtual cash balance, and relationships
 * to portfolio items and executed transactions.
 * Balance modifications are guarded by business logic methods (deposit, deduct).
 */
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

    /**
     * Encapsulated business method to safely deduct cash with balance validation.
     */
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

    /**
     * Encapsulated business method to add cash proceeds from sales or deposits.
     */
    public synchronized void addCash(BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Credit amount must be greater than zero.");
        }
        this.virtualCashBalance = this.virtualCashBalance.add(amount).setScale(2, RoundingMode.HALF_UP);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public BigDecimal getVirtualCashBalance() {
        return virtualCashBalance;
    }

    public void setVirtualCashBalance(BigDecimal virtualCashBalance) {
        this.virtualCashBalance = virtualCashBalance;
    }

    public List<PortfolioItem> getPortfolioItems() {
        return portfolioItems;
    }

    public void setPortfolioItems(List<PortfolioItem> portfolioItems) {
        this.portfolioItems = portfolioItems;
    }

    public List<Transaction> getTransactions() {
        return transactions;
    }

    public void setTransactions(List<Transaction> transactions) {
        this.transactions = transactions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
