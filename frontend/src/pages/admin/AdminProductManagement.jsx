import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Search, PlusCircle, Trash2, Edit3, Eye,
  AlertTriangle, CheckCircle2, XCircle, RefreshCw, X, Tag
} from 'lucide-react';
import { productsAPI } from '../../services/api';
import BarcodeVisual from '../../components/common/BarcodeVisual';
import StatusBadge from '../../components/common/StatusBadge';

export const AdminProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const [editProduct, setEditProduct] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, [selectedCat]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await productsAPI.getAll({ category: selectedCat });
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from the supermarket database?`)) return;
    try {
      await productsAPI.delete(id);
      setProducts(prev => prev.filter(p => (p.id || p._id) !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete product');
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;
    setEditSaving(true);
    setErrorMsg(null);

    try {
      const prodId = editProduct.id || editProduct._id;
      const res = await productsAPI.update(prodId, editProduct);
      setProducts(prev => prev.map(p => (p.id || p._id) === prodId ? res.data : p));
      setEditProduct(null);
    } catch (err) {
      setErrorMsg(err.response?.data?.error || 'Failed to save product edits');
    } finally {
      setEditSaving(false);
    }
  };

  const filteredProducts = products.filter(p =>
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
            Product Catalog & Barcodes Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Every product registered here is instantly scannable by customers on the shop floor
          </p>
        </div>

        <Link
          to="/admin/products/add"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by product name, barcode number, or SKU..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
          >
            <option value="All">All Categories</option>
            <option value="Fruits & Vegetables">Fruits & Vegetables</option>
            <option value="Dairy & Eggs">Dairy & Eggs</option>
            <option value="Snacks">Snacks</option>
            <option value="Beverages">Beverages</option>
            <option value="Bakery">Bakery</option>
            <option value="Household">Household</option>
            <option value="Personal Care">Personal Care</option>
            <option value="Groceries">Groceries</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      {loading ? (
        <div className="py-20 text-center text-xs font-semibold text-slate-500">
          Fetching products from MongoDB database...
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 text-[11px] font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Item & Visual</th>
                  <th className="py-3 px-4">Barcode & SKU</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Price (₹)</th>
                  <th className="py-3 px-4 text-center">Stock</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {filteredProducts.map((p) => {
                  const prodId = p.id || p._id;
                  return (
                    <tr key={prodId} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-slate-100 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">
                              {p.name}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Unit: {p.unit || 'Pack'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-mono font-bold text-slate-900 dark:text-white block">
                            {p.barcode}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            SKU: {p.sku}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="text-slate-600 dark:text-slate-300">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                        ₹{p.price}
                        {p.discount > 0 && (
                          <span className="block text-[10px] text-rose-500 font-sans font-extrabold">
                            {p.discount}% OFF
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-900 dark:text-white">
                        {p.stock}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <StatusBadge status={p.status} stock={p.stock} size="xs" />
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditProduct({ ...p })}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                            title="Edit product"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prodId, p.name)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Edit Product & Stock
              </h3>
              <button
                onClick={() => setEditProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={editProduct.name}
                  onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Barcode (Must be Unique)
                  </label>
                  <input
                    type="text"
                    required
                    value={editProduct.barcode}
                    onChange={(e) => setEditProduct({ ...editProduct, barcode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    required
                    value={editProduct.sku}
                    onChange={(e) => setEditProduct({ ...editProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={editProduct.price}
                    onChange={(e) => setEditProduct({ ...editProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    required
                    value={editProduct.stock}
                    onChange={(e) => setEditProduct({ ...editProduct, stock: parseInt(e.target.value, 10) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">
                    Discount %
                  </label>
                  <input
                    type="number"
                    value={editProduct.discount || 0}
                    onChange={(e) => setEditProduct({ ...editProduct, discount: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold"
                >
                  {editSaving ? 'Saving...' : 'Update Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminProductManagement;
