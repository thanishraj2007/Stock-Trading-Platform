import React, { useState } from 'react';
import { JAVA_PROJECT_FILES, JavaFileItem } from '../data/javaFilesRegistry';
import JSZip from 'jszip';
import { 
  FileCode2, 
  FolderTree, 
  Download, 
  Copy, 
  Check, 
  Code2, 
  Layers, 
  ShieldCheck, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

export const JavaProjectViewer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>(JAVA_PROJECT_FILES[0].id);
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const selectedFile = JAVA_PROJECT_FILES.find(f => f.id === selectedFileId) || JAVA_PROJECT_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      const rootFolder = zip.folder('codealpha-stock-trading');

      if (rootFolder) {
        // Add all project files
        JAVA_PROJECT_FILES.forEach(file => {
          rootFolder.file(file.path, file.content);
        });

        // Add schema.sql, data.sql, application.properties
        rootFolder.file('src/main/resources/application.properties', `server.port=8080
spring.datasource.url=jdbc:h2:mem:stockdb;DB_CLOSE_DELAY=-1;DB_CLOSE_ON_EXIT=FALSE
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
spring.jpa.hibernate.ddl-auto=update
app.trading.initial-balance=100000.00`);

        rootFolder.file('src/main/resources/schema.sql', `CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    virtual_cash_balance DECIMAL(15, 2) NOT NULL DEFAULT 100000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS stocks (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    symbol VARCHAR(20) NOT NULL UNIQUE,
    company_name VARCHAR(150) NOT NULL,
    current_price DECIMAL(15, 2) NOT NULL,
    daily_price_change DECIMAL(15, 2) NOT NULL DEFAULT 0.00,
    daily_change_percentage DECIMAL(8, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    sector VARCHAR(100) NOT NULL
);`);

        rootFolder.file('src/main/resources/data.sql', `INSERT INTO users (id, username, full_name, email, virtual_cash_balance)
VALUES (1, 'codealpha_trader', 'CodeAlpha Intern Trader', 'trader@codealpha.edu', 100000.00)
ON DUPLICATE KEY UPDATE id=id;

INSERT INTO stocks (id, symbol, company_name, current_price, daily_price_change, daily_change_percentage, currency, sector)
VALUES 
(1, 'TCS', 'Tata Consultancy Services', 3920.50, 45.20, 1.17, 'INR', 'Information Technology'),
(2, 'INFY', 'Infosys Limited', 1634.80, -12.40, -0.75, 'INR', 'Information Technology'),
(3, 'RELIANCE', 'Reliance Industries Ltd.', 2980.00, 32.50, 1.10, 'INR', 'Energy & Telecom'),
(4, 'HDFCBANK', 'HDFC Bank Ltd.', 1445.60, 8.90, 0.62, 'INR', 'Banking & Finance'),
(5, 'WIPRO', 'Wipro Limited', 482.30, -3.15, -0.65, 'INR', 'Information Technology'),
(6, 'ICICIBANK', 'ICICI Bank Ltd.', 1088.75, 14.30, 1.33, 'INR', 'Banking & Finance'),
(7, 'AAPL', 'Apple Inc.', 182.50, 2.10, 1.16, 'USD', 'Consumer Electronics'),
(8, 'MSFT', 'Microsoft Corporation', 420.25, -1.85, -0.44, 'USD', 'Software & Cloud'),
(9, 'AMZN', 'Amazon.com Inc.', 178.90, 3.40, 1.94, 'USD', 'E-Commerce & Cloud'),
(10, 'GOOGL', 'Alphabet Inc. (Google)', 156.40, 1.65, 1.07, 'USD', 'Internet & AI')
ON DUPLICATE KEY UPDATE id=id;`);
        const blob = await zip.generateAsync({ type: 'blob' });
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = 'CodeAlpha-StockTradingPlatform-Java.zip';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      }
    } catch (err) {
      console.error('Failed to generate zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* CodeAlpha Project Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/80 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>CodeAlpha Java Programming Internship — Task 2</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Complete Java Spring Boot Backend Suite
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Full Object-Oriented Architecture implementing Encapsulation, Inheritance, Abstraction, and Polymorphism. Includes Spring Data JPA persistence, REST APIs, H2/MySQL database integration, and JUnit 5 test suites.
          </p>
        </div>

        {/* Download Zip Button */}
        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="flex items-center space-x-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs rounded-xl transition shadow-lg shadow-emerald-500/20 active:scale-95 shrink-0 disabled:opacity-60 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>{isZipping ? 'Bundling ZIP...' : 'Download Project (.zip)'}</span>
        </button>
      </div>

      {/* OOP Concepts Badge Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">Encapsulation</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Guarded user balances via deductCash() & addCash()</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Inheritance</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Stock extends AbstractFinancialAsset</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-purple-400 uppercase tracking-wider">Abstraction</div>
          <p className="text-[11px] text-slate-400 mt-0.5">AbstractFinancialAsset contract & calculateValuation()</p>
        </div>
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Polymorphism</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Overridden valuation methods & JPA Repositories</p>
        </div>
      </div>

      {/* Explorer & Code Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* File Tree Sidebar */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider mb-3">
            <FolderTree className="w-4 h-4 text-emerald-400" />
            <span>Maven Project Files ({JAVA_PROJECT_FILES.length})</span>
          </div>

          <div className="space-y-1">
            {JAVA_PROJECT_FILES.map(file => {
              const isSelected = file.id === selectedFileId;
              return (
                <button
                  key={file.id}
                  onClick={() => setSelectedFileId(file.id)}
                  className={`w-full text-left p-2.5 rounded-xl transition flex items-start space-x-2.5 text-xs ${
                    isSelected
                      ? 'bg-slate-800 border border-slate-700 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <FileCode2 className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-emerald-400' : 'text-slate-500'}`} />
                  <div className="truncate">
                    <div className="font-semibold truncate">{file.name}</div>
                    <div className="text-[10px] text-slate-500 font-mono truncate">{file.path}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content Pane */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col">
          
          {/* File Header */}
          <div className="p-4 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-mono text-sm font-bold text-white">{selectedFile.name}</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {selectedFile.oopRole}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold rounded-lg transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Syntax Code Box */}
          <div className="p-4 bg-slate-950 font-mono text-xs text-slate-300 overflow-x-auto max-h-[560px] leading-relaxed select-text">
            <pre className="whitespace-pre">{selectedFile.content}</pre>
          </div>

        </div>

      </div>

    </div>
  );
};
