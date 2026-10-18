import React, { useState } from 'react';
import { 
  Webhook, 
  Terminal, 
  CheckCircle2, 
  Play, 
  Database, 
  FileText, 
  Copy, 
  Check, 
  ShieldCheck,
  Server
} from 'lucide-react';

export const ApiDocsView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
          <Webhook className="w-4 h-4" />
          <span>CodeAlpha REST API & Local Execution Guide</span>
        </div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Spring Boot REST Endpoints & Testing Suite
        </h2>
        <p className="text-xs text-slate-400 mt-1 max-w-2xl">
          Complete REST API specification connecting the front-end interface to the Spring Boot back-end, along with instructions to run locally in VS Code or IntelliJ IDEA.
        </p>
      </div>

      {/* Running Locally Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>How to Run Locally (VS Code / IntelliJ IDEA / Terminal)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* IntelliJ */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="font-bold text-white flex items-center space-x-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>IntelliJ IDEA</span>
            </div>
            <ol className="list-decimal list-inside text-slate-300 space-y-1 leading-relaxed">
              <li>File &rarr; Open &rarr; select <code className="text-emerald-400">codealpha-stock-trading</code> folder.</li>
              <li>Wait for Maven dependencies to sync automatically.</li>
              <li>Navigate to <code className="text-emerald-400">StockTradingApplication.java</code>.</li>
              <li>Click the green <strong className="text-white">Run</strong> arrow.</li>
            </ol>
          </div>

          {/* VS Code */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="font-bold text-white flex items-center space-x-2">
              <Play className="w-4 h-4 text-cyan-400" />
              <span>VS Code</span>
            </div>
            <ol className="list-decimal list-inside text-slate-300 space-y-1 leading-relaxed">
              <li>Install <strong className="text-white">Extension Pack for Java</strong>.</li>
              <li>Open folder in VS Code.</li>
              <li>Open <code className="text-emerald-400">StockTradingApplication.java</code>.</li>
              <li>Click <strong className="text-white">Run Java</strong> above main().</li>
            </ol>
          </div>

          {/* CLI */}
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="font-bold text-white flex items-center space-x-2">
              <Server className="w-4 h-4 text-purple-400" />
              <span>Maven Terminal</span>
            </div>
            <p className="text-slate-300">Run directly from command prompt or bash:</p>
            <div className="bg-slate-950 p-2 rounded-lg font-mono text-[11px] text-emerald-300 flex items-center justify-between">
              <span>mvn spring-boot:run</span>
              <button
                onClick={() => copySnippet('mvn-run', 'mvn spring-boot:run')}
                className="text-slate-500 hover:text-white"
              >
                {copiedSection === 'mvn-run' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>

        </div>

        {/* Database & H2 console details */}
        <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2 text-slate-300">
            <Database className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>
              <strong>Embedded H2 Web Console:</strong> Access live tables at <code className="text-cyan-300 font-mono">http://localhost:8080/h2-console</code> (JDBC URL: <code className="text-slate-300 font-mono">jdbc:h2:mem:stockdb</code>, User: <code className="text-slate-300 font-mono">sa</code>, Password: blank).
            </span>
          </div>
          <span className="text-[11px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-mono shrink-0">
            MySQL Compatible
          </span>
        </div>
      </div>

      {/* REST API Endpoints Table */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">REST Endpoints Specification</h3>

        {/* 1. GET /api/stocks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-2.5 py-1 rounded-lg text-xs font-mono">
                GET
              </span>
              <span className="font-mono text-sm font-bold text-white">/api/stocks</span>
            </div>
            <span className="text-xs text-slate-400">Fetch all 10 sample stocks</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{`// Response 200 OK
[
  {
    "id": 1,
    "symbol": "TCS",
    "companyName": "Tata Consultancy Services",
    "currentPrice": 3920.50,
    "dailyPriceChange": 45.20,
    "dailyChangePercentage": 1.17,
    "currency": "INR",
    "sector": "Information Technology"
  }
]`}</pre>
          </div>
        </div>

        {/* 2. POST /api/trade/buy */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold px-2.5 py-1 rounded-lg text-xs font-mono">
                POST
              </span>
              <span className="font-mono text-sm font-bold text-white">/api/trade/buy</span>
            </div>
            <span className="text-xs text-slate-400">Execute stock buy order</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <div className="text-[11px] text-slate-400 mb-1 font-sans">Request Payload:</div>
              <div className="bg-slate-950 p-3 rounded-xl text-slate-300">
                <pre>{`{
  "userId": 1,
  "symbol": "TCS",
  "quantity": 5
}`}</pre>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 mb-1 font-sans">Success Response (200 OK):</div>
              <div className="bg-slate-950 p-3 rounded-xl text-emerald-300">
                <pre>{`{
  "success": true,
  "transactionId": 1024,
  "symbol": "TCS",
  "quantity": 5,
  "executionPrice": 3920.50,
  "totalAmount": 19602.50,
  "remainingVirtualCash": 80397.50
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* 3. POST /api/trade/sell */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold px-2.5 py-1 rounded-lg text-xs font-mono">
                POST
              </span>
              <span className="font-mono text-sm font-bold text-white">/api/trade/sell</span>
            </div>
            <span className="text-xs text-slate-400">Execute stock sell order</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
            <div>
              <div className="text-[11px] text-slate-400 mb-1 font-sans">Request Payload:</div>
              <div className="bg-slate-950 p-3 rounded-xl text-slate-300">
                <pre>{`{
  "userId": 1,
  "symbol": "TCS",
  "quantity": 2
}`}</pre>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 mb-1 font-sans">Success Response (200 OK):</div>
              <div className="bg-slate-950 p-3 rounded-xl text-emerald-300">
                <pre>{`{
  "success": true,
  "transactionId": 1025,
  "symbol": "TCS",
  "transactionType": "SELL",
  "quantity": 2,
  "totalAmount": 7841.00,
  "remainingVirtualCash": 88238.50
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* 4. GET /api/portfolio/{userId} */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-2.5 py-1 rounded-lg text-xs font-mono">
                GET
              </span>
              <span className="font-mono text-sm font-bold text-white">/api/portfolio/{'{userId}'}</span>
            </div>
            <span className="text-xs text-slate-400">Retrieve portfolio valuations & P&L metrics</span>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl font-mono text-xs text-slate-300 overflow-x-auto">
            <pre>{`// Response 200 OK
{
  "userId": 1,
  "username": "codealpha_trader",
  "virtualCashBalance": 80397.50,
  "totalPortfolioValue": 100525.00,
  "totalInvested": 19602.50,
  "overallProfitLoss": 525.00,
  "overallProfitLossPercentage": 2.68,
  "ownedStocksCount": 1,
  "holdings": [
    {
      "symbol": "TCS",
      "companyName": "Tata Consultancy Services",
      "quantity": 5,
      "averagePurchasePrice": 3920.50,
      "currentPrice": 4025.50,
      "currentValue": 20127.50,
      "profitLoss": 525.00,
      "profitLossPercentage": 2.68
    }
  ]
}`}</pre>
          </div>
        </div>

      </div>

      {/* Unit Tests Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center space-x-2 text-sm font-bold text-white uppercase tracking-wider">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Automated Unit Tests (JUnit 5 & Mockito)</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Run <code className="text-emerald-400 font-mono">mvn test</code> to execute all test cases in <code className="text-slate-300 font-mono">TradingServiceTest.java</code>:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <span className="font-bold text-emerald-400 font-mono">testBuyStock_Success()</span>
            <p className="text-slate-300 mt-1 text-[11px]">
              Verifies cash balance deduction, portfolio item weighted average creation, and transaction audit recording.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <span className="font-bold text-rose-400 font-mono">testBuyStock_InsufficientFunds()</span>
            <p className="text-slate-300 mt-1 text-[11px]">
              Verifies transaction aborts and throws <code className="text-rose-300">InsufficientBalanceException</code> when trade amount exceeds cash.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <span className="font-bold text-emerald-400 font-mono">testSellStock_Success()</span>
            <p className="text-slate-300 mt-1 text-[11px]">
              Verifies proceeds are credited to user balance and portfolio quantity decremented.
            </p>
          </div>
          <div className="p-3 rounded-xl bg-slate-800/70 border border-slate-700/60">
            <span className="font-bold text-rose-400 font-mono">testSellStock_InsufficientShares()</span>
            <p className="text-slate-300 mt-1 text-[11px]">
              Verifies selling more shares than owned throws <code className="text-rose-300">InsufficientStockException</code>.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
