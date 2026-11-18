import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, ShoppingBag, Plus, Minus, ShieldCheck,
  CheckCircle2, AlertTriangle, XCircle, Tag, Truck, RefreshCw, Scan
} from 'lucide-react';
import { productsAPI } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import BarcodeVisual from '../components/common/BarcodeVisual';
import { useCart } from '../context/CartContext';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await productsAPI.getById(id);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-semibold text-slate-500">Loading product information...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <p className="text-base font-bold text-slate-800">Product Not Found</p>
          <Link to="/products" className="text-xs text-blue-600 font-semibold underline">
            Return to Supermarket Catalog
          </Link>
        </div>
      </div>
    );
  }

  const isAvailable = (product.stock || 0) > 0;
  const price = product.price || 0;
  const discount = product.discount || 0;
  const finalUnitPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;
  const totalItemPrice = finalUnitPrice * quantity;

  const handleAdd = async () => {
    if (!isAvailable || adding) return;
    setAdding(true);
    await addToCart(product, quantity);
    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Back breadcrumb */}
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Products
        </Link>

        {/* Product Details Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left: Product Image & Barcode visual (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {discount > 0 && (
                <span className="absolute top-4 left-4 bg-rose-500 text-white font-extrabold text-xs px-3 py-1 rounded-xl shadow-md">
                  {discount}% DISCOUNT
                </span>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-center space-y-2">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Scannable Supermarket EAN-13 Barcode
              </p>
              <BarcodeVisual barcode={product.barcode} height={46} className="w-full" />
            </div>
          </div>

          {/* Right: Info & Cart Addition (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-lg">
                  {product.category}
                </span>
                <StatusBadge status={product.status} stock={product.stock} />
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">
                {product.name}
              </h1>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Packaging Unit: <span className="font-semibold text-slate-700 dark:text-slate-300">{product.unit || 'Standard Pack'}</span> • SKU: <span className="font-mono text-slate-700 dark:text-slate-300 font-semibold">{product.sku}</span>
              </p>
            </div>

            {/* Price section */}
            <div className="p-4 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                ₹{finalUnitPrice}
              </span>
              {discount > 0 && (
                <span className="text-base text-slate-400 line-through">
                  ₹{price}
                </span>
              )}
              <span className="text-xs text-slate-500 font-medium">
                (Inclusive of all supermarket retail taxes)
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Product Details & Composition
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {product.description || 'Authentic supermarket packaged product.'}
              </p>
            </div>

            {/* Quantity Stepper & Add to Cart */}
            {isAvailable ? (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Quantity:
                  </span>
                  <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      disabled={quantity <= 1}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 disabled:opacity-40"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-900 dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                      disabled={quantity >= product.stock}
                      className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 disabled:opacity-40"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    ({product.stock} units currently on store shelf)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={handleAdd}
                    disabled={adding}
                    className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{adding ? 'Adding...' : `ADD TO CART • ₹${totalItemPrice}`}</span>
                  </button>

                  <button
                    onClick={() => navigate('/scanner')}
                    className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                  >
                    <Scan className="w-4 h-4" />
                    <span>Scan Another</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center">
                <p className="text-sm font-bold text-rose-700 dark:text-rose-400">
                  Currently Out of Stock
                </p>
                <p className="text-xs text-rose-600/80 mt-1">
                  This item cannot be purchased at the moment.
                </p>
              </div>
            )}

            {/* Store reassurance note */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>100% Genuine retail packaged product with verified EAN barcode</span>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;
