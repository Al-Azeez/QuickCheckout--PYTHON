import React, { useEffect, useState } from 'react';
import {
  AlertTriangle, CheckCircle2, XCircle, Search, RefreshCw,
  ArrowUpRight, Plus, PackageCheck
} from 'lucide-react';
import { adminAPI, productsAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

export const AdminInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(''); // '', 'low', 'out', 'in'
  const [search, setSearch] = useState('');
  const [adjustingId, setAdjustingId] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, [filter]);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getInventory({ status: filter });
      setInventory(res.data);
    } catch (err) {
      console.error('Failed to load inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockRestock = async (product, amount) => {
    const prodId = product.id || product._id;
    const newStock = Math.max(0, (product.stock || 0) + amount);
    try {
      await productsAPI.update(prodId, { stock: newStock });
      setInventory(prev => prev.map(p => (p.id || p._id) === prodId ? { ...p, stock: newStock } : p));
    } catch (e) {
      alert('Failed to restock item');
    }
  };

  const filtered = inventory.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Real-Time Inventory & Stock Alerts
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Monitored atomically via MongoDB. Replenish shelves before items sell out.
          </p>
        </div>

        <button
          onClick={fetchInventory}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Refresh Stock</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter inventory by name, barcode, or SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilter('')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === '' ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
            }`}
          >
            All Stock
          </button>
          <button
            onClick={() => setFilter('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'low' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-amber-600'
            }`}
          >
            Low Stock Alerts (≤5)
          </button>
          <button
            onClick={() => setFilter('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'out' ? 'bg-rose-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-rose-600'
            }`}
          >
            Out of Stock (0)
          </button>
          <button
            onClick={() => setFilter('in')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              filter === 'in' ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-emerald-600'
            }`}
          >
            In Stock
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500">
          Loading stock records...
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Barcode</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Shelf Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Quick Restock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filtered.map((item) => (
                  <tr key={item.id || item._id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-tight">
                            {item.name}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            SKU: {item.sku}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      {item.barcode}
                    </td>

                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                      {item.category}
                    </td>

                    <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 dark:text-white text-sm">
                      {item.stock}
                    </td>

                    <td className="py-3 px-4 text-center">
                      <StatusBadge status={item.status} stock={item.stock} size="xs" />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleStockRestock(item, 10)}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold text-[11px] hover:bg-blue-100 transition-colors"
                          title="Add 10 units"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleStockRestock(item, 50)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] hover:bg-emerald-100 transition-colors"
                          title="Add 50 units"
                        >
                          +50
                        </button>
                      </div>
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

export default AdminInventory;
