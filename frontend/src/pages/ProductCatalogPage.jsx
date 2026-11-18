import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Filter, Grid, List, Plus, ShoppingBag, Heart,
  Sparkles, ArrowRight, Scan, Check
} from 'lucide-react';
import { productsAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import BarcodeVisual from '../components/common/BarcodeVisual';
import { useCart } from '../context/CartContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export const ProductCatalogPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [favorites, setFavorites] = useState({});

  const { addToCart } = useCart();
  const { t } = useThemeLanguage();

  const categories = [
    'All',
    'Fruits & Vegetables',
    'Dairy & Eggs',
    'Snacks',
    'Beverages',
    'Bakery',
    'Household',
    'Personal Care',
    'Groceries'
  ];

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, availabilityFilter, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        category: selectedCategory,
        availability: availabilityFilter,
        sort: sortBy,
      };
      const res = await productsAPI.getAll(params);
      setProducts(res.data);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (id) => {
    setFavorites(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.barcode.includes(search) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header & Hero Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2.5 py-1 rounded-md">
                Verified Supermarket Inventory
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              Supermarket Product Catalog
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Browse authentic Indian grocery items with real-time stock sync and barcodes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 transition-all"
            >
              <Scan className="w-4 h-4" />
              <span>{t('btn_scan_now')}</span>
            </Link>
          </div>
        </div>

        {/* Filter and Search Bar Toolbar */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            
            {/* Search input (6 cols) */}
            <div className="md:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products by name, SKU, or 13-digit barcode..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:border-blue-500"
              />
            </div>

            {/* Availability Filter (3 cols) */}
            <div className="md:col-span-3">
              <select
                value={availabilityFilter}
                onChange={(e) => setAvailabilityFilter(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="">All Stock Levels</option>
                <option value="in_stock">In Stock Only</option>
                <option value="low_stock">Low Stock (≤5 left)</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>

            {/* Sort and View switch (3 cols) */}
            <div className="md:col-span-3 flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-hidden"
              >
                <option value="name_asc">Sort: A to Z</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="stock_low">Stock: Lowest First</option>
              </select>

              <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="Grid View"
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-blue-600 shadow-xs' : 'text-slate-500'
                  }`}
                  title="List View"
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>

          {/* Category Tabs Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        {/* Product Grid / List Display */}
        {loading ? (
          <div className="py-24 text-center text-xs font-semibold text-slate-500">
            Refreshing supermarket products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching products found
            </h3>
            <p className="text-xs text-slate-500">Try modifying your search or filter keywords.</p>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const isFav = !!favorites[p.id || p._id];
              const isAvailable = p.stock > 0;
              const discount = p.discount || 0;
              const finalPrice = discount > 0 ? Math.round(p.price * (1 - discount / 100)) : p.price;

              return (
                <div
                  key={p.id || p._id}
                  className="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-500/50 dark:hover:border-blue-500/50 transition-all flex flex-col justify-between overflow-hidden"
                >
                  <div className="relative aspect-4/3 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Discount badge */}
                    {discount > 0 && (
                      <span className="absolute top-3 left-3 bg-rose-500 text-white font-extrabold text-[11px] px-2 py-0.5 rounded-lg shadow-sm">
                        {discount}% OFF
                      </span>
                    )}

                    {/* Wishlist favorite button */}
                    <button
                      onClick={() => toggleFavorite(p.id || p._id)}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 transition-colors shadow-xs"
                    >
                      <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        <StatusBadge status={p.status} stock={p.stock} size="xs" />
                      </div>

                      <Link
                        to={`/products/${p.id || p._id}`}
                        className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2 hover:text-blue-600 transition-colors"
                      >
                        {p.name}
                      </Link>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                        Barcode: {p.barcode}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-black text-slate-900 dark:text-white">
                            ₹{finalPrice}
                          </span>
                          {discount > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{p.price}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">{p.unit || '1 unit'}</span>
                      </div>

                      <button
                        onClick={() => addToCart(p, 1)}
                        disabled={!isAvailable}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs ${
                          isAvailable
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 active:scale-95'
                            : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isAvailable ? 'Add' : 'Out'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="space-y-3">
            {filteredProducts.map((p) => {
              const isAvailable = p.stock > 0;
              const discount = p.discount || 0;
              const finalPrice = discount > 0 ? Math.round(p.price * (1 - discount / 100)) : p.price;

              return (
                <div
                  key={p.id || p._id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-20 h-20 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                          {p.category}
                        </span>
                        <StatusBadge status={p.status} stock={p.stock} size="xs" />
                      </div>
                      <Link
                        to={`/products/${p.id || p._id}`}
                        className="font-bold text-sm text-slate-900 dark:text-white hover:text-blue-600"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-slate-500 font-mono">
                        Barcode: {p.barcode} • SKU: {p.sku}
                      </p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3">
                    <div className="text-right">
                      <span className="text-lg font-black text-slate-900 dark:text-white">
                        ₹{finalPrice}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart(p, 1)}
                      disabled={!isAvailable}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAvailable ? 'Add To Cart' : 'Out of Stock'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductCatalogPage;
