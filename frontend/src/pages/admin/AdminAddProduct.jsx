import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle, Scan, Sparkles, AlertCircle, CheckCircle2,
  ArrowLeft, RefreshCw, Image, Tag, ArrowRight
} from 'lucide-react';
import { productsAPI } from '../../services/api';
import BarcodeVisual from '../../components/common/BarcodeVisual';

export const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [barcode, setBarcode] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Groceries');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [discount, setDiscount] = useState('0');
  const [unit, setUnit] = useState('1 unit');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80');
  const [description, setDescription] = useState('');
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [createdProduct, setCreatedProduct] = useState(null);

  const generateRandomEAN13 = () => {
    // Generate valid looking Indian 890... barcode
    const prefix = '890';
    let digits = prefix;
    for (let i = 0; i < 10; i++) {
      digits += Math.floor(Math.random() * 10);
    }
    setBarcode(digits);
    if (!sku) {
      setSku(`SKU-${digits.slice(-6)}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = {
      name: name.trim(),
      barcode: barcode.trim(),
      sku: sku.trim().toUpperCase(),
      category,
      price: Math.max(0, parseFloat(price) || 0),
      stock: Math.max(0, parseInt(stock, 10) || 0),
      discount: Math.max(0, parseFloat(discount) || 0),
      unit: unit.trim(),
      image: image.trim(),
      description: description.trim(),
    };

    try {
      const res = await productsAPI.create(payload);
      setCreatedProduct(res.data);
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to save product to MongoDB.';
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <Link
            to="/admin/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Products Hub
          </Link>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Register New Product & Barcode
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Define product specifications, assign a unique normalized barcode, and store in MongoDB
          </p>
        </div>
      </div>

      {createdProduct ? (
        /* Success Screen with Immediate Test-Scan Action */
        <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
              Stored In MongoDB Atlas
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white pt-2">
              "{createdProduct.name}" Successfully Registered!
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              This barcode is now active across all customer self-checkout scanners.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 max-w-sm mx-auto space-y-2">
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
              Scannable Barcode: <span className="font-mono text-blue-600">{createdProduct.barcode}</span>
            </p>
            <BarcodeVisual barcode={createdProduct.barcode} height={44} />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to={`/scanner?barcode=${encodeURIComponent(createdProduct.barcode)}`}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
            >
              <Scan className="w-4 h-4" />
              <span>Test Scan This Barcode Now (Customer View)</span>
            </Link>

            <button
              onClick={() => {
                setCreatedProduct(null);
                setName('');
                setBarcode('');
                setSku('');
                setPrice('');
                setDescription('');
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Add Another Product
            </button>
          </div>
        </div>
      ) : (
        /* Add Product Form */
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          
          {/* Main Info Column (8 cols) */}
          <div className="md:col-span-8 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-400 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Product Title / Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Amul Pure Ghee 1L Tin"
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Barcode & SKU Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Unique Barcode (EAN-13) *
                  </label>
                  <button
                    type="button"
                    onClick={generateRandomEAN13}
                    className="text-[11px] font-bold text-blue-600 hover:underline"
                  >
                    Auto Generate
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  placeholder="e.g. 8901030383794"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  SKU Identifier *
                </label>
                <input
                  type="text"
                  required
                  value={sku}
                  onChange={(e) => setSku(e.target.value)}
                  placeholder="e.g. DE-AMUL-GHEE-01"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono uppercase text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Category & Unit */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Supermarket Aisle Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-hidden"
                >
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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Packaging Unit Specification
                </label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="e.g. 500g Pouch, 1 Litre, Pack of 6"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            {/* Price, Stock, Discount */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="249.00"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Initial Stock Units *
                </label>
                <input
                  type="number"
                  required
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  placeholder="50"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Discount (%)
                </label>
                <input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                  placeholder="0"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Image URL (Unsplash or CDN)
              </label>
              <input
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Product Description
              </label>
              <textarea
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe nutritional details, origin, or key features..."
                className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              <span>{submitting ? 'Registering in MongoDB...' : 'Save Product to Supermarket Database'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </div>

          {/* Real-Time Preview Column (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 text-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Live Barcode & Card Preview
              </span>

              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img
                  src={image}
                  alt="Preview"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {name || 'Product Title'}
                </p>
                <p className="text-xs text-slate-500">
                  {category} • {unit}
                </p>
                <p className="text-base font-black text-blue-600 dark:text-cyan-400 mt-1">
                  ₹{price || '0.00'}
                </p>
              </div>

              {/* Barcode visual preview */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <BarcodeVisual barcode={barcode || '8901030383794'} height={40} className="w-full" />
              </div>
            </div>
          </div>

        </form>
      )}

    </div>
  );
};

export default AdminAddProduct;
