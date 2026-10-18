import React from 'react';
import { useTrading } from '../context/TradingContext';
import { 
  TrendingUp, 
  Wallet, 
  RotateCcw, 
  Activity, 
  Zap, 
  Pause, 
  Play, 
  GraduationCap
} from 'lucide-react';

interface NavbarProps {
  onOpenTrade: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenTrade }) => {
  const { user, autoTickEnabled, toggleAutoTick, triggerManualTick, resetAccount, stocks } = useTrading();

  const handleReset = () => {
    if (window.confirm('Reset virtual portfolio and cash balance back to ₹100,000.00?')) {
      resetAccount();
    }
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand & Internship Badge */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-white font-bold tracking-tight text-lg">TradeAlpha</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full flex items-center space-x-1">
                <GraduationCap className="w-3 h-3 mr-0.5 inline" />
                CodeAlpha Task 2
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Java Programming Internship • Stock Trading Platform</p>
          </div>
        </div>

        {/* Live Simulation Controls & User Cash */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          
          {/* Simulated Market Indicator & Controls */}
          <div className="hidden md:flex items-center space-x-2 bg-slate-800/80 border border-slate-700/60 rounded-lg px-3 py-1.5">
            <span className="flex h-2 w-2 relative">
              {autoTickEnabled && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${autoTickEnabled ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {autoTickEnabled ? 'Simulated Live Ticks' : 'Ticks Paused'}
            </span>
            
            <button
              onClick={toggleAutoTick}
              title={autoTickEnabled ? 'Pause automated price ticks' : 'Resume automated price ticks'}
              className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition"
            >
              {autoTickEnabled ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={triggerManualTick}
              title="Trigger simulated price tick immediately"
              className="p-1 text-slate-400 hover:text-emerald-400 hover:bg-slate-700 rounded transition flex items-center text-xs"
            >
              <Activity className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Virtual Cash Balance Indicator */}
          <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-1.5 shadow-sm">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Virtual Cash</div>
              <div className="text-sm font-bold text-white tracking-tight">
                ₹{user.virtualCashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
            <button
              onClick={handleReset}
              title="Reset Virtual Balance to ₹100,000"
              className="ml-1 p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-700 rounded-lg transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Trade Button */}
          <button
            onClick={() => onOpenTrade()}
            className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold text-xs sm:text-sm px-3.5 py-2 rounded-xl shadow-lg shadow-emerald-500/20 transition cursor-pointer active:scale-95"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Trade</span>
          </button>

        </div>

      </div>
    </header>
  );
};
