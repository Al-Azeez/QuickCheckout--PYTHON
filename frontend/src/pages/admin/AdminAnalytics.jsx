import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Clock, Users, ArrowUpRight } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await adminAPI.getAnalytics();
        setData(res.data);
      } catch (e) {
        console.error('Failed to load analytics:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const peakHours = [
    { hour: '09 AM - 11 AM', footfall: 'Medium', volume: 140 },
    { hour: '11 AM - 02 PM', footfall: 'High', volume: 380 },
    { hour: '02 PM - 05 PM', footfall: 'Moderate', volume: 210 },
    { hour: '05 PM - 09 PM', footfall: 'Peak', volume: 560 },
    { hour: '09 PM - 11 PM', footfall: 'Late Rush', volume: 190 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Retail Analytics & Demand Intelligence
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          In-depth retail metrics, peak customer checkout windows, and category profitability
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Basket Value</p>
          <p className="text-3xl font-black text-slate-900 dark:text-white">₹429.50</p>
          <p className="text-xs text-emerald-600 font-semibold">+12% vs staffed cashiers</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Checkout Speed / Customer</p>
          <p className="text-3xl font-black text-blue-600 dark:text-cyan-400">42 seconds</p>
          <p className="text-xs text-slate-500">6.4x faster than manual scanning</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cash Counter Queue Reduction</p>
          <p className="text-3xl font-black text-emerald-600">89.4%</p>
          <p className="text-xs text-slate-500">Customer queue time eliminated</p>
        </div>
      </div>

      {/* Peak Checkout Hours Breakdown */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Peak Self-Checkout Windows (Store #104)
        </h2>
        <div className="space-y-3">
          {peakHours.map((ph, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">{ph.hour}</span>
              <span className="font-semibold text-blue-600 dark:text-cyan-400">{ph.volume} shoppers/hr</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {ph.footfall}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
