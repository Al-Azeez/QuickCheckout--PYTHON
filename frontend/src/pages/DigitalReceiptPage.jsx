import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Printer, Download, ArrowLeft, CheckCircle2, ShieldCheck,
  Store, Calendar, CreditCard, Sparkles, ShoppingBag
} from 'lucide-react';
import { ordersAPI } from '../services/api';
import BarcodeVisual from '../components/common/BarcodeVisual';
import { useThemeLanguage } from '../context/ThemeLanguageContext';

export const DigitalReceiptPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t } = useThemeLanguage();

  useEffect(() => {
    const fetchReceipt = async () => {
      try {
        const res = await ordersAPI.getById(orderId);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load receipt:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReceipt();
  }, [orderId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <p className="text-sm font-semibold text-slate-500">Loading Digital Tax Receipt...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <p className="text-base font-bold text-slate-800">Receipt Not Found</p>
          <Link to="/orders" className="text-xs text-blue-600 font-semibold underline">
            Return to Order History
          </Link>
        </div>
      </div>
    );
  }

  const items = order.items || [];
  const storeInfo = order.store_info || {
    store_name: 'QUICKCHECKOUT SMART SUPERMARKET',
    branch: 'Express Store #104, Indiranagar',
    gstin: '29AABCS1429B1Z5',
    address: '100ft Road, Indiranagar, Bengaluru, KA 560038',
    helpline: '1800-QUICK-PAY'
  };

  const createdDate = order.created_at
    ? new Date(order.created_at).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
      })
    : '17 Nov 2026, 06:30 AM';

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 py-10 px-4 sm:px-6 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Actions bar (hidden in print) */}
        <div className="no-print flex items-center justify-between gap-4">
          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Orders
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Print Tax Invoice</span>
            </button>
          </div>
        </div>

        {/* Printable Supermarket Invoice Paper Card */}
        <div
          id="printable-receipt"
          className="bg-white text-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200 font-sans space-y-6"
        >
          {/* Supermarket Header */}
          <div className="text-center space-y-1.5 border-b border-dashed border-slate-300 pb-6">
            <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-[11px] font-bold text-blue-700 uppercase tracking-widest">
              <span>{storeInfo.store_name}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
              {t('receipt_title')}
            </h1>
            <p className="text-xs text-slate-600">{storeInfo.branch}</p>
            <p className="text-[11px] text-slate-500">{storeInfo.address}</p>
            <div className="flex items-center justify-center gap-4 text-[11px] font-mono font-semibold text-slate-700 pt-1">
              <span>GSTIN: {storeInfo.gstin}</span> • <span>POS KIOSK #04</span>
            </div>
          </div>

          {/* Invoice Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs py-1 border-b border-dashed border-slate-200">
            <div className="space-y-1">
              <p><span className="text-slate-500">Invoice No:</span> <strong className="font-mono">{order.invoice_number || 'QC-INV-2026'}</strong></p>
              <p><span className="text-slate-500">Order ID:</span> <strong className="font-mono">{order.order_id}</strong></p>
              <p><span className="text-slate-500">Date/Time:</span> {createdDate}</p>
            </div>
            <div className="text-right space-y-1">
              <p><span className="text-slate-500">Customer:</span> <strong>{order.customer?.name || 'Walk-in Shopper'}</strong></p>
              <p><span className="text-slate-500">Phone:</span> {order.customer?.phone || 'N/A'}</p>
              <p>
                <span className="text-slate-500">Payment:</span>{' '}
                <span className="inline-block px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  {order.payment_status || 'PAID'} • {order.payment_method || 'UPI'}
                </span>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-300 font-bold text-slate-500 text-[11px] uppercase tracking-wider">
                  <th className="pb-2">Item Description</th>
                  <th className="pb-2 text-center">Qty</th>
                  <th className="pb-2 text-right">Rate</th>
                  <th className="pb-2 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {items.map((item, idx) => (
                  <tr key={idx} className="py-2">
                    <td className="py-2.5">
                      <p className="font-bold text-slate-900 leading-tight">{item.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">Barcode: {item.barcode}</p>
                    </td>
                    <td className="py-2.5 text-center font-bold text-slate-700">{item.quantity}</td>
                    <td className="py-2.5 text-right font-mono text-slate-600">₹{item.final_unit_price}</td>
                    <td className="py-2.5 text-right font-bold text-slate-900 font-mono">
                      ₹{item.total_price ? item.total_price.toFixed(2) : (item.final_unit_price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="pt-3 border-t-2 border-slate-900 space-y-1.5 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Gross Total ({order.items?.length || 0} items)</span>
              <span className="font-mono">₹{order.subtotal?.toFixed(2) || '0.00'}</span>
            </div>

            {order.discount_total > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Special Promo Discount</span>
                <span className="font-mono">-₹{order.discount_total?.toFixed(2)}</span>
              </div>
            )}

            <div className="flex justify-between text-slate-600">
              <span>CGST (2.5%)</span>
              <span className="font-mono">₹{((order.tax || 0) / 2).toFixed(2)}</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span>SGST (2.5%)</span>
              <span className="font-mono">₹{((order.tax || 0) / 2).toFixed(2)}</span>
            </div>

            <div className="pt-2 border-t border-dashed border-slate-300 flex justify-between items-baseline text-sm">
              <span className="font-black text-slate-950 uppercase tracking-wider">
                Net Payable Amount
              </span>
              <span className="font-mono font-black text-2xl text-blue-600">
                ₹{order.total_amount?.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Verification Barcode & Store Exit Pass */}
          <div className="pt-4 border-t border-dashed border-slate-300 text-center space-y-2">
            <p className="text-[11px] font-bold text-slate-700 uppercase tracking-widest">
              Digital Exit Pass Verified
            </p>
            <div className="flex justify-center">
              <BarcodeVisual barcode={order.order_id?.replace(/\D/g, '') || '8901030383794'} height={44} />
            </div>
            <p className="text-[10px] text-slate-400">
              Scan barcode at the automated turnstile to exit • Helpline: {storeInfo.helpline}
            </p>
            <p className="text-[10px] font-semibold text-slate-600 pt-1">
              {t('receipt_tagline')}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default DigitalReceiptPage;
