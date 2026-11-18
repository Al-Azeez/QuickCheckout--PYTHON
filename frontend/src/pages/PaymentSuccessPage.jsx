import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import {
  CheckCircle2, FileText, ArrowRight, ShoppingBag,
  ShieldCheck, Sparkles, Download, Scan
} from 'lucide-react';
import { ordersAPI } from '../services/api';
import BarcodeVisual from '../components/common/BarcodeVisual';

export const PaymentSuccessPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // ignore
    }

    const fetchOrder = async () => {
      try {
        const res = await ordersAPI.getById(orderId);
        setOrder(res.data);
      } catch (e) {
        console.error('Error fetching order:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 transition-colors flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-lg w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-center"
      >
        {/* Animated Success Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest bg-emerald-50 dark:bg-emerald-950/50 px-3 py-1 rounded-full">
            Payment Verified
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white pt-2">
            Payment Successful!
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Your shopping journey is complete. Thank you for using QuickCheckout!
          </p>
        </div>

        {/* Payment Confirmation Card */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-left space-y-3 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-slate-500">Order ID:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{order?.order_id || orderId}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Invoice Number:</span>
            <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{order?.invoice_number || 'QC-INV-2026'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Payment Reference:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{order?.payment_id || 'pay_upi_verified'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-slate-500">Payment Method:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">{order?.payment_method || 'UPI (Dynamic QR)'}</span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-baseline">
            <span className="font-bold text-slate-700 dark:text-slate-300">Total Paid:</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">
              ₹{order?.total_amount?.toFixed(2) || '0.00'}
            </span>
          </div>
        </div>

        {/* Store Exit Gate Pass Barcode */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30">
          <p className="text-[11px] font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider">
            Store Exit Gate Pass
          </p>
          <p className="text-[10px] text-slate-500">
            Show this barcode at the smart security barrier to exit
          </p>
          <BarcodeVisual barcode={order?.order_id?.replace(/\D/g, '') || '2026111791823'} height={36} className="scale-95" />
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <Link
            to={`/receipt/${orderId}`}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <FileText className="w-4 h-4" />
            <span>View & Download Digital Receipt</span>
          </Link>

          <Link
            to="/products"
            className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        <div className="text-[11px] text-slate-400 font-semibold tracking-wider">
          SHOP. SCAN. PAY. GO.
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccessPage;
