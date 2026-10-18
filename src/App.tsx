import React, { useState } from 'react';
import { TradingProvider, useTrading } from './context/TradingContext';
import { ViewTab } from './types/trading';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StockMarketView } from './components/StockMarketView';
import { PortfolioView } from './components/PortfolioView';
import { TransactionsView } from './components/TransactionsView';
import { JavaProjectViewer } from './components/JavaProjectViewer';
import { ApiDocsView } from './components/ApiDocsView';
import { TradeModal } from './components/TradeModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('dashboard');
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const { activeTradeStock, activeTradeType, closeTradeModal } = useTrading();

  // If a trade was triggered from a specific stock button in any view
  const modalOpen = isTradeModalOpen || activeTradeStock !== null;

  const handleCloseModal = () => {
    setIsTradeModalOpen(false);
    closeTradeModal();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar onOpenTrade={() => setIsTradeModalOpen(true)} />

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto">
        
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'market' && <StockMarketView />}
          {activeTab === 'portfolio' && <PortfolioView onNavigate={setActiveTab} />}
          {activeTab === 'transactions' && <TransactionsView />}
          {activeTab === 'java-code' && <JavaProjectViewer />}
          {activeTab === 'api-docs' && <ApiDocsView />}
        </main>

      </div>

      {/* Order Execution Modal */}
      <TradeModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        defaultStock={activeTradeStock}
        defaultType={activeTradeType}
      />

      {/* Real-time Toast Notifications */}
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <TradingProvider>
      <MainLayout />
    </TradingProvider>
  );
}
