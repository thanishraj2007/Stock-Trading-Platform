import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Stock, PortfolioItem, Transaction, UserProfile } from '../types/trading';
import { INITIAL_STOCKS } from '../data/initialStocks';
import confetti from 'canvas-confetti';

interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface TradingContextType {
  stocks: Stock[];
  holdings: PortfolioItem[];
  transactions: Transaction[];
  user: UserProfile;
  autoTickEnabled: boolean;
  toggleAutoTick: () => void;
  triggerManualTick: () => void;
  buyStock: (symbol: string, quantity: number) => { success: boolean; message: string };
  sellStock: (symbol: string, quantity: number) => { success: boolean; message: string };
  resetAccount: () => void;
  toasts: ToastNotification[];
  removeToast: (id: string) => void;
  totalPortfolioValue: number;
  totalInvested: number;
  overallProfitLoss: number;
  overallProfitLossPercentage: number;
  activeTradeStock: Stock | null;
  activeTradeType: 'BUY' | 'SELL';
  openTradeModal: (stock: Stock, type?: 'BUY' | 'SELL') => void;
  closeTradeModal: () => void;
}

const TradingContext = createContext<TradingContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_CASH = 'codealpha_stock_cash_v1';
const LOCAL_STORAGE_KEY_HOLDINGS = 'codealpha_stock_holdings_v1';
const LOCAL_STORAGE_KEY_TRANSACTIONS = 'codealpha_stock_transactions_v1';

