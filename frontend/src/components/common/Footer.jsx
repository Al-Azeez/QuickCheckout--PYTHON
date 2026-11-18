import React from 'react';
import { Link } from 'react-router-dom';
import { Scan, ShieldCheck, Zap, CreditCard, Sparkles, MapPin, Phone, Mail } from 'lucide-react';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

export const Footer = () => {
  const { t } = useThemeLanguage();

  return (
    <footer className="w-full bg-slate-900 text-slate-300 border-t border-slate-800 transition-colors mt-auto">
      {/* Upper features strip */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Instant Barcode Match</h4>
              <p className="text-xs text-slate-400">Exact MongoDB index lookups</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Razorpay & UPI QR</h4>
              <p className="text-xs text-slate-400">Instant sound-box receipt verification</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Zero Queue Friction</h4>
              <p className="text-xs text-slate-400">Skip traditional cash counter lines</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Live Inventory Sync</h4>
              <p className="text-xs text-slate-400">Atomic stock decrement on payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer columns */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand column */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Scan className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg text-white tracking-tight">
              QUICK<span className="text-blue-400">CHECKOUT</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Next-generation supermarket self-checkout platform built on Python, Django REST Framework, and MongoDB Atlas.
          </p>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-800/40 text-[11px] font-semibold text-blue-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Supermarket Node #104 Active
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Shopping Experience</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/scanner" className="hover:text-white transition-colors">Smart Barcode Scanner</Link></li>
            <li><Link to="/products" className="hover:text-white transition-colors">Browse Supermarket Catalog</Link></li>
            <li><Link to="/cart" className="hover:text-white transition-colors">Active Shopping Cart</Link></li>
            <li><Link to="/orders" className="hover:text-white transition-colors">Digital Receipt Archive</Link></li>
          </ul>
        </div>

        {/* Admin Tools */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Store Administration</h4>
          <ul className="space-y-2 text-xs">
            <li><Link to="/admin" className="hover:text-white transition-colors">Operations Overview</Link></li>
            <li><Link to="/admin/products" className="hover:text-white transition-colors">Barcode & Product Management</Link></li>
            <li><Link to="/admin/inventory" className="hover:text-white transition-colors">Real-Time Inventory Watch</Link></li>
            <li><Link to="/admin/analytics" className="hover:text-white transition-colors">Revenue & Sales Trends</Link></li>
          </ul>
        </div>

        {/* Store Contact */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">Flagship Supermarket</h4>
          <div className="space-y-2 text-xs text-slate-400">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>100ft Road, Indiranagar, Bengaluru</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>Toll Free: 1800-QUICK-PAY</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span>support@quickcheckout.in</span>
            </p>
            <p className="text-[11px] text-slate-500 pt-2">
              GSTIN: 29AABCS1429B1Z5
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 QUICKCHECKOUT 2.0. All Rights Reserved. SHOP. SCAN. PAY. GO.</p>
        <p className="text-[11px]">Powered by Django REST Framework & MongoDB Atlas</p>
      </div>
    </footer>
  );
};

export default Footer;
