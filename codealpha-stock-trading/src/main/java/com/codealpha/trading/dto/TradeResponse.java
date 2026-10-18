package com.codealpha.trading.dto;

import com.codealpha.trading.model.TransactionType;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class TradeResponse {

    private boolean success;
    private String message;
    private Long transactionId;
    private String symbol;
    private String companyName;
    private TransactionType transactionType;
    private int quantity;
    private BigDecimal executionPrice;
    private BigDecimal totalAmount;
    private BigDecimal remainingVirtualCash;
    private LocalDateTime timestamp;

    public TradeResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public static TradeResponse success(String message, Long transactionId, String symbol,
                                        String companyName, TransactionType type, int quantity,
                                        BigDecimal price, BigDecimal total, BigDecimal remainingCash) {
        TradeResponse resp = new TradeResponse();
        resp.setSuccess(true);
        resp.setMessage(message);
        resp.setTransactionId(transactionId);
        resp.setSymbol(symbol);
        resp.setCompanyName(companyName);
        resp.setTransactionType(type);
        resp.setQuantity(quantity);
        resp.setExecutionPrice(price);
        resp.setTotalAmount(total);
        resp.setRemainingVirtualCash(remainingCash);
        return resp;
    }

    public static TradeResponse failure(String message) {
        TradeResponse resp = new TradeResponse();
        resp.setSuccess(false);
        resp.setMessage(message);
        return resp;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getExecutionPrice() {
        return executionPrice;
    }

    public void setExecutionPrice(BigDecimal executionPrice) {
        this.executionPrice = executionPrice;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public BigDecimal getRemainingVirtualCash() {
        return remainingVirtualCash;
    }

    public void setRemainingVirtualCash(BigDecimal remainingVirtualCash) {
        this.remainingVirtualCash = remainingVirtualCash;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
