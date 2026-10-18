export interface Stock {
  id: number;
  symbol: string;
  companyName: string;
  currentPrice: number;
  dailyPriceChange: number;
  dailyChangePercentage: number;
  currency: 'INR' | 'USD';
  sector: string;
  dayHigh: number;
  dayLow: number;
  volume: string;
  sparkline: number[];
  updatedAt?: string;
}

export interface PortfolioItem {
  id: string;
  symbol: string;
  companyName: string;
  quantity: number;
  averagePurchasePrice: number;
  totalInvested: number;
  currency: 'INR' | 'USD';
}

export interface Transaction {
  id: string;
  stockSymbol: string;
  companyName: string;
  transactionType: 'BUY' | 'SELL';
  quantity: number;
  executionPrice: number;
  totalAmount: number;
  timestamp: string;
  status: 'COMPLETED' | 'FAILED';
}

export interface UserProfile {
  id: number;
  username: string;
  fullName: string;
  email: string;
  virtualCashBalance: number;
}

export type ViewTab = 'dashboard' | 'market' | 'portfolio' | 'transactions' | 'java-code' | 'api-docs';
