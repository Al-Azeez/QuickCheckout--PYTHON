import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Scan, ShoppingBag, Zap, CreditCard, ShieldCheck,
  Sparkles, ArrowRight, CheckCircle2, ChevronRight,
  Smartphone, Clock, Star, HelpCircle, UserCheck, Flame
} from 'lucide-react';
import BarcodeVisual from '../components/common/BarcodeVisual';
import { useThemeLanguage } from '../context/ThemeLanguageContext';
import { useAuth } from '../context/AuthContext';

export const LandingPage = () => {
  const { t } = useThemeLanguage();
  const { demoLogin } = useAuth();

  const stats = [
    { label: "Queue Wait Time", value: "0 sec", sub: "Skip traditional cash lines" },
    { label: "Barcode Match Accuracy", value: "99.98%", sub: "Instant MongoDB index lookup" },
    { label: "Happy Shoppers Served", value: "48,000+", sub: "Across Indiranagar flagship" },
    { label: "Shopper Satisfaction", value: "4.95 / 5", sub: "Google & App store reviews" },
  ];

  const features = [
    {
      icon: <Scan className="w-6 h-6 text-blue-500" />,
      title: "Real-Time Camera Barcode Scanner",
      desc: "Point your smartphone at any EAN-13 barcode to instantly retrieve product specs, pricing, and stock status."
    },
    {
      icon: <Zap className="w-6 h-6 text-cyan-500" />,
      title: "Atomic MongoDB Inventory Sync",
      desc: "Never risk overselling. Every scanned item and payment atomically decrements shelf stock with zero race conditions."
    },
    {
      icon: <CreditCard className="w-6 h-6 text-indigo-500" />,
      title: "Instant UPI QR & Razorpay",
      desc: "Scan dynamic UPI QR using GPay, PhonePe, Paytm, or swipe cards via Razorpay. Get digital voice confirmation."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: "Digital Tax Receipt & Gate Pass",
      desc: "Automatic GSTIN-compliant digital receipt with scannable turnstile barcode to pass store security effortlessly."
    }
  ];

  const steps = [
    {
      step: "01",
      title: "Shop & Pick Items",
      desc: "Walk freely through the supermarket aisles and pick your favorite groceries, snacks, and dairy products."
    },
    {
      step: "02",
      title: "Scan Barcode on Phone",
      desc: "Open QuickCheckout on your smartphone camera to scan product barcodes. Instantly see price & stock."
    },
    {
      step: "03",
      title: "Pay via UPI QR",
      desc: "Generate your secure dynamic UPI QR code or pay via Razorpay with 256-bit encryption."
    },
    {
      step: "04",
      title: "Scan Pass & Go!",
      desc: "Flash your digital exit gate pass barcode at the automated turnstile barrier and walk out in seconds!"
    }
  ];

  const faqs = [
    {
      q: "How does the barcode scanner recognize products?",
      a: "The scanner reads standard 13-digit EAN/UPC barcodes using your camera and queries MongoDB Atlas in milliseconds for exact product records."
    },
    {
      q: "What payment methods are supported?",
      a: "All Indian UPI apps (Google Pay, PhonePe, Paytm, CRED), credit/debit cards, and Razorpay payment options are fully supported."
    },
    {
      q: "How does the supermarket prevent theft at the exit?",
      a: "Upon verified payment, QuickCheckout generates a unique encrypted digital receipt and exit barcode that is validated by security turnstiles."
    },
    {
      q: "Can store administrators update prices and add new barcodes?",
      a: "Yes! The Admin Console allows real-time barcode creation, stock adjustment, and category management synced directly to the customer app."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white transition-colors overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Subtle decorative glow spheres */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-32 right-10 w-80 h-80 bg-cyan-500/10 dark:bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Pitch (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/80 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-cyan-300 text-xs font-bold tracking-wide shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>THE FUTURE OF RETAIL SELF-CHECKOUT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-slate-950 dark:text-white">
              Skip The Queue. <br />
              <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Enjoy The Checkout.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              A smarter way to shop. Scan your products, manage your cart, and pay securely without waiting in traditional checkout lines.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/scanner"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-blue-500/30 flex items-center justify-center gap-3 transition-all hover:-translate-y-0.5"
              >
                <Scan className="w-5 h-5" />
                <span>{t('btn_start_shopping')}</span>
              </Link>

              <a
                href="#how-it-works"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>{t('btn_explore')}</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>

            {/* Quick Demo Switcher Strip */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-500">
              <span className="font-semibold text-slate-700 dark:text-slate-300">Quick Demo Access:</span>
              <button
                onClick={() => demoLogin('customer')}
                className="px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold hover:bg-blue-100 transition-colors"
              >
                1-Click Customer Demo
              </button>
              <button
                onClick={() => demoLogin('admin')}
                className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold hover:bg-emerald-100 transition-colors"
              >
                1-Click Admin Demo
              </button>
            </div>

            {/* Trust highlights */}
            <div className="pt-2 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Real MongoDB Atlas
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> UPI & Razorpay Ready
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" /> EAN-13 Barcodes
              </span>
            </div>

          </div>

          {/* Right Hero Visual: 3D Smartphone & Floating Scanned Items (5 cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Visual Phone Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative w-72 sm:w-80 rounded-[40px] bg-slate-900 p-4 shadow-2xl border-4 border-slate-800 text-white"
            >
              {/* Phone speaker notch */}
              <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-4" />

              {/* Inside Phone Screen */}
              <div className="bg-slate-950 rounded-[28px] p-4 space-y-4 overflow-hidden border border-slate-800">
                
                {/* Header in phone */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="font-bold text-[10px] tracking-wider uppercase text-cyan-400">Scanner Viewfinder</span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400">100% BATTERY</span>
                </div>

                {/* Laser scan area */}
                <div className="relative aspect-4/3 rounded-2xl bg-slate-900 border border-blue-500/40 flex items-center justify-center overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400&auto=format&fit=crop&q=80"
                    alt="Scanned Milk"
                    className="w-full h-full object-cover opacity-70"
                  />
                  {/* Laser line */}
                  <div className="absolute inset-x-2 h-0.5 bg-cyan-400 shadow-[0_0_12px_#06B6D4] animate-laser" />
                  
                  {/* Corner marks */}
                  <div className="absolute inset-4 border border-cyan-400/60 rounded-lg pointer-events-none" />
                </div>

                {/* Detected Product Pill */}
                <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">Amul Gold Milk 1L</span>
                    <span className="font-black text-cyan-400">₹68.00</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>Barcode: 8901262010115</span>
                    <span className="text-emerald-400 font-bold">In Stock</span>
                  </div>
                </div>

                {/* Simulated Quick Checkout Button */}
                <Link
                  to="/scanner"
                  className="w-full py-2.5 rounded-xl bg-blue-600 text-center font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                >
                  <Scan className="w-3.5 h-3.5" />
                  <span>Tap to Scan Products</span>
                </Link>
              </div>

              {/* FLOATING CARD 1: Instant Match Badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-6 -left-8 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 text-xs font-bold"
              >
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">MongoDB Match</p>
                  <p>Exact EAN-13 Lookup</p>
                </div>
              </motion.div>

              {/* FLOATING CARD 2: UPI Soundbox Verified */}
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-6 -right-6 bg-white dark:bg-slate-800 text-slate-900 dark:text-white p-3 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2.5 text-xs font-bold"
              >
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Payment Confirmed</p>
                  <p>₹1,240.00 • UPI Soundbox</p>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>

      </section>

      {/* 2. STATS COUNTER STRIP */}
      <section className="border-y border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map((s, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-3xl sm:text-4xl font-black text-blue-600 dark:text-cyan-400 font-mono">
                {s.value}
              </p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{s.label}</p>
              <p className="text-xs text-slate-500">{s.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full">
            FOUR SIMPLE STEPS
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
            How QuickCheckout 2.0 Works
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Eliminate cash counter bottlenecks with autonomous mobile self-checkout.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm relative group hover:border-blue-500 transition-colors space-y-4"
            >
              <span className="text-3xl font-black text-blue-600/30 dark:text-cyan-400/30 font-mono">
                {st.step}
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {st.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {st.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. KEY FEATURES */}
      <section className="py-24 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              Enterprise Retail Architecture
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Designed with the reliability of modern fintech and the speed of modern retail tech.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-shadow flex items-start gap-5"
              >
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800 shrink-0 border border-slate-100 dark:border-slate-700">
                  {f.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {f.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQS */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">Everything you need to know about supermarket self-checkout.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
            >
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{faq.q}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black">
              Ready to Experience Zero-Queue Shopping?
            </h2>
            <p className="text-sm text-blue-100 leading-relaxed">
              Open the scanner right on your smartphone, add items to cart, pay with UPI, and walk out.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/scanner"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white text-blue-700 font-extrabold text-xs uppercase tracking-wider shadow-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
              >
                <Scan className="w-4 h-4 text-blue-600" />
                <span>Start Scanning Now</span>
              </Link>
              <Link
                to="/products"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-blue-500/30 border border-white/30 text-white font-extrabold text-xs uppercase tracking-wider hover:bg-blue-500/40 transition-colors"
              >
                Explore Products
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
