import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft,
  ShieldCheck, Sparkles, Tag, AlertCircle, Scan
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import StatusBadge from '../components/common/StatusBadge';
import BarcodeVisual from '../components/common/BarcodeVisual';

export const ShoppingCartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const { t } = useThemeLanguage();
  const navigate = useNavigate();

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const discountTotal = cart?.discount_total || 0;
  const tax = cart?.tax || 0;
  const total = cart?.total || 0;

  const hasOutOfStockItems = items.some(i => !i.is_available);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {t('nav_cart')}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Review your scanned items before proceeding to instant payment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/scanner"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-cyan-400 font-bold text-xs uppercase tracking-wider hover:bg-blue-100 transition-colors"
            >
              <Scan className="w-4 h-4" />
              <span>Scan More Items</span>
            </Link>

            {items.length > 0 && (
              <button
                onClick={clearCart}
                className="px-3 py-2 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-xl mx-auto space-y-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 mx-auto flex items-center justify-center">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {t('cart_empty_title')}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                {t('cart_empty_sub')}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <Link
                to="/scanner"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-all"
              >
                <Scan className="w-4 h-4" />
                <span>{t('btn_scan_now')}</span>
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs uppercase tracking-wider transition-colors"
              >
                Browse Catalog
              </Link>
            </div>
          </motion.div>
        ) : (
          /* Cart Items and Sticky Order Summary Layout */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Items Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.product_id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-100 dark:border-slate-800 shrink-0 bg-slate-50"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                            {item.category}
                          </span>
                          <StatusBadge status={item.stock_status} stock={item.stock} size="xs" />
                        </div>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                          {item.name}
                        </h3>
                        <p className="text-xs text-slate-500 font-mono">
                          Barcode: {item.barcode}
                        </p>
                        <div className="flex items-baseline gap-2 pt-0.5">
                          <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                            ₹{item.final_unit_price}
                          </span>
                          {item.discount_percent > 0 && (
                            <span className="text-xs text-slate-400 line-through">
                              ₹{item.unit_price}
                            </span>
                          )}
                          <span className="text-[11px] text-slate-400">/ {item.unit || 'unit'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity controls and item total */}
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                      <div className="text-right">
                        <p className="font-black text-base text-blue-600 dark:text-cyan-400">
                          ₹{item.total_price.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold text-slate-900 dark:text-white">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="w-6 h-6 rounded-md bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-300 disabled:opacity-40 hover:bg-slate-50"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product_id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Barcode scanner quick link */}
              <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Scan className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                  <div>
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      Want to add more grocery items?
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Scan physical barcodes directly with your phone camera
                    </p>
                  </div>
                </div>
                <Link
                  to="/scanner"
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
                >
                  Open Scanner
                </Link>
              </div>
            </div>

            {/* Sticky Order Summary Column (5 cols) */}
            <div className="lg:col-span-5 sticky top-24">
              <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Order Summary
                  </h2>
                  <p className="text-xs text-slate-500">Express Self-Checkout Store #104</p>
                </div>

                {/* Calculation Rows */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Subtotal ({cart.item_count} items)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                      <span>Total Savings & Discounts</span>
                      <span>-₹{discountTotal.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Applicable GST (5% Supermarket Tax)</span>
                    <span className="font-semibold text-slate-900 dark:text-white">
                      ₹{tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">
                        Final Payable Amount
                      </p>
                      <p className="text-[10px] text-slate-400">Includes all taxes and fees</p>
                    </div>
                    <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Out of Stock Warning */}
                {hasOutOfStockItems && (
                  <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-400 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>Some items are out of stock. Please remove them before checkout.</span>
                  </div>
                )}

                {/* Checkout CTA */}
                <button
                  onClick={() => navigate('/checkout')}
                  disabled={hasOutOfStockItems || items.length === 0}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <span>{t('btn_checkout')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Trust Seals */}
                <div className="pt-2 text-center space-y-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                  <p className="flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Instant UPI & Razorpay 256-bit Secure Verification</span>
                  </p>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ShoppingCartPage;
