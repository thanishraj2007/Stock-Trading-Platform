package com.codealpha.trading.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TradeRequest {

    private Long userId = 1L; // Defaults to the primary demo user

    @NotBlank(message = "Stock symbol is required.")
    private String symbol;

    @NotNull(message = "Quantity is required.")
    @Min(value = 1, message = "Trade quantity must be at least 1 share.")
    private Integer quantity;

    public TradeRequest() {
    }

    public TradeRequest(Long userId, String symbol, Integer quantity) {
        this.userId = userId != null ? userId : 1L;
        this.symbol = symbol;
        this.quantity = quantity;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}
