import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { Stock } from '../types/trading';
import { 
  Search, 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShoppingCart, 
  DollarSign, 
  Filter,
  Sparkles,
  Layers
} from 'lucide-react';

export const StockMarketView: React.FC = () => {
  const { stocks, holdings, openTradeModal } = useTrading();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'symbol' | 'name' | 'price-asc' | 'price-desc' | 'change-desc'>('symbol');

  // Sectors list
  const sectors = useMemo(() => {
    const list = Array.from(new Set(stocks.map(s => s.sector)));
    return ['ALL', ...list];
  }, [stocks]);

  // Filtered and sorted stocks
  const filteredStocks = useMemo(() => {
    return stocks
      .filter(s => {
        const matchesQuery = 
          s.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.companyName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSector = selectedSector === 'ALL' || s.sector === selectedSector;
        return matchesQuery && matchesSector;
      })
      .sort((a, b) => {
        if (sortBy === 'symbol') return a.symbol.localeCompare(b.symbol);
        if (sortBy === 'name') return a.companyName.localeCompare(b.companyName);
        if (sortBy === 'price-asc') return a.currentPrice - b.currentPrice;
        if (sortBy === 'price-desc') return b.currentPrice - a.currentPrice;
        if (sortBy === 'change-desc') return b.dailyChangePercentage - a.dailyChangePercentage;
        return 0;
      });
  }, [stocks, searchQuery, selectedSector, sortBy]);

  // Mini SVG Sparkline generator
  const renderSparkline = (points: number[], isPositive: boolean) => {
    if (!points || points.length < 2) return null;
    const min = Math.min(...points);
    const max = Math.max(...points);
    const range = max - min || 1;
    const height = 28;
    const width = 80;

    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - ((p - min) / range) * (height - 6) - 3;
      return `${x},${y}`;
    }).join(' ');

    const strokeColor = isPositive ? '#10b981' : '#f43f5e';

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={strokeColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={coords}
        />
      </svg>
    );
  };

  return (
    <div className="space-y-6">

      {/* Mandatory Simulated Market Disclaimer */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between text-xs text-amber-300">
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider text-amber-200">Simulated Market Data Only:</span>
            <p className="text-amber-300/80 mt-0.5">
              Quotes displayed are synthetic ticks for the CodeAlpha Internship project. Prices do not reflect live stock exchange values.
            </p>
          </div>
        </div>
        <span className="bg-amber-500/20 px-3 py-1 rounded-full text-[11px] font-mono font-semibold">
          10/10 Required Stocks Active
        </span>
      </div>

      {/* Search, Filter, and Sorting Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by company or symbol (e.g. TCS, Apple)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
          />
        </div>

        {/* Sector and Sort dropdowns */}
        <div className="flex items-center space-x-3 w-full md:w-auto">
          
          {/* Sector Filter */}
          <div className="flex items-center space-x-2 w-1/2 md:w-auto">
            <Filter className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-full"
            >
              {sectors.map(sec => (
                <option key={sec} value={sec}>
                  {sec === 'ALL' ? 'All Sectors' : sec}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center space-x-2 w-1/2 md:w-auto">
            <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-800 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 w-full"
            >
              <option value="symbol">Sort: Symbol (A-Z)</option>
              <option value="name">Sort: Company Name</option>
              <option value="price-desc">Sort: Price (High to Low)</option>
              <option value="price-asc">Sort: Price (Low to High)</option>
              <option value="change-desc">Sort: Top Gainers %</option>
            </select>
          </div>

        </div>

      </div>

      {/* Stocks Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-700/80 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 font-semibold">Stock & Company</th>
                <th className="py-3.5 px-4 font-semibold">Sector</th>
                <th className="py-3.5 px-4 font-semibold text-right">Simulated Price</th>
                <th className="py-3.5 px-4 font-semibold text-right">24h Change</th>
                <th className="py-3.5 px-4 font-semibold text-center hidden md:table-cell">Trend (24h)</th>
                <th className="py-3.5 px-4 font-semibold text-right hidden lg:table-cell">24h Range</th>
                <th className="py-3.5 px-4 font-semibold text-right">Owned</th>
                <th className="py-3.5 px-4 font-semibold text-right">Trade Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredStocks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    No stocks match "{searchQuery}".
                  </td>
                </tr>
              ) : (
                filteredStocks.map(stock => {
                  const isPositive = stock.dailyPriceChange >= 0;
                  const holding = holdings.find(h => h.symbol.toUpperCase() === stock.symbol.toUpperCase());
                  const ownedQty = holding ? holding.quantity : 0;
                  const currencySymbol = stock.currency === 'USD' ? '$' : '₹';

                  return (
                    <tr key={stock.id} className="hover:bg-slate-800/40 transition">
                      
                      {/* Symbol & Company */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-white text-xs">
                            {stock.symbol.slice(0, 2)}
                          </div>
                          <div>
                            <div className="font-bold text-white text-sm flex items-center space-x-1.5">
                              <span>{stock.symbol}</span>
                              <span className="text-[10px] text-slate-400 font-normal border border-slate-700 px-1.5 rounded">
                                {stock.currency}
                              </span>
                            </div>
                            <div className="text-slate-400 text-[11px] truncate max-w-[180px]">
                              {stock.companyName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Sector */}
                      <td className="py-3.5 px-4 text-slate-400">
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-[11px]">
                          {stock.sector}
                        </span>
                      </td>

                      {/* Current Simulated Price */}
                      <td className="py-3.5 px-4 text-right font-mono text-sm font-bold text-white">
                        {currencySymbol}{stock.currentPrice.toFixed(2)}
                      </td>

                      {/* Daily Change */}
                      <td className="py-3.5 px-4 text-right">
                        <div className={`font-semibold inline-flex items-center space-x-0.5 text-xs ${
                          isPositive ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {isPositive ? <TrendingUp className="w-3.5 h-3.5 inline" /> : <TrendingDown className="w-3.5 h-3.5 inline" />}
                          <span>{isPositive ? '+' : ''}{stock.dailyPriceChange.toFixed(2)}</span>
                          <span>({isPositive ? '+' : ''}{stock.dailyChangePercentage.toFixed(2)}%)</span>
                        </div>
                      </td>

                      {/* Mini Trend Sparkline */}
                      <td className="py-3.5 px-4 text-center hidden md:table-cell">
                        <div className="flex justify-center">
                          {renderSparkline(stock.sparkline, isPositive)}
                        </div>
                      </td>

                      {/* 24h Range */}
                      <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-400 hidden lg:table-cell">
                        <div>H: {currencySymbol}{stock.dayHigh.toFixed(2)}</div>
                        <div>L: {currencySymbol}{stock.dayLow.toFixed(2)}</div>
                      </td>

                      {/* Owned Shares */}
                      <td className="py-3.5 px-4 text-right font-mono font-medium">
                        {ownedQty > 0 ? (
                          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                            {ownedQty}
                          </span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openTradeModal(stock, 'BUY')}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-lg transition text-xs shadow-sm shadow-emerald-500/20 active:scale-95"
                          >
                            Buy
                          </button>
                          {ownedQty > 0 ? (
                            <button
                              onClick={() => openTradeModal(stock, 'SELL')}
                              className="px-3 py-1.5 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-bold rounded-lg transition text-xs active:scale-95"
                            >
                              Sell
                            </button>
                          ) : (
                            <button
                              disabled
                              title="You do not own this stock"
                              className="px-3 py-1.5 bg-slate-800 text-slate-600 rounded-lg text-xs cursor-not-allowed border border-slate-700/40"
                            >
                              Sell
                            </button>
                          )}
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
