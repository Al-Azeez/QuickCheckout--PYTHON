import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Search, FileText, Calendar, RefreshCw, CheckCircle2 } from 'lucide-react';
import { ordersAPI } from '../../services/api';

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await ordersAPI.getAll({ scope: 'all' });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter(o =>
    o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
    o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.invoice_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Supermarket Orders & POS Invoices
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time feed of all customer checkouts and tax invoices generated across store kiosks
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Feed</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by Order ID, Customer Name, or Invoice..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
        />
      </div>

      {/* Orders Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          Loading orders...
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Receipt className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">No Orders Found</h3>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Order ID & Date</th>
                  <th className="py-3 px-4">Customer Details</th>
                  <th className="py-3 px-4 text-center">Items Count</th>
                  <th className="py-3 px-4 text-right">Total Amount (₹)</th>
                  <th className="py-3 px-4 text-center">Payment Status</th>
                  <th className="py-3 px-4 text-right">Tax Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filtered.map((ord) => (
                  <tr key={ord.id || ord.order_id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">
                        {ord.order_id}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                          })}
                        </span>
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {ord.customer?.name || 'Shopper'}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {ord.customer?.phone || ord.customer?.email}
                      </p>
                    </td>

                    <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                      {ord.items?.length || 0}
                    </td>

                    <td className="py-3 px-4 text-right font-mono font-black text-slate-900 dark:text-white text-sm">
                      ₹{ord.total_amount?.toFixed(2)}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.payment_status === 'PAID'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {ord.payment_status} • {ord.payment_method || 'UPI'}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/receipt/${ord.order_id || ord.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs hover:bg-blue-100 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>View</span>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminOrders;
