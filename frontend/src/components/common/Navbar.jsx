import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Scan, ShoppingBag, ShieldCheck, Sun, Moon, Globe,
  Menu, X, Sparkles, User, LogOut, ChevronDown, Check
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useThemeLanguage } from '../../context/ThemeLanguageContext';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { user, isAuthenticated, isAdmin, logout, demoLogin } = useAuth();
  const { itemCount } = useCart();
  const { theme, toggleTheme, lang, toggleLang, t } = useThemeLanguage();

  const isActive = (path) => location.pathname === path;

  const handleDemoSwitch = async (role) => {
    await demoLogin(role);
    setProfileDropdownOpen(false);
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-blue-500 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Scan className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                QUICK<span className="text-blue-600 dark:text-cyan-400">CHECKOUT</span>
              </span>
              <span className="bg-blue-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wider">
                2.0
              </span>
            </div>
            <p className="text-[9px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
              {t('brand_tagline')}
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <Link
            to="/"
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isActive('/') 
                ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40' 
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            {t('nav_home')}
          </Link>

          <Link
            to="/products"
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isActive('/products') 
                ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40' 
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            {t('nav_products')}
          </Link>

          <Link
            to="/scanner"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isActive('/scanner') 
                ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40' 
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <Scan className="w-4 h-4 text-blue-500" />
            <span>{t('nav_scanner')}</span>
          </Link>

          {isAuthenticated && (
            <Link
              to="/dashboard"
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                isActive('/dashboard') 
                  ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40' 
                  : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
              }`}
            >
              Dashboard
            </Link>
          )}

          <Link
            to="/admin"
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              isActive('/admin') 
                ? 'text-blue-600 dark:text-cyan-400 bg-blue-50/80 dark:bg-blue-950/40' 
                : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 hover:bg-slate-100/60 dark:hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>{t('nav_admin')}</span>
          </Link>
        </nav>

        {/* Actions & Utilities */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Switch Language (English / हिंदी)"
          >
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            <span>{lang === 'en' ? 'EN' : 'हिं'}</span>
          </button>

          {/* Cart Button */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100/80 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 transition-all border border-blue-200/60 dark:border-blue-800/60"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline text-xs font-semibold">{t('nav_cart')}</span>
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-blue-600 rounded-full shadow-xs">
              {itemCount}
            </span>
          </Link>

          {/* Profile / Demo Login Switcher */}
          <div className="relative">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors text-left"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-xs">
                    <p className="font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                      {user?.name?.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize">{user?.role}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                      <span className={`mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        user?.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user?.role === 'admin' ? 'Supermarket Admin' : 'Verified Customer'}
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <User className="w-3.5 h-3.5" /> Customer Dashboard
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Order History
                      </Link>
                      <Link
                        to="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Admin Console
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-700 pt-1">
                      <div className="px-4 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Switch Demo Role
                      </div>
                      <button
                        onClick={() => handleDemoSwitch('customer')}
                        className="w-full flex items-center justify-between px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left"
                      >
                        <span>Customer Persona</span>
                        {user?.role === 'customer' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                      <button
                        onClick={() => handleDemoSwitch('admin')}
                        className="w-full flex items-center justify-between px-4 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-left"
                      >
                        <span>Admin Persona</span>
                        {user?.role === 'admin' && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full mt-1 flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5" /> {t('nav_signout')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
                >
                  {t('nav_signin')}
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/25 transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{t('nav_get_started')}</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            aria-label="Open menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-2 animate-in slide-in-from-top-4">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('nav_home')}
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('nav_products')}
          </Link>
          <Link
            to="/scanner"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/40"
          >
            {t('nav_scanner')}
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {t('nav_cart')} ({itemCount})
          </Link>
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Customer Dashboard
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm font-medium text-emerald-600 dark:text-emerald-400"
          >
            {t('nav_admin')}
          </Link>
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => handleDemoSwitch('customer')}
              className="flex-1 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700"
            >
              Demo Customer
            </button>
            <button
              onClick={() => handleDemoSwitch('admin')}
              className="flex-1 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700"
            >
              Demo Admin
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
