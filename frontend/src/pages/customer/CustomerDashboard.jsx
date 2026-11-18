import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Scan, ShoppingBag, ArrowRight, Sparkles, TrendingUp,
  Tag, Clock, CheckCircle2, ChevronRight, User, Heart, Search,
  Award, PackageCheck, Zap, ShieldCheck, Flame, Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';
import { productsAPI, ordersAPI } from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const { cart, itemCount, total, addToCart } = useCart();
  const { t } = useThemeLanguage();
  const navigate = useNavigate();

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active customer name
  const customerDisplayName = user?.name ? user.name.split(' ')[0] : 'Abdul';

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [prodRes, catRes, orderRes] = await Promise.all([
          productsAPI.getAll({ sort: 'price_high' }),
          productsAPI.getCategories(),
          ordersAPI.getAll()
        ]);
        setFeaturedProducts(prodRes.data.slice(0, 4));
        setCategories(catRes.data);
        setRecentOrders(orderRes.data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load customer dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-qc-canvas py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Futuristic Retail-Tech Hero Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#1241ae] via-[#2563EB] to-[#06B6D4] p-6 sm:p-10 text-white shadow-2xl overflow-hidden border border-white/20">
          
          {/* Ambient lighting glows */}
          <div className="absolute -right-12 -top-12 w-80 h-80 bg-cyan-300/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -bottom-12 w-72 h-72 bg-blue-900/40 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-2xl">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/25 text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <Sparkles className="w-3.5 h-3.5 text-cyan-200" />
                <span>Smart In-Store Shopper Hub</span>
              </div>

              {/* Updated Greeting: Good Morning, Abdul! */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-sm">
                Good Morning, <span className="text-cyan-200">{customerDisplayName}!</span> Ready to shop?
              </h1>

              <p className="text-xs sm:text-sm text-blue-50 leading-relaxed font-normal max-w-xl">
                Scan product barcodes with your camera as you stroll through the aisles. Instant price lookups, live cart discounts, and seamless 10-second checkout.
              </p>

              {/* Quick Feature Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-blue-100">
                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                  ⚡ 0 Queue Wait
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                  📱 Mobile Barcode Laser
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-xs border border-white/15">
                  🧾 Instant Digital Invoice
                </span>
              </div>
            </div>

            {/* Prominent Action Buttons */}
            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                to="/scanner"
                className="group px-7 py-4 rounded-2xl bg-white text-blue-700 font-black text-xs uppercase tracking-wider shadow-xl shadow-blue-950/30 hover:bg-blue-50 hover:shadow-cyan-400/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2.5"
              >
                <div className="p-1.5 rounded-lg bg-blue-600 text-white group-hover:scale-110 transition-transform">
                  <Scan className="w-4 h-4" />
                </div>
                <span>{t('btn_scan_now')}</span>
              </Link>

              <Link
                to="/products"
                className="px-6 py-4 rounded-2xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                <span>Browse Catalog</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Shopper Stats Bar (Fintech-grade Card Grid) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Active Cart */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-400 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Cart</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                ₹{total.toFixed(2)}
              </p>
              <Link to="/cart" className="text-xs text-blue-600 dark:text-cyan-400 font-bold hover:underline inline-flex items-center gap-1">
                <span>{itemCount} items ready</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-cyan-400 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>

          {/* Queue Time Saved */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Queue Time Saved</p>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                18 mins
              </p>
              <p className="text-xs text-slate-500 font-medium">Zero wait at cash desk</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
          </div>

          {/* QuickClub Points */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-purple-400 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">QuickClub Rewards</p>
              <p className="text-2xl font-black text-purple-600 dark:text-purple-400">
                420 pts
              </p>
              <p className="text-xs text-slate-500 font-medium">Worth ₹84 cashback</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>

          {/* Past Trips */}
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-400 transition-all flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Past Checkouts</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                {recentOrders.length + 8} Trips
              </p>
              <p className="text-xs text-slate-500 font-medium">All receipts archived</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <PackageCheck className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* Supermarket Categories Shelf */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Supermarket Aisle Categories
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Explore aisles to scan items directly in store
              </p>
            </div>
            <Link to="/products" className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
              <span>View All Aisles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((c) => (
              <Link
                key={c.id}
                to={`/products?category=${encodeURIComponent(c.id)}`}
                className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500 dark:hover:border-cyan-400 shadow-xs hover:shadow-md transition-all text-center space-y-1.5 group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-cyan-400 mx-auto flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs">
                  <Tag className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                  {c.name}
                </p>
                <p className="text-[10px] font-semibold text-slate-500">
                  {c.count} items
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Featured Store Picks Today */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white">
                Featured Store Picks Today
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Popular items frequently picked by express shoppers</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline flex items-center gap-1">
              <span>Explore All Products</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => (
              <div
                key={p.id || p._id}
                className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-3"
              >
                <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-40 object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {p.discount > 0 && (
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {p.discount}% OFF
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold text-blue-600 dark:text-cyan-400">{p.category}</span>
                    <StatusBadge status={p.status} stock={p.stock} size="xs" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-2">
                    <p className="text-base font-black text-slate-900 dark:text-white">
                      ₹{p.price}
                    </p>
                    {p.discount > 0 && (
                      <p className="text-xs text-slate-400 line-through">
                        ₹{(p.price * (1 + p.discount / 100)).toFixed(0)}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => addToCart(p, 1)}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md shadow-blue-600/20 transition-all"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add To Cart</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Purchases & Orders Section */}
        {recentOrders.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">
                  Recent Shopping Trips
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Instant digital receipts with QR exit gate codes
                </p>
              </div>
              <Link to="/orders" className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline">
                View All Receipts
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentOrders.map((ord) => (
                <div
                  key={ord.id || ord.order_id}
                  className="p-5 rounded-2xl bg-white/85 dark:bg-slate-900/85 backdrop-blur-md border border-[#c1d3fe] dark:border-slate-800 shadow-xs space-y-3"
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{ord.order_id}</span>
                    <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      {ord.payment_status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {ord.items?.length || 0} items • ₹{ord.total_amount?.toFixed(2)}
                  </p>

                  <Link
                    to={`/receipt/${ord.order_id || ord.id}`}
                    className="block text-center py-2.5 rounded-xl bg-[#edf2fb] hover:bg-[#e2eafc] dark:bg-slate-800 dark:hover:bg-slate-700 text-blue-700 dark:text-cyan-300 font-bold text-xs transition-colors border border-[#d7e3fc] dark:border-slate-700"
                  >
                    View Digital Invoice & QR Pass
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CustomerDashboard;
