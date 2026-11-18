import React, { useEffect, useState } from 'react';
import { Users, Search, ShoppingBag, Phone, Mail, Award } from 'lucide-react';
import { adminAPI } from '../../services/api';

export const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getCustomers();
      setCustomers(res.data);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.includes(search)
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-black text-slate-900 dark:text-white">
          Shopper Directory & Loyalty
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Manage verified self-checkout shoppers, visit frequency, and gross expenditure
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by shopper name, email, or phone..."
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
        />
      </div>

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">Loading shoppers...</div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-3 px-4">Shopper</th>
                <th className="py-3 px-4">Phone / WhatsApp</th>
                <th className="py-3 px-4 text-center">Store Trips</th>
                <th className="py-3 px-4 text-right">Total Spent (₹)</th>
                <th className="py-3 px-4 text-center">Member Tier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4">
                    <p className="font-bold text-slate-900 dark:text-white">{c.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{c.email}</p>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                    {c.phone || '+91 98765 43210'}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700 dark:text-slate-300">
                    {c.orders_count || 1}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    ₹{c.total_spent?.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                      <Award className="w-3 h-3" />
                      <span>Gold Member</span>
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

export default AdminCustomers;
