package com.codealpha.trading.model;

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

    public AbstractFinancialAsset() {
    }

    public AbstractFinancialAsset(String symbol, String companyName, String currency) {
        this.symbol = symbol;
        this.companyName = companyName;
        this.currency = currency;
    }

    // Abstract method enforcing polymorphism across financial asset types
    public abstract BigDecimal calculateValuation(int units);

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

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
