import React, { useState, useMemo } from 'react';
import { useTrading } from '../context/TradingContext';
import { 
  ReceiptText, 
  Filter, 
  Download, 
  Search, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Calendar
} from 'lucide-react';

export const TransactionsView: React.FC = () => {
  const { transactions } = useTrading();
  const [filterType, setFilterType] = useState<'ALL' | 'BUY' | 'SELL'>('ALL');
  const [searchSymbol, setSearchSymbol] = useState('');

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesType = filterType === 'ALL' || tx.transactionType === filterType;
      const matchesSymbol = 
        tx.stockSymbol.toLowerCase().includes(searchSymbol.toLowerCase()) ||
        tx.companyName.toLowerCase().includes(searchSymbol.toLowerCase()) ||
        tx.id.toLowerCase().includes(searchSymbol.toLowerCase());
      return matchesType && matchesSymbol;
    });
  }, [transactions, filterType, searchSymbol]);

  // Export to CSV
  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;
    const headers = ['Transaction ID', 'Type', 'Symbol', 'Company', 'Quantity', 'Execution Price (INR)', 'Total Amount (INR)', 'Timestamp', 'Status'];
    const rows = filteredTransactions.map(t => [
      t.id,
      t.transactionType,
      t.stockSymbol,
      `"${t.companyName}"`,
      t.quantity,
      t.executionPrice.toFixed(2),
      t.totalAmount.toFixed(2),
      `"${new Date(t.timestamp).toISOString()}"`,
      t.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `codealpha_trading_transactions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">

      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by ID, Symbol or Company..."
            value={searchSymbol}
            onChange={e => setSearchSymbol(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Filter Chips & CSV Export */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          
          {/* Filter Pills */}
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80">
            {(['ALL', 'BUY', 'SELL'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
                  filterType === type
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {type === 'ALL' ? 'All Orders' : type === 'BUY' ? 'Buys Only' : 'Sells Only'}
              </button>
            ))}
          </div>

          {/* Export Button */}
          <button
            onClick={exportToCSV}
            disabled={filteredTransactions.length === 0}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

        </div>

      </div>

      {/* Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ReceiptText className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Audit Transaction Log</h3>
          </div>
          <span className="text-xs text-slate-400">
            Showing {filteredTransactions.length} of {transactions.length} total entries
          </span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No transactions match the selected filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-800/80 border-b border-slate-700/80 text-slate-400 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 font-semibold">Tx ID</th>
                  <th className="py-3 px-4 font-semibold">Type</th>
                  <th className="py-3 px-4 font-semibold">Stock Symbol</th>
                  <th className="py-3 px-4 font-semibold">Company Name</th>
                  <th className="py-3 px-4 font-semibold text-right">Shares</th>
                  <th className="py-3 px-4 font-semibold text-right">Executed Price</th>
                  <th className="py-3 px-4 font-semibold text-right">Settlement Total</th>
                  <th className="py-3 px-4 font-semibold text-right">Timestamp</th>
                  <th className="py-3 px-4 font-semibold text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {filteredTransactions.map(tx => {
                  const isBuy = tx.transactionType === 'BUY';

                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                      
                      {/* ID */}
                      <td className="py-3.5 px-4 font-bold text-slate-300">
                        {tx.id}
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4 font-sans">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isBuy 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}>
                          {tx.transactionType}
                        </span>
                      </td>

                      {/* Symbol */}
                      <td className="py-3.5 px-4 font-sans font-bold text-white">
                        {tx.stockSymbol}
                      </td>

                      {/* Company */}
                      <td className="py-3.5 px-4 font-sans text-slate-400 truncate max-w-[160px]">
                        {tx.companyName}
                      </td>

                      {/* Shares */}
                      <td className="py-3.5 px-4 text-right text-slate-200">
                        {tx.quantity}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 text-right text-slate-300">
                        ₹{tx.executionPrice.toFixed(2)}
                      </td>

                      {/* Total */}
                      <td className="py-3.5 px-4 text-right font-bold text-white">
                        {isBuy ? '-' : '+'}₹{tx.totalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>

                      {/* Timestamp */}
                      <td className="py-3.5 px-4 text-right text-slate-400 font-sans text-[11px]">
                        {new Date(tx.timestamp).toLocaleString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center font-sans">
                        <span className="inline-flex items-center space-x-1 text-emerald-400 text-[10px] font-bold">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{tx.status}</span>
                        </span>
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
