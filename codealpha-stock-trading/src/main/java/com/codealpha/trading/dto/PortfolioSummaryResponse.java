package com.codealpha.trading.dto;

import java.math.BigDecimal;
import java.util.List;

public class PortfolioSummaryResponse {

    private Long userId;
    private String username;
    private BigDecimal virtualCashBalance;
    private BigDecimal totalPortfolioValue;
    private BigDecimal totalInvested;
    private BigDecimal overallProfitLoss;
    private BigDecimal overallProfitLossPercentage;
    private int ownedStocksCount;
    private List<PortfolioItemDto> holdings;

    public static class PortfolioItemDto {
        private Long id;
        private String symbol;
        private String companyName;
        private int quantity;
        private BigDecimal averagePurchasePrice;
        private BigDecimal currentPrice;
        private BigDecimal totalInvested;
        private BigDecimal currentValue;
        private BigDecimal profitLoss;
        private BigDecimal profitLossPercentage;
        private String currency;

        public Long getId() { return id; }
        public void setId(Long id) { this.id = id; }
        public String getSymbol() { return symbol; }
        public void setSymbol(String symbol) { this.symbol = symbol; }
        public String getCompanyName() { return companyName; }
        public void setCompanyName(String companyName) { this.companyName = companyName; }
        public int getQuantity() { return quantity; }
        public void setQuantity(int quantity) { this.quantity = quantity; }
        public BigDecimal getAveragePurchasePrice() { return averagePurchasePrice; }
        public void setAveragePurchasePrice(BigDecimal averagePurchasePrice) { this.averagePurchasePrice = averagePurchasePrice; }
        public BigDecimal getCurrentPrice() { return currentPrice; }
        public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
        public BigDecimal getTotalInvested() { return totalInvested; }
        public void setTotalInvested(BigDecimal totalInvested) { this.totalInvested = totalInvested; }
        public BigDecimal getCurrentValue() { return currentValue; }
        public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }
        public BigDecimal getProfitLoss() { return profitLoss; }
        public void setProfitLoss(BigDecimal profitLoss) { this.profitLoss = profitLoss; }
        public BigDecimal getProfitLossPercentage() { return profitLossPercentage; }
        public void setProfitLossPercentage(BigDecimal profitLossPercentage) { this.profitLossPercentage = profitLossPercentage; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public BigDecimal getVirtualCashBalance() { return virtualCashBalance; }
    public void setVirtualCashBalance(BigDecimal virtualCashBalance) { this.virtualCashBalance = virtualCashBalance; }
    public BigDecimal getTotalPortfolioValue() { return totalPortfolioValue; }
    public void setTotalPortfolioValue(BigDecimal totalPortfolioValue) { this.totalPortfolioValue = totalPortfolioValue; }
    public BigDecimal getTotalInvested() { return totalInvested; }
    public void setTotalInvested(BigDecimal totalInvested) { this.totalInvested = totalInvested; }
    public BigDecimal getOverallProfitLoss() { return overallProfitLoss; }
    public void setOverallProfitLoss(BigDecimal overallProfitLoss) { this.overallProfitLoss = overallProfitLoss; }
    public BigDecimal getOverallProfitLossPercentage() { return overallProfitLossPercentage; }
    public void setOverallProfitLossPercentage(BigDecimal overallProfitLossPercentage) { this.overallProfitLossPercentage = overallProfitLossPercentage; }
    public int getOwnedStocksCount() { return ownedStocksCount; }
    public void setOwnedStocksCount(int ownedStocksCount) { this.ownedStocksCount = ownedStocksCount; }
    public List<PortfolioItemDto> getHoldings() { return holdings; }
    public void setHoldings(List<PortfolioItemDto> holdings) { this.holdings = holdings; }
}
