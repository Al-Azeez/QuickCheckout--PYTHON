import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, AlertTriangle, XCircle, ShoppingBag,
  Plus, Minus, X, ArrowRight, ShieldCheck, Tag
} from 'lucide-react';
import BarcodeVisual from '../common/BarcodeVisual';
import StatusBadge from '../common/StatusBadge';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const ProductDetectionModal = ({ product, isOpen, onClose, onAdded }) => {
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  if (!isOpen || !product) return null;

  const stock = product.stock ?? 0;
  const isAvailable = stock > 0;
  const price = product.price || 0;
  const discount = product.discount || 0;
  const finalUnitPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
  const totalItemPrice = finalUnitPrice * quantity;

  const handleAddToCart = async () => {
    if (!isAvailable || adding) return;
    setAdding(true);

    const res = await addToCart(product, quantity);
    setAdding(false);

    if (res.success) {
      setAddedSuccess(true);
      if (onAdded) onAdded(product, quantity);
      setTimeout(() => {
        setAddedSuccess(false);
        onClose();
      }, 1600);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.4 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Header pill */}
          <div className="flex items-center justify-between px-6 pt-5 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Exact Barcode Match Verified
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 pt-2 space-y-5">
            {/* Product visual banner */}
            <div className="relative flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <div className="relative w-32 h-32 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-white shrink-0 shadow-sm border border-slate-200/80 dark:border-slate-700">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                {discount > 0 && (
                  <span className="absolute top-1.5 left-1.5 bg-rose-500 text-white font-extrabold text-[10px] px-1.5 py-0.5 rounded-md shadow-xs">
                    {discount}% OFF
                  </span>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md">
                    {product.category}
                  </span>
                  <StatusBadge status={product.status} stock={product.stock} />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {product.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {product.unit || 'Standard Pack'} • SKU: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{product.sku}</span>
                </p>
              </div>
            </div>

            {/* Price and Barcode display */}
            <div className="grid grid-cols-2 gap-3 items-center">
              <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                <p className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                  Store Price
                </p>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    ₹{finalUnitPrice}
                  </span>
                  {discount > 0 && (
                    <span className="text-xs text-slate-400 line-through">
                      ₹{price}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <BarcodeVisual barcode={product.barcode} height={40} className="w-full scale-95" />
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50/70 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                {product.description}
              </p>
            )}

            {/* Quantity Selector & Action Button */}
            {isAvailable ? (
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 ml-2">
                    Select Quantity:
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 disabled:opacity-40 shadow-xs hover:bg-slate-50 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-bold text-sm text-slate-900 dark:text-white min-w-5 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(stock, q + 1))}
                      disabled={quantity >= stock}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 disabled:opacity-40 shadow-xs hover:bg-slate-50 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={adding || addedSuccess}
                  className={`w-full py-3.5 px-6 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    addedSuccess
                      ? 'bg-emerald-600 text-white shadow-emerald-500/25'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.99]'
                  }`}
                >
                  {addedSuccess ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 animate-bounce" />
                      <span>Added to Cart! (₹{totalItemPrice})</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>{adding ? 'Adding Item...' : `ADD TO CART • ₹${totalItemPrice}`}</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center space-y-1">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-400">
                  Item Currently Out of Stock
                </p>
                <p className="text-xs text-rose-600/80 dark:text-rose-400/80">
                  This product cannot be added to your cart right now. Supermarket team has been notified for shelf restocking.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductDetectionModal;