export const TradingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>(INITIAL_STOCKS);
  const [autoTickEnabled, setAutoTickEnabled] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [activeTradeStock, setActiveTradeStock] = useState<Stock | null>(null);
  const [activeTradeType, setActiveTradeType] = useState<'BUY' | 'SELL'>('BUY');

  // User state
  const [user, setUser] = useState<UserProfile>(() => {
    const savedCash = localStorage.getItem(LOCAL_STORAGE_KEY_CASH);
    return {
      id: 1,
      username: 'codealpha_trader',
      fullName: 'CodeAlpha Intern Trader',
      email: 'trader@codealpha.edu',
      virtualCashBalance: savedCash ? parseFloat(savedCash) : 100000.00
    };
  });

  // Holdings state (pre-populate with 2 realistic holdings if initial)
  const [holdings, setHoldings] = useState<PortfolioItem[]>(() => {
    const savedHoldings = localStorage.getItem(LOCAL_STORAGE_KEY_HOLDINGS);
    if (savedHoldings) {
      try {
        return JSON.parse(savedHoldings);
      } catch {
        // Fallback to default
      }
    }
    // Default starter portfolio for instant demonstration
    return [
      {
        id: 'hold-1',
        symbol: 'TCS',
        companyName: 'Tata Consultancy Services',
        quantity: 5,
        averagePurchasePrice: 3880.00,
        totalInvested: 19400.00,
        currency: 'INR'
      },
      {
        id: 'hold-2',
        symbol: 'AAPL',
        companyName: 'Apple Inc.',
        quantity: 10,
        averagePurchasePrice: 179.20,
        totalInvested: 1792.00,
        currency: 'USD'
      }
    ];
  });

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTxs = localStorage.getItem(LOCAL_STORAGE_KEY_TRANSACTIONS);
    if (savedTxs) {
      try {
        return JSON.parse(savedTxs);
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: 'TX-1001',
        stockSymbol: 'TCS',
        companyName: 'Tata Consultancy Services',
        transactionType: 'BUY',
        quantity: 5,
        executionPrice: 3880.00,
        totalAmount: 19400.00,
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        status: 'COMPLETED'
      },
      {
        id: 'TX-1002',
        stockSymbol: 'AAPL',
        companyName: 'Apple Inc.',
        transactionType: 'BUY',
        quantity: 10,
        executionPrice: 179.20,
        totalAmount: 1792.00,
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'COMPLETED'
      }
    ];
  });

  // Persist state changes to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_CASH, user.virtualCashBalance.toString());
  }, [user.virtualCashBalance]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_HOLDINGS, JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  // Toast helper
  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Simulate market price tick across stocks
  const triggerManualTick = useCallback(() => {
    setStocks(prevStocks =>
      prevStocks.map(stock => {
        // -1.8% to +2.0% fluctuation
        const percent = (Math.random() * 3.8 - 1.8) / 100;
        const delta = Math.round(stock.currentPrice * percent * 100) / 100;
        let newPrice = Math.round((stock.currentPrice + delta) * 100) / 100;
        if (newPrice < 1) newPrice = 1.0;

        const updatedDailyChange = Math.round((stock.dailyPriceChange + delta) * 100) / 100;
        const basePrice = stock.currentPrice - stock.dailyPriceChange;
        const changePct = basePrice > 0 ? Math.round((updatedDailyChange / basePrice) * 10000) / 100 : 0;

        const newSparkline = [...stock.sparkline.slice(1), newPrice];

        return {
          ...stock,
          currentPrice: newPrice,
          dailyPriceChange: updatedDailyChange,
          dailyChangePercentage: changePct,
          dayHigh: Math.max(stock.dayHigh, newPrice),
          dayLow: Math.min(stock.dayLow, newPrice),
          sparkline: newSparkline,
          updatedAt: new Date().toLocaleTimeString()
        };
      })
    );
  }, []);

  // Periodic automatic market tick
  useEffect(() => {
    if (!autoTickEnabled) return;
    const interval = setInterval(() => {
      triggerManualTick();
    }, 4000);
    return () => clearInterval(interval);
  }, [autoTickEnabled, triggerManualTick]);

  const toggleAutoTick = () => {
    setAutoTickEnabled(prev => !prev);
    addToast('info', 'Market Simulation', !autoTickEnabled ? 'Live auto-ticks enabled' : 'Auto-ticks paused');
  };

  // Calculate current holding values and overall profit/loss
  const { totalInvested, totalCurrentValue, overallProfitLoss, overallProfitLossPercentage } = React.useMemo(() => {
    let investedSum = 0;
    let currentValSum = 0;

    holdings.forEach(item => {
      const stock = stocks.find(s => s.symbol.toUpperCase() === item.symbol.toUpperCase());
      const currentPrice = stock ? stock.currentPrice : item.averagePurchasePrice;
      investedSum += item.totalInvested;
      currentValSum += currentPrice * item.quantity;
    });

    const pnl = currentValSum - investedSum;
    const pnlPct = investedSum > 0 ? (pnl / investedSum) * 100 : 0;

    return {
      totalInvested: investedSum,
      totalCurrentValue: currentValSum,
      overallProfitLoss: pnl,
      overallProfitLossPercentage: pnlPct
    };
  }, [holdings, stocks]);

  // Combined Portfolio Net Worth = cash + current value of all holdings
  const totalPortfolioValue = user.virtualCashBalance + totalCurrentValue;

  // Buy Stock execution
  const buyStock = (symbol: string, quantity: number) => {
    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
      addToast('error', 'Invalid Quantity', 'Please enter a valid positive whole number.');
      return { success: false, message: 'Invalid quantity' };
    }

    const stock = stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (!stock) {
      addToast('error', 'Stock Not Found', `Symbol ${symbol} was not found.`);
      return { success: false, message: 'Stock not found' };
    }

    const totalCost = Math.round(stock.currentPrice * quantity * 100) / 100;

    if (user.virtualCashBalance < totalCost) {
      const currencySymbol = stock.currency === 'USD' ? '$' : '₹';
      addToast(
        'error',
        'Insufficient Balance',
        `Required: ${currencySymbol}${totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}. Available Cash: ${currencySymbol}${user.virtualCashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.`
      );
      return { success: false, message: 'Insufficient balance' };
    }

    // Deduct cash
    const newBalance = Math.round((user.virtualCashBalance - totalCost) * 100) / 100;
    setUser(prev => ({ ...prev, virtualCashBalance: newBalance }));

    // Update holdings
    setHoldings(prev => {
      const existing = prev.find(h => h.symbol.toUpperCase() === stock.symbol.toUpperCase());
      if (existing) {
        const newQty = existing.quantity + quantity;
        const newTotalInvested = existing.totalInvested + totalCost;
        const newAvg = Math.round((newTotalInvested / newQty) * 100) / 100;
        return prev.map(h =>
          h.symbol.toUpperCase() === stock.symbol.toUpperCase()
            ? { ...h, quantity: newQty, averagePurchasePrice: newAvg, totalInvested: newTotalInvested }
            : h
        );
      } else {
        return [
          ...prev,
          {
            id: 'hold-' + Date.now(),
            symbol: stock.symbol,
            companyName: stock.companyName,
            quantity,
            averagePurchasePrice: stock.currentPrice,
            totalInvested: totalCost,
            currency: stock.currency
          }
        ];
      }
    });

    // Record transaction
    const newTx: Transaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      stockSymbol: stock.symbol,
      companyName: stock.companyName,
      transactionType: 'BUY',
      quantity,
      executionPrice: stock.currentPrice,
      totalAmount: totalCost,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED'
    };
    setTransactions(prev => [newTx, ...prev]);

    // Confetti celebration
    try {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {
      // Ignore if confetti is disabled
    }

    const curr = stock.currency === 'USD' ? '$' : '₹';
    addToast(
      'success',
      'Order Executed',
      `Bought ${quantity} share(s) of ${stock.symbol} for ${curr}${totalCost.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.`
    );

    return { success: true, message: 'Order executed successfully' };
  };

  // Sell Stock execution
  const sellStock = (symbol: string, quantity: number) => {
    if (!quantity || quantity <= 0 || !Number.isInteger(quantity)) {
      addToast('error', 'Invalid Quantity', 'Please enter a valid positive whole number.');
      return { success: false, message: 'Invalid quantity' };
    }

    const stock = stocks.find(s => s.symbol.toUpperCase() === symbol.toUpperCase());
    if (!stock) {
      addToast('error', 'Stock Not Found', `Symbol ${symbol} was not found.`);
      return { success: false, message: 'Stock not found' };
    }

    const existingHolding = holdings.find(h => h.symbol.toUpperCase() === stock.symbol.toUpperCase());
    if (!existingHolding || existingHolding.quantity < quantity) {
      const owned = existingHolding ? existingHolding.quantity : 0;
      addToast(
        'error',
        'Insufficient Shares',
        `Cannot sell ${quantity} shares of ${stock.symbol}. You currently own ${owned} share(s).`
      );
      return { success: false, message: 'Insufficient shares owned' };
    }

    const proceeds = Math.round(stock.currentPrice * quantity * 100) / 100;

    // Credit cash proceeds
    const newBalance = Math.round((user.virtualCashBalance + proceeds) * 100) / 100;
    setUser(prev => ({ ...prev, virtualCashBalance: newBalance }));

    // Deduct from holdings
    setHoldings(prev => {
      return prev
        .map(h => {
          if (h.symbol.toUpperCase() === stock.symbol.toUpperCase()) {
            const remQty = h.quantity - quantity;
            if (remQty <= 0) return null;
            const remInvested = Math.round(h.averagePurchasePrice * remQty * 100) / 100;
            return {
              ...h,
              quantity: remQty,
              totalInvested: remInvested
            };
          }
          return h;
        })
        .filter((h): h is PortfolioItem => h !== null);
    });

    // Record transaction
    const newTx: Transaction = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      stockSymbol: stock.symbol,
      companyName: stock.companyName,
      transactionType: 'SELL',
      quantity,
      executionPrice: stock.currentPrice,
      totalAmount: proceeds,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED'
    };
    setTransactions(prev => [newTx, ...prev]);

    const curr = stock.currency === 'USD' ? '$' : '₹';
    addToast(
      'success',
      'Sale Executed',
      `Sold ${quantity} share(s) of ${stock.symbol} for ${curr}${proceeds.toLocaleString('en-IN', { minimumFractionDigits: 2 })}.`
    );

    return { success: true, message: 'Sale executed successfully' };
  };

  // Reset demo account
  const resetAccount = () => {
    setUser({
      id: 1,
      username: 'codealpha_trader',
      fullName: 'CodeAlpha Intern Trader',
      email: 'trader@codealpha.edu',
      virtualCashBalance: 100000.00
    });
    setHoldings([]);
    setTransactions([]);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CASH);
    localStorage.removeItem(LOCAL_STORAGE_KEY_HOLDINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_TRANSACTIONS);
    addToast('info', 'Account Reset', 'Balance restored to ₹100,000.00 and portfolio cleared.');
  };

  const openTradeModal = (stock: Stock, type: 'BUY' | 'SELL' = 'BUY') => {
    setActiveTradeStock(stock);
    setActiveTradeType(type);
  };

  const closeTradeModal = () => {
    setActiveTradeStock(null);
  };

  return (
    <TradingContext.Provider
      value={{
        stocks,
        holdings,
        transactions,
        user,
        autoTickEnabled,
        toggleAutoTick,
        triggerManualTick,
        buyStock,
        sellStock,
        resetAccount,
        toasts,
        removeToast,
        totalPortfolioValue,
        totalInvested,
        overallProfitLoss,
        overallProfitLossPercentage,
        activeTradeStock,
        activeTradeType,
        openTradeModal,
        closeTradeModal
      }}
    >
      {children}
    </TradingContext.Provider>
  );
};

export const useTrading = () => {
  const context = useContext(TradingContext);
  if (!context) {
    throw new Error('useTrading must be used within a TradingProvider');
  }
  return context;
};
