import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, Calendar, ArrowRight, FileText, CheckCircle2,
  Clock, Search, Filter, ShieldCheck
} from 'lucide-react';
import { ordersAPI } from '../services/api';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { t } = useThemeLanguage();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await ordersAPI.getAll();
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(o => 
    o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
    o.invoice_number?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {t('nav_orders')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Access your previous self-checkout purchases and downloadable tax receipts
            </p>
          </div>

          <Link
            to="/scanner"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            Start New Scan
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID or Invoice No..."
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="py-20 text-center text-xs text-slate-500 font-semibold">
            Loading order history...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">No Orders Found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Scan some supermarket items and checkout to generate your first digital invoice!
            </p>
            <Link
              to="/scanner"
              className="inline-block px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-bold uppercase tracking-wider"
            >
              Scan Items Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id || order.order_id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 dark:hover:border-blue-800 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                      {order.order_id}
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      order.payment_status === 'PAID'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {order.payment_status || 'PENDING'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </span>
                    <span>•</span>
                    <span>{order.items?.length || 0} items purchased</span>
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  <div className="text-left sm:text-right">
                    <p className="text-[10px] uppercase font-bold text-slate-400">Total Paid</p>
                    <p className="text-base font-black text-blue-600 dark:text-cyan-400">
                      ₹{order.total_amount?.toFixed(2)}
                    </p>
                  </div>

                  <Link
                    to={`/receipt/${order.order_id || order.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
                  >
                    <FileText className="w-4 h-4 text-blue-500" />
                    <span>View Receipt</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default OrderHistoryPage;
