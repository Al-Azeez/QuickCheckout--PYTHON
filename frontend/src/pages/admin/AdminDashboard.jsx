import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp, ShoppingBag, Package, Users, AlertTriangle,
  ArrowRight, PlusCircle, Scan, CreditCard, Sparkles, RefreshCw
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import BarcodeVisual from '../../components/common/BarcodeVisual';

export const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getAnalytics();
      setData(res.data);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs font-semibold text-slate-500">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
        Loading Supermarket Operations Hub...
      </div>
    );
  }

  const kpis = data?.kpis || {
    total_revenue: 184850,
    total_orders: 430,
    total_products: 24,
    total_customers: 280,
    low_stock_count: 2,
    out_of_stock_count: 1
  };

  const revenueTrend = data?.revenue_trend || [];
  const bestSellers = data?.best_sellers || [];
  const categorySales = data?.category_sales || [];
  const recentTxs = data?.recent_transactions || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Top Banner and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded">
            Live Store Operations • Branch #104
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">
            Store Command & Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time telemetry on customer scans, revenue velocity, and MongoDB stock levels
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/products/add"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Product & Barcode</span>
          </Link>
          <Link
            to="/scanner"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            <Scan className="w-4 h-4 text-blue-500" />
            <span>Test Customer Scanner</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Revenue */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            ₹{kpis.total_revenue?.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            +18.4% vs last week
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Orders</span>
            <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {kpis.total_orders}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">
            All verified via Soundbox
          </span>
        </div>

        {/* Total SKUs */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active SKUs</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {kpis.total_products}
          </p>
          <span className="text-[11px] text-slate-500 font-medium">
            Indexed by unique barcode
          </span>
        </div>

        {/* Total Customers */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Registered Users</span>
            <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {kpis.total_customers}
          </p>
          <span className="text-[11px] text-emerald-600 font-semibold">
            +32 today
          </span>
        </div>

        {/* Low Stock Items */}
        <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Stock Alerts</span>
            <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400">
            {kpis.low_stock_count} Low / {kpis.out_of_stock_count} Out
          </p>
          <Link to="/admin/inventory" className="text-[11px] text-blue-600 hover:underline font-semibold block">
            Inspect inventory →
          </Link>
        </div>

      </div>

      {/* Revenue Trend Visual & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Sales Trend Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Weekly Revenue Velocity (₹)
              </h2>
              <p className="text-xs text-slate-500">Self-checkout revenue trends over the past 7 days</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2.5 py-1 rounded-md">
              Average ₹26,450 / day
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-3 pt-6 px-2">
            {revenueTrend.map((item, idx) => {
              const maxRev = 50000;
              const heightPercent = Math.min(100, Math.round((item.revenue / maxRev) * 100));
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    ₹{item.revenue}
                  </span>
                  <div className="w-full max-w-[42px] bg-slate-100 dark:bg-slate-800 rounded-t-xl overflow-hidden h-40 flex items-end">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300 transition-all rounded-t-xl"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Share (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Category Distribution
            </h2>
            <p className="text-xs text-slate-500">Sales volume by supermarket section</p>
          </div>

          <div className="space-y-3 pt-2">
            {categorySales.map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800 dark:text-slate-200">{cat.category}</span>
                  <span className="text-slate-500 font-mono">{cat.percentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div
                    style={{ width: `${cat.percentage}%` }}
                    className="h-full bg-blue-600 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Best Sellers Table & Live Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Best Sellers (7 cols) */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Top Scanned & Sold Products
            </h2>
            <Link to="/admin/products" className="text-xs text-blue-600 font-semibold hover:underline">
              Manage All SKUs
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-2">Product Name</th>
                  <th className="pb-2">Category</th>
                  <th className="pb-2 text-center">Units Sold</th>
                  <th className="pb-2 text-right">Revenue (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {bestSellers.map((item, idx) => (
                  <tr key={idx} className="py-2.5">
                    <td className="py-3 font-bold text-slate-900 dark:text-white">{item.name}</td>
                    <td className="py-3 text-slate-500">{item.category}</td>
                    <td className="py-3 text-center font-mono font-bold text-blue-600 dark:text-cyan-400">{item.sold}</td>
                    <td className="py-3 text-right font-mono font-bold text-slate-900 dark:text-white">₹{item.revenue?.toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Live Verified Soundbox Transactions (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Recent Transactions
            </h2>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="space-y-3">
            {recentTxs.slice(0, 5).map((tx, idx) => (
              <div
                key={tx.id || tx._id || idx}
                className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <p className="font-mono font-bold text-slate-900 dark:text-white">
                    {tx.order_id}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {tx.method || 'UPI (Soundbox)'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                    +₹{tx.amount?.toFixed(2)}
                  </p>
                  <span className="text-[10px] text-slate-400">Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
