import React, { useState, useEffect } from 'react';
import { useTrading } from '../context/TradingContext';
import { Stock } from '../types/trading';
import { 
  X, 
  ShoppingCart, 
  DollarSign, 
  AlertCircle, 
  Check, 
  ArrowRight, 
  Zap, 
  Wallet,
  Building
} from 'lucide-react';

interface TradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStock?: Stock | null;
  defaultType?: 'BUY' | 'SELL';
}

export const TradeModal: React.FC<TradeModalProps> = ({ 
  isOpen, 
  onClose, 
  defaultStock, 
  defaultType = 'BUY' 
}) => {
  const { stocks, holdings, user, buyStock, sellStock } = useTrading();

  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>(defaultType);
  const [selectedSymbol, setSelectedSymbol] = useState<string>(defaultStock ? defaultStock.symbol : stocks[0]?.symbol || 'TCS');
  const [quantity, setQuantity] = useState<number>(1);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state when defaultStock or defaultType changes
  useEffect(() => {
    if (defaultStock) {
      setSelectedSymbol(defaultStock.symbol);
    }
    if (defaultType) {
      setTradeType(defaultType);
    }
    setQuantity(1);
    setErrorMsg(null);
  }, [defaultStock, defaultType, isOpen]);

  if (!isOpen) return null;

  const currentStock = stocks.find(s => s.symbol.toUpperCase() === selectedSymbol.toUpperCase()) || stocks[0];
  const currentHolding = holdings.find(h => h.symbol.toUpperCase() === selectedSymbol.toUpperCase());
  const ownedQuantity = currentHolding ? currentHolding.quantity : 0;

  const unitPrice = currentStock ? currentStock.currentPrice : 0;
  const totalTradeAmount = Math.round(unitPrice * quantity * 100) / 100;

  const currencySymbol = currentStock?.currency === 'USD' ? '$' : '₹';

  // Maximum shares allowed
  const maxBuyable = unitPrice > 0 ? Math.floor(user.virtualCashBalance / unitPrice) : 0;
  const maxSellable = ownedQuantity;

  // Validation logic
  const handleQuantityChange = (val: number) => {
    if (val < 1) {
      setQuantity(1);
      return;
    }
    setQuantity(val);
    setErrorMsg(null);
  };

  const handleExecuteTrade = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (quantity <= 0 || !Number.isInteger(quantity)) {
      setErrorMsg('Please enter a valid positive whole number of shares.');
      return;
    }

    if (tradeType === 'BUY') {
      if (user.virtualCashBalance < totalTradeAmount) {
        setErrorMsg(`Insufficient cash balance! Required: ₹${totalTradeAmount.toFixed(2)}, Available: ₹${user.virtualCashBalance.toFixed(2)}`);
        return;
      }
      const res = buyStock(currentStock.symbol, quantity);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    } else {
      if (ownedQuantity < quantity) {
        setErrorMsg(`Cannot sell ${quantity} shares. You currently own only ${ownedQuantity} share(s).`);
        return;
      }
      const res = sellStock(currentStock.symbol, quantity);
      if (res.success) {
        onClose();
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const remainingCashPreview = tradeType === 'BUY'
    ? user.virtualCashBalance - totalTradeAmount
    : user.virtualCashBalance + totalTradeAmount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl shadow-emerald-500/10"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className={`p-2 rounded-xl ${tradeType === 'BUY' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Execute Stock Order</h3>
              <p className="text-xs text-slate-400">Simulated Instant Execution • Zero Slippage</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Type Tabs: BUY vs SELL */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-1 rounded-2xl border border-slate-700/60">
            <button
              type="button"
              onClick={() => { setTradeType('BUY'); setErrorMsg(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
                tradeType === 'BUY'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>BUY SHARES</span>
            </button>
            <button
              type="button"
              onClick={() => { setTradeType('SELL'); setErrorMsg(null); }}
              className={`py-2 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-1.5 ${
                tradeType === 'SELL'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>SELL SHARES</span>
            </button>
          </div>
        </div>

        <form onSubmit={handleExecuteTrade} className="p-5 space-y-4">
          
          {/* Stock Selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Stock
            </label>
            <select
              value={selectedSymbol}
              onChange={e => {
                setSelectedSymbol(e.target.value);
                setErrorMsg(null);
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-emerald-500"
            >
              {stocks.map(s => (
                <option key={s.symbol} value={s.symbol}>
                  {s.symbol} — {s.companyName} ({s.currency === 'USD' ? '$' : '₹'}{s.currentPrice.toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Current Stock Quote Card */}
          {currentStock && (
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-400">{currentStock.companyName}</div>
                <div className="text-lg font-bold text-white font-mono mt-0.5">
                  {currencySymbol}{currentStock.currentPrice.toFixed(2)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Position Held</div>
                <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
                  {ownedQuantity} Share(s)
                </div>
              </div>
            </div>
          )}

          {/* Quantity Input with Quick Buttons */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Number of Shares
              </label>
              <span className="text-xs text-slate-400">
                {tradeType === 'BUY' ? `Max Buyable: ${maxBuyable}` : `Max Sellable: ${maxSellable}`}
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="number"
                min="1"
                step="1"
                value={quantity || ''}
                onChange={e => handleQuantityChange(parseInt(e.target.value) || 0)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                placeholder="Quantity"
              />
              
              <button
                type="button"
                onClick={() => handleQuantityChange(tradeType === 'BUY' ? Math.max(1, maxBuyable) : Math.max(1, maxSellable))}
                className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-xl text-xs font-bold shrink-0 transition"
              >
                MAX
              </button>
            </div>

            {/* Quick Increment Chips */}
            <div className="flex items-center space-x-2 mt-2">
              {[1, 5, 10, 25].map(q => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleQuantityChange(q)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium border border-slate-700/60 transition"
                >
                  +{q}
                </button>
              ))}
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Order Summary & Cost Breakdown */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span>Unit Price</span>
              <span className="font-mono text-slate-200">{currencySymbol}{unitPrice.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Order Quantity</span>
              <span className="font-mono text-slate-200">{quantity} share(s)</span>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>Brokerage / Platform Fees</span>
              <span className="font-mono text-emerald-400 font-bold">₹0.00 (Free)</span>
            </div>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-sm">
              <span className="text-white">
                {tradeType === 'BUY' ? 'Total Purchase Cost' : 'Total Sale Proceeds'}
              </span>
              <span className={`font-mono text-base ${tradeType === 'BUY' ? 'text-emerald-400' : 'text-cyan-400'}`}>
                {currencySymbol}{totalTradeAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="pt-1 flex items-center justify-between text-[11px] text-slate-400">
              <span>Projected Balance After Order</span>
              <span className={`font-mono ${remainingCashPreview < 0 ? 'text-rose-400 font-bold' : 'text-slate-300'}`}>
                ₹{remainingCashPreview.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={quantity <= 0 || (tradeType === 'BUY' && user.virtualCashBalance < totalTradeAmount) || (tradeType === 'SELL' && ownedQuantity < quantity)}
            className={`w-full py-3.5 rounded-xl text-sm font-bold transition shadow-lg flex items-center justify-center space-x-2 disabled:opacity-40 disabled:cursor-not-allowed ${
              tradeType === 'BUY'
                ? 'bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-emerald-500/20'
                : 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
            }`}
          >
            <span>{tradeType === 'BUY' ? `Confirm Buy for ${currencySymbol}${totalTradeAmount.toFixed(2)}` : `Confirm Sell for ${currencySymbol}${totalTradeAmount.toFixed(2)}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

        </form>

      </div>
    </div>
  );
};
