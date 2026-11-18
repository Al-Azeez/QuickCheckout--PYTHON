import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CreditCard, QrCode, Smartphone, ShieldCheck, ArrowRight,
  ShoppingBag, CheckCircle2, User, Phone, Mail, ShoppingBasket
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ordersAPI } from '../services/api';

export const CheckoutPage = () => {
  const { cart, total } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState(user?.name || 'Abdul Khan');
  const [customerEmail, setCustomerEmail] = useState(user?.email || 'abdul@quickcheckout.in');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '+91 98765 43210');
  const [paymentMethod, setPaymentMethod] = useState('UPI_QR');
  const [bagOption, setBagOption] = useState('own'); // 'own' or 'paper'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bagFee = bagOption === 'paper' ? 10.0 : 0.0;
  const payableAmount = total + bagFee;

  const handleProceedToPayment = async (e) => {
    e.preventDefault();
    if (!cart?.items || cart.items.length === 0) {
      navigate('/cart');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const orderPayload = {
        customer_name: customerName,
        customer_email: customerEmail,
        customer_phone: customerPhone,
        payment_method: paymentMethod,
        bag_option: bagOption,
        bag_fee: bagFee,
      };

      const res = await ordersAPI.create(orderPayload);
      const createdOrder = res.data;
      // Navigate to Payment QR / Payment page with order ID
      navigate(`/payment/qr/${createdOrder.order_id || createdOrder.id}`);
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to initialize order checkout.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Express Self-Checkout
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Confirm your details and choose your preferred payment method
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleProceedToPayment} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details & Payment Methods (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Customer Details Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Customer Contact Details
              </h2>
              <p className="text-xs text-slate-500">
                Your digital invoice and store exit gate pass will be sent here.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Mobile Number (WhatsApp Receipt)
                    </label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Carry Bag Preference */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <ShoppingBasket className="w-4 h-4 text-blue-600" />
                Carry Bag Option
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <label className={`cursor-pointer p-3.5 rounded-2xl border text-left transition-all ${
                  bagOption === 'own'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}>
                  <input
                    type="radio"
                    name="bagOption"
                    checked={bagOption === 'own'}
                    onChange={() => setBagOption('own')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">I Have My Own Bag</span>
                    {bagOption === 'own' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">Zero extra charge (₹0)</p>
                </label>

                <label className={`cursor-pointer p-3.5 rounded-2xl border text-left transition-all ${
                  bagOption === 'paper'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40'
                }`}>
                  <input
                    type="radio"
                    name="bagOption"
                    checked={bagOption === 'paper'}
                    onChange={() => setBagOption('paper')}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Supermarket Eco Bag</span>
                    {bagOption === 'paper' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">+₹10.00 recycled kraft</p>
                </label>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Select Payment Mode
              </h2>

              <div className="space-y-2.5">
                {/* Option 1: UPI QR */}
                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'UPI_QR'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'UPI_QR'}
                      onChange={() => setPaymentMethod('UPI_QR')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">
                      <QrCode className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Scan & Pay via UPI QR (Recommended)
                      </p>
                      <p className="text-[11px] text-slate-500">
                        GPay, PhonePe, Paytm, CRED, any UPI app
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                    Zero Fee
                  </span>
                </label>

                {/* Option 2: Razorpay Cards / NetBanking */}
                <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'RAZORPAY_CARD'
                    ? 'border-blue-600 bg-blue-50/60 dark:bg-blue-950/40 shadow-xs'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'RAZORPAY_CARD'}
                      onChange={() => setPaymentMethod('RAZORPAY_CARD')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        Credit / Debit Card or NetBanking
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Visa, Mastercard, RuPay, Corporate Cards
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-700 dark:text-rose-400">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Checkout Items ({cart?.item_count || 0})
              </h3>

              {/* Items mini list */}
              <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 pr-1 space-y-2">
                {cart?.items?.map((item) => (
                  <div key={item.product_id} className="pt-2 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[10px]">
                        {item.quantity}×
                      </span>
                      <span className="truncate text-slate-800 dark:text-slate-200 font-medium">
                        {item.name}
                      </span>
                    </div>
                    <span className="font-bold text-slate-900 dark:text-white shrink-0">
                      ₹{item.total_price.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Cart Subtotal</span>
                  <span>₹{cart?.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                {cart?.discount_total > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount Savings</span>
                    <span>-₹{cart?.discount_total?.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Supermarket GST (5%)</span>
                  <span>₹{cart?.tax?.toFixed(2) || '0.00'}</span>
                </div>
                {bagFee > 0 && (
                  <div className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span>Eco Carry Bag</span>
                    <span>₹{bagFee.toFixed(2)}</span>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-baseline">
                  <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                    Total Payable
                  </span>
                  <span className="font-black text-2xl text-blue-600 dark:text-cyan-400">
                    ₹{payableAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !cart?.items?.length}
                className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
              >
                <span>{loading ? 'Initializing Payment...' : 'PROCEED TO PAYMENT'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CheckoutPage;
