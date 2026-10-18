package com.codealpha.trading.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * PortfolioItem:
 * Represents a user's holdings of a particular stock.
 * Encapsulates quantity, average purchase price, invested amount, and dynamically
 * computes current value and unrealized profit/loss.
 */
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

    public PortfolioItem() {
    }

    public PortfolioItem(User user, Stock stock, int quantity, BigDecimal purchasePrice) {
        this.user = user;
        this.stock = stock;
        this.quantity = quantity;
        this.averagePurchasePrice = purchasePrice;
        this.totalInvested = purchasePrice.multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Add shares to this position and recompute weighted average purchase price.
     */
    public void addShares(int newQuantity, BigDecimal pricePerShare) {
        BigDecimal additionalInvestment = pricePerShare.multiply(BigDecimal.valueOf(newQuantity));
        int totalNewQuantity = this.quantity + newQuantity;
        BigDecimal newTotalInvested = this.totalInvested.add(additionalInvestment);

        this.quantity = totalNewQuantity;
        this.totalInvested = newTotalInvested.setScale(2, RoundingMode.HALF_UP);
        this.averagePurchasePrice = newTotalInvested.divide(BigDecimal.valueOf(totalNewQuantity), 2, RoundingMode.HALF_UP);
    }

    /**
     * Remove shares after selling and reduce total invested proportionally.
     */
    public void removeShares(int soldQuantity) {
        if (soldQuantity > this.quantity) {
            throw new IllegalArgumentException("Cannot remove more shares than currently owned.");
        }
        int remainingQuantity = this.quantity - soldQuantity;
        this.quantity = remainingQuantity;
        if (remainingQuantity == 0) {
            this.totalInvested = BigDecimal.ZERO;
            this.averagePurchasePrice = BigDecimal.ZERO;
        } else {
            this.totalInvested = this.averagePurchasePrice.multiply(BigDecimal.valueOf(remainingQuantity)).setScale(2, RoundingMode.HALF_UP);
        }
    }

    /**
     * Calculate current market value based on latest stock price.
     */
    public BigDecimal calculateCurrentValue() {
        if (stock == null || stock.getCurrentPrice() == null) {
            return BigDecimal.ZERO;
        }
        return stock.getCurrentPrice().multiply(BigDecimal.valueOf(quantity)).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate unrealized profit/loss in currency units.
     */
    public BigDecimal calculateProfitLoss() {
        return calculateCurrentValue().subtract(totalInvested).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * Calculate unrealized profit/loss percentage.
     */
    public BigDecimal calculateProfitLossPercentage() {
        if (totalInvested.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return calculateProfitLoss()
                .divide(totalInvested, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(2, RoundingMode.HALF_UP);
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Stock getStock() {
        return stock;
    }

    public void setStock(Stock stock) {
        this.stock = stock;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAveragePurchasePrice() {
        return averagePurchasePrice;
    }

    public void setAveragePurchasePrice(BigDecimal averagePurchasePrice) {
        this.averagePurchasePrice = averagePurchasePrice;
    }

    public BigDecimal getTotalInvested() {
        return totalInvested;
    }

    public void setTotalInvested(BigDecimal totalInvested) {
        this.totalInvested = totalInvested;
    }
}
