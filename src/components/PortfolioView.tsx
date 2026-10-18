import React from 'react';
import { useTrading } from '../context/TradingContext';
import { ViewTab } from '../types/trading';
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  DollarSign, 
  PlusCircle, 
  MinusCircle, 
  Wallet,
  AlertCircle
} from 'lucide-react';

interface PortfolioViewProps {
  onNavigate: (tab: ViewTab) => void;
}

export const PortfolioView: React.FC<PortfolioViewProps> = ({ onNavigate }) => {
  const { 
    holdings, 
    stocks, 
    user, 
    totalPortfolioValue, 
    totalInvested, 
    overallProfitLoss, 
    overallProfitLossPercentage,
    openTradeModal 
  } = useTrading();

  const isProfit = overallProfitLoss >= 0;

  // Compute enriched portfolio holding metrics with live stock prices
  const enrichedHoldings = holdings.map(item => {
    const stock = stocks.find(s => s.symbol.toUpperCase() === item.symbol.toUpperCase());
    const currentPrice = stock ? stock.currentPrice : item.averagePurchasePrice;
    const currentValue = Math.round(currentPrice * item.quantity * 100) / 100;
    const profitLoss = Math.round((currentValue - item.totalInvested) * 100) / 100;
    const profitLossPercentage = item.totalInvested > 0 ? (profitLoss / item.totalInvested) * 100 : 0;

    return {
      ...item,
      stock,
      currentPrice,
      currentValue,
      profitLoss,
      profitLossPercentage
    };
  });

  return (
    <div className="space-y-6">

      {/* Header Metric Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Net Worth */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Net Portfolio Worth
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{totalPortfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Cash: ₹{user.virtualCashBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Total Capital Invested */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Total Capital Invested
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            Cost basis across {holdings.length} companies
          </div>
        </div>

        {/* Current Holdings Market Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Stock Holdings Value
          </div>
          <div className="text-2xl font-bold text-cyan-400 tracking-tight">
            ₹{(totalPortfolioValue - user.virtualCashBalance).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            At current simulated quotes
          </div>
        </div>

        {/* Unrealized Profit / Loss */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Unrealized Profit / Loss
          </div>
          <div className={`text-2xl font-bold tracking-tight ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfit ? '+' : ''}₹{overallProfitLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-xs mt-1 font-semibold flex items-center space-x-1 ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{isProfit ? '+' : ''}{overallProfitLossPercentage.toFixed(2)}% overall ROI</span>
          </div>
        </div>

      </div>

      {/* Portfolio Holdings Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Current Holdings</h3>
            <span className="bg-slate-800 text-slate-300 text-xs px-2 py-0.5 rounded font-mono">
              {holdings.length} Positions
            </span>
          </div>

          <button
            onClick={() => onNavigate('market')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
          >
            <span>+ Buy More Stocks</span>
          </button>
        </div>

        {enrichedHoldings.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <h4 className="text-base font-bold text-white mb-1">Your Portfolio is Currently Empty</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
              You have ₹{user.virtualCashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })} in virtual cash. Buy shares from the Stock Market to start building your simulated portfolio.
            </p>
            <button
              onClick={() => onNavigate('market')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20"
            >
              Go to Stock Market
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Stock / Company</th>
                  <th className="py-3 px-4 font-semibold text-right">Shares Owned</th>
                  <th className="py-3 px-4 font-semibold text-right">Avg Purchase Price</th>
                  <th className="py-3 px-4 font-semibold text-right">Current Market Price</th>
                  <th className="py-3 px-4 font-semibold text-right">Total Invested</th>
                  <th className="py-3 px-4 font-semibold text-right">Current Value</th>
                  <th className="py-3 px-4 font-semibold text-right">Profit / Loss</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {enrichedHoldings.map(item => {
                  const itemIsProfit = item.profitLoss >= 0;
                  const curr = item.currency === 'USD' ? '$' : '₹';

                  return (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition">
                      
                      {/* Symbol & Company */}
                      <td className="py-3.5 px-4 font-sans">
                        <div className="font-bold text-white text-sm">{item.symbol}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{item.companyName}</div>
                      </td>

                      {/* Shares */}
                      <td className="py-3.5 px-4 text-right text-slate-200 font-bold">
                        {item.quantity}
                      </td>

                      {/* Avg Purchase Price */}
                      <td className="py-3.5 px-4 text-right text-slate-300">
                        {curr}{item.averagePurchasePrice.toFixed(2)}
                      </td>

                      {/* Current Simulated Price */}
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        {curr}{item.currentPrice.toFixed(2)}
                      </td>

                      {/* Total Invested */}
                      <td className="py-3.5 px-4 text-right text-slate-400">
                        {curr}{item.totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Current Market Value */}
                      <td className="py-3.5 px-4 text-right font-bold text-cyan-300">
                        {curr}{item.currentValue.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Profit / Loss */}
                      <td className="py-3.5 px-4 text-right">
                        <div className={`font-bold inline-flex items-center space-x-1 ${itemIsProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {itemIsProfit ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                          <span>{itemIsProfit ? '+' : ''}{curr}{item.profitLoss.toFixed(2)}</span>
                        </div>
                        <div className={`text-[10px] ${itemIsProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
                          ({itemIsProfit ? '+' : ''}{item.profitLossPercentage.toFixed(2)}%)
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right font-sans">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              if (item.stock) openTradeModal(item.stock, 'BUY');
                            }}
                            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg text-xs transition"
                            title="Buy more shares of this stock"
                          >
                            + Buy
                          </button>
                          <button
                            onClick={() => {
                              if (item.stock) openTradeModal(item.stock, 'SELL');
                            }}
                            className="px-2.5 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold rounded-lg text-xs transition"
                            title="Sell shares of this holding"
                          >
                            - Sell
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
