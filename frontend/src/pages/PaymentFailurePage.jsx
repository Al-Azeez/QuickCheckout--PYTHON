import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ShoppingBag, HelpCircle, ArrowLeft } from 'lucide-react';

export const PaymentFailurePage = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 transition-colors flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 text-center"
      >
        <div className="mx-auto w-20 h-20 rounded-full bg-rose-100 dark:bg-rose-950/60 flex items-center justify-center text-rose-600 dark:text-rose-400 shadow-lg shadow-rose-500/20">
          <XCircle className="w-12 h-12" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 dark:bg-rose-950/50 px-3 py-1 rounded-full">
            Payment Not Completed
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white pt-2">
            Payment Unsuccessful
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            The transaction could not be verified by the banking network or was canceled by user. Your items are still safely saved in your cart.
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Common solutions:</p>
          <ul className="list-disc pl-4 space-y-1 text-slate-500 text-[11px]">
            <li>Ensure sufficient balance or active UPI PIN.</li>
            <li>Retry scanning the QR with your UPI app.</li>
            <li>Switch to Card or NetBanking.</li>
          </ul>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            to={`/payment/qr/${orderId}`}
            className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Payment</span>
          </Link>

          <Link
            to="/cart"
            className="w-full py-3 px-6 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Shopping Cart</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentFailurePage;
