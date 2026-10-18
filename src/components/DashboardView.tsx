import React from 'react';
import { useTrading } from '../context/TradingContext';
import { ViewTab } from '../types/trading';
import { 
  Wallet, 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Clock, 
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';

interface DashboardViewProps {
  onNavigate: (tab: ViewTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate }) => {
  const { 
    user, 
    stocks, 
    holdings, 
    transactions, 
    totalPortfolioValue, 
    totalInvested, 
    overallProfitLoss, 
    overallProfitLossPercentage,
    openTradeModal 
  } = useTrading();

  // Top gainer and loser
  const sortedStocks = [...stocks].sort((a, b) => b.dailyChangePercentage - a.dailyChangePercentage);
  const topGainer = sortedStocks[0];
  const topLoser = sortedStocks[sortedStocks.length - 1];

  // Allocation metrics
  const cashPercentage = totalPortfolioValue > 0 ? (user.virtualCashBalance / totalPortfolioValue) * 100 : 100;
  const investedPercentage = 100 - cashPercentage;

  const isProfit = overallProfitLoss >= 0;

  return (
    <div className="space-y-6">

      {/* Simulated Data Disclosure Banner */}
      <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 flex items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-slate-300">
          <Info className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong className="text-white">Simulated Market Environment:</strong> All stock quotes, prices, and orders are generated for educational and internship demonstration purposes. No real money or actual stock exchanges are involved.
          </span>
        </div>
        <span className="bg-slate-700/80 text-cyan-300 px-2.5 py-1 rounded text-[11px] font-mono shrink-0">
          CodeAlpha Virtual Sandbox
        </span>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Virtual Cash Balance */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Virtual Cash</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{user.virtualCashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center space-x-1">
            <span>Available for new stock buys</span>
          </div>
        </div>

        {/* Total Net Worth / Portfolio Value */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Portfolio Value</span>
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            ₹{totalPortfolioValue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Cash + current stock market valuations
          </div>
        </div>

        {/* Total Profit / Loss */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Overall Profit / Loss</span>
            <div className={`p-2 rounded-xl ${isProfit ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {isProfit ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            </div>
          </div>
          <div className={`text-2xl font-bold tracking-tight ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfit ? '+' : ''}₹{overallProfitLoss.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className={`text-xs mt-2 flex items-center space-x-1 font-semibold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isProfit ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
            <span>{isProfit ? '+' : ''}{overallProfitLossPercentage.toFixed(2)}% return on invested</span>
          </div>
        </div>

        {/* Owned Stocks Count */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider">Owned Stocks</span>
            <div className="p-2 bg-purple-500/10 text-purple-400 rounded-xl">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {holdings.length} <span className="text-sm font-normal text-slate-400">Companies</span>
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Invested: ₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 0 })}</span>
            <button 
              onClick={() => onNavigate('portfolio')}
              className="text-purple-400 hover:text-purple-300 font-medium"
            >
              View Holdings &rarr;
            </button>
          </div>
        </div>

      </div>

      {/* Middle Row: Asset Allocation & Market Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Portfolio Asset Allocation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Asset Distribution</h3>
            <span className="text-xs text-slate-400">Total Net Worth</span>
          </div>

          <div className="space-y-4">
            {/* Visual Bar */}
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden flex">
              <div 
                style={{ width: `${Math.max(cashPercentage, 2)}%` }} 
                className="bg-emerald-500 transition-all duration-500"
                title={`Cash: ${cashPercentage.toFixed(1)}%`}
              />
              <div 
                style={{ width: `${Math.max(investedPercentage, 2)}%` }} 
                className="bg-cyan-500 transition-all duration-500"
                title={`Stocks: ${investedPercentage.toFixed(1)}%`}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Cash Liquidity</span>
                </div>
                <div className="text-base font-bold text-white">
                  {cashPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  ₹{user.virtualCashBalance.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                <div className="flex items-center space-x-2 text-xs text-slate-400 mb-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span>
                  <span>Stock Equities</span>
                </div>
                <div className="text-base font-bold text-white">
                  {investedPercentage.toFixed(1)}%
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  ₹{(totalPortfolioValue - user.virtualCashBalance).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center justify-between border-t border-slate-800">
              <span>Capital Invested:</span>
              <span className="font-semibold text-slate-200">₹{totalInvested.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Top Movers Today */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Market Highlights</h3>
            <button 
              onClick={() => onNavigate('market')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
            >
              <span>Explore All 10 Stocks</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Top Gainer */}
            {topGainer && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-emerald-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Top Gainer
                    </span>
                    <span className="text-xs text-slate-400">{topGainer.sector}</span>
                  </div>
                  <div className="text-lg font-bold text-white">{topGainer.symbol}</div>
                  <div className="text-xs text-slate-400 truncate">{topGainer.companyName}</div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-xl font-bold text-white font-mono">
                      {topGainer.currency === 'USD' ? '$' : '₹'}{topGainer.currentPrice.toFixed(2)}
                    </div>
                    <div className="text-xs font-semibold text-emerald-400 flex items-center space-x-1">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>+{topGainer.dailyPriceChange.toFixed(2)} (+{topGainer.dailyChangePercentage.toFixed(2)}%)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openTradeModal(topGainer, 'BUY')}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-lg transition"
                  >
                    Buy
                  </button>
                </div>
              </div>
            )}

            {/* Top Loser */}
            {topLoser && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-rose-500/20 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Top Dipper
                    </span>
                    <span className="text-xs text-slate-400">{topLoser.sector}</span>
                  </div>
                  <div className="text-lg font-bold text-white">{topLoser.symbol}</div>
                  <div className="text-xs text-slate-400 truncate">{topLoser.companyName}</div>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    <div className="text-xl font-bold text-white font-mono">
                      {topLoser.currency === 'USD' ? '$' : '₹'}{topLoser.currentPrice.toFixed(2)}
                    </div>
                    <div className="text-xs font-semibold text-rose-400 flex items-center space-x-1">
                      <ArrowDownRight className="w-3.5 h-3.5" />
                      <span>{topLoser.dailyPriceChange.toFixed(2)} ({topLoser.dailyChangePercentage.toFixed(2)}%)</span>
                    </div>
                  </div>
                  <button
                    onClick={() => openTradeModal(topLoser, 'BUY')}
                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-lg transition"
                  >
                    Buy Dip
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Bottom Section: Recent Activity & Quick Trade CTA */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Recent Transactions</h3>
          </div>
          <button 
            onClick={() => onNavigate('transactions')}
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
          >
            View All Ledger &rarr;
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-xs">
            <p>No transactions completed yet.</p>
            <button
              onClick={() => onNavigate('market')}
              className="mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition"
            >
              Browse Stock Market
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="pb-3 font-semibold">Transaction ID</th>
                  <th className="pb-3 font-semibold">Type</th>
                  <th className="pb-3 font-semibold">Stock</th>
                  <th className="pb-3 font-semibold text-right">Shares</th>
                  <th className="pb-3 font-semibold text-right">Price</th>
                  <th className="pb-3 font-semibold text-right">Total Amount</th>
                  <th className="pb-3 font-semibold text-right">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {transactions.slice(0, 5).map(tx => {
                  const isBuy = tx.transactionType === 'BUY';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 text-slate-400">{tx.id}</td>
                      <td className="py-3 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBuy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className="py-3 font-sans">
                        <div className="font-bold text-white">{tx.stockSymbol}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{tx.companyName}</div>
                      </td>
                      <td className="py-3 text-right text-slate-200">{tx.quantity}</td>
                      <td className="py-3 text-right text-slate-200">₹{tx.executionPrice.toFixed(2)}</td>
                      <td className="py-3 text-right font-bold text-white">
                        {isBuy ? '-' : '+'}₹{tx.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right text-slate-400 font-sans text-[11px]">
                        {new Date(tx.timestamp).toLocaleString()}
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
