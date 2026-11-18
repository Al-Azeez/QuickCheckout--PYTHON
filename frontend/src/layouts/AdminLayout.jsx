import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, PlusCircle, AlertTriangle,
  Receipt, Users, CreditCard, BarChart3, Settings,
  Scan, ArrowLeft, ShieldCheck, LogOut, Menu, X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Products Hub', path: '/admin/products', icon: Package },
    { label: 'Add Product (Barcode)', path: '/admin/products/add', icon: PlusCircle },
    { label: 'Inventory & Alerts', path: '/admin/inventory', icon: AlertTriangle },
    { label: 'Live Orders', path: '/admin/orders', icon: Receipt },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Payments Ledger', path: '/admin/payments', icon: CreditCard },
    { label: 'Analytics & Sales', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Store Settings', path: '/admin/settings', icon: Settings },
  ];

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-white flex transition-colors">
      
      {/* Mobile Sidebar backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-5 space-y-6">
          
          {/* Admin Header */}
          <div className="flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-tight text-white block">
                  QUICKCHECKOUT
                </span>
                <span className="text-[10px] font-bold text-cyan-400 tracking-wider uppercase block">
                  Store Admin Suite
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Exit to Customer Portal */}
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors border border-slate-700/60"
          >
            <ArrowLeft className="w-4 h-4 text-blue-400" />
            <span>Switch to Shopper View</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Admin Footer info */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <div className="flex items-center gap-3 px-2 py-1.5 text-xs">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-xs">
              AD
            </div>
            <div className="truncate">
              <p className="font-bold text-white text-xs truncate">Supermarket Admin</p>
              <p className="text-[10px] text-emerald-400 font-semibold">Store Node #104 Active</p>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Top bar for mobile */}
        <header className="lg:hidden sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold text-sm text-slate-900 dark:text-white">
            Admin Console
          </span>
          <Link to="/admin/products/add" className="p-2 text-blue-600">
            <PlusCircle className="w-5 h-5" />
          </Link>
        </header>

        <main className="p-4 sm:p-6 lg:p-8 flex-1">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
