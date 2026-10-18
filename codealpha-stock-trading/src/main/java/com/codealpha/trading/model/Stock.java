package com.codealpha.trading.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;

/**
 * Encapsulation & Inheritance:
 * Stock represents an equity share entity extending AbstractFinancialAsset.
 * All properties are private and accessed through strictly encapsulated getters and setters.
 */
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

    /**
     * Polymorphic implementation of calculateValuation from AbstractFinancialAsset.
     */
    @Override
    public BigDecimal calculateValuation(int units) {
        if (units <= 0 || currentPrice == null) {
            return BigDecimal.ZERO;
        }
        return currentPrice.multiply(BigDecimal.valueOf(units)).setScale(2, RoundingMode.HALF_UP);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String getSymbol() {
        return symbol;
    }

    @Override
    public void setSymbol(String symbol) {
        this.symbol = symbol;
        super.setSymbol(symbol);
    }

    @Override
    public String getCompanyName() {
        return companyName;
    }

    @Override
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
        super.setCompanyName(companyName);
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
        this.updatedAt = LocalDateTime.now();
    }

    public BigDecimal getDailyPriceChange() {
        return dailyPriceChange;
    }

    public void setDailyPriceChange(BigDecimal dailyPriceChange) {
        this.dailyPriceChange = dailyPriceChange;
    }

    public BigDecimal getDailyChangePercentage() {
        return dailyChangePercentage;
    }

    public void setDailyChangePercentage(BigDecimal dailyChangePercentage) {
        this.dailyChangePercentage = dailyChangePercentage;
    }

    @Override
    public String getCurrency() {
        return currency;
    }

    @Override
    public void setCurrency(String currency) {
        this.currency = currency;
        super.setCurrency(currency);
    }

    public String getSector() {
        return sector;
    }

    public void setSector(String sector) {
        this.sector = sector;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "Stock{" +
                "symbol='" + symbol + '\'' +
                ", companyName='" + companyName + '\'' +
                ", currentPrice=" + currentPrice +
                ", dailyPriceChange=" + dailyPriceChange +
                ", dailyChangePercentage=" + dailyChangePercentage +
                ", currency='" + currency + '\'' +
                '}';
    }
}
