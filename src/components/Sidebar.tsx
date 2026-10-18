import React from 'react';
import { ViewTab } from '../types/trading';
import { 
  LayoutDashboard, 
  CandlestickChart, 
  Briefcase, 
  ReceiptText, 
  FileCode2, 
  Webhook, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useTrading } from '../context/TradingContext';

interface SidebarProps {
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { holdings, transactions } = useTrading();

  const navItems = [
    {
      id: 'dashboard' as ViewTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
      desc: 'Overview & Net Worth'
    },
    {
      id: 'market' as ViewTab,
      label: 'Stock Market',
      icon: CandlestickChart,
      badge: '10 Stocks',
      desc: 'Simulated Exchange'
    },
    {
      id: 'portfolio' as ViewTab,
      label: 'Portfolio',
      icon: Briefcase,
      badge: holdings.length > 0 ? `${holdings.length}` : null,
      desc: 'Holdings & P&L'
    },
    {
      id: 'transactions' as ViewTab,
      label: 'Transactions',
      icon: ReceiptText,
      badge: transactions.length > 0 ? `${transactions.length}` : null,
      desc: 'Order History & Ledger'
    },
    {
      id: 'java-code' as ViewTab,
      label: 'Java Project Suite',
      icon: FileCode2,
      badge: 'OOP Source',
      highlight: true,
      desc: 'CodeAlpha Source & ZIP'
    },
    {
      id: 'api-docs' as ViewTab,
      label: 'REST API & Tests',
      icon: Webhook,
      badge: 'Spring Boot',
      desc: 'Endpoints & JUnit 5'
    }
  ];

  return (
    <aside className="w-full md:w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        
        {/* Navigation Group */}
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
            Platform Menu
          </div>
          <nav className="space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer text-left ${
                    isActive
                      ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  } ${item.highlight ? 'border-emerald-500/30' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg ${
                      isActive 
                        ? item.highlight ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-white' 
                        : 'text-slate-400'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className={`leading-none ${isActive ? 'text-white font-semibold' : ''}`}>
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5 leading-tight">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {item.badge && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      item.highlight
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : isActive
                          ? 'bg-slate-700 text-slate-200'
                          : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* CodeAlpha Project Verification Card */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-slate-800/90 to-slate-900 border border-slate-700/60 text-xs">
          <div className="flex items-center space-x-2 text-emerald-400 font-semibold mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>CodeAlpha Internship</span>
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Task 2: Stock Trading Platform. Features Java OOP concepts (Encapsulation, Inheritance, Abstraction, Polymorphism), Spring Boot REST API & H2/MySQL persistence.
          </p>
        </div>

      </div>

      {/* System Status Footer */}
      <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Simulation Active</span>
        </span>
        <span className="font-mono text-[10px] text-slate-400">v1.0.0-Java17</span>
      </div>
    </aside>
  );
};
