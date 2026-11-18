import React, { useEffect, useState } from 'react';
import { CreditCard, Search, CheckCircle2, ShieldCheck, RefreshCw } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const AdminPayments = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getTransactions();
      setTransactions(res.data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = transactions.filter(t =>
    t.payment_id?.toLowerCase().includes(search.toLowerCase()) ||
    t.order_id?.toLowerCase().includes(search.toLowerCase()) ||
    t.method?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Payments & Settlement Ledger
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Cryptographically verified UPI and Razorpay transactions recorded in MongoDB
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Sync Gateway</span>
        </button>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Payment ID, Order ID, or Method..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Loading ledger...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Transaction / Payment ID</th>
                <th className="py-3 px-4">Order Reference</th>
                <th className="py-3 px-4">Gateway & Method</th>
                <th className="py-3 px-4 text-right">Settled Amount (₹)</th>
                <th className="py-3 px-4 text-center">Settlement Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.map((tx) => (
                <tr key={tx.id || tx._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                    {tx.payment_id}
                  </td>
                  <td className="py-3 px-4 font-mono text-blue-600 dark:text-blue-400 font-semibold">
                    {tx.order_id}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {tx.method || 'UPI Soundbox'}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-black text-slate-900 dark:text-white text-sm">
                    ₹{tx.amount?.toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{tx.status || 'SUCCESS'}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
