import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Providers & Contexts
import { ThemeLanguageProvider } from './context/ThemeLanguageContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Toast from './components/common/Toast';

// Layouts
import AdminLayout from './layouts/AdminLayout';

// Public & Customer Pages
import LandingPage from './pages/LandingPage';
import ProductCatalogPage from './pages/ProductCatalogPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import BarcodeScannerPage from './pages/BarcodeScannerPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentQRPage from './pages/PaymentQRPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import DigitalReceiptPage from './pages/DigitalReceiptPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerProfile from './pages/customer/CustomerProfile';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductManagement from './pages/admin/AdminProductManagement';
import AdminAddProduct from './pages/admin/AdminAddProduct';
import AdminInventory from './pages/admin/AdminInventory';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminSettings from './pages/admin/AdminSettings';

const queryClient = new QueryClient();

// Main Customer Layout wrapper with Navbar and Footer
const CustomerLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeLanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Router>
              <Toast />
              <Routes>
                {/* 1. Public & Customer Routes */}
                <Route path="/" element={<CustomerLayout><LandingPage /></CustomerLayout>} />
                <Route path="/products" element={<CustomerLayout><ProductCatalogPage /></CustomerLayout>} />
                <Route path="/products/:id" element={<CustomerLayout><ProductDetailsPage /></CustomerLayout>} />
                <Route path="/scanner" element={<CustomerLayout><BarcodeScannerPage /></CustomerLayout>} />
                <Route path="/cart" element={<CustomerLayout><ShoppingCartPage /></CustomerLayout>} />
                <Route path="/checkout" element={<CustomerLayout><CheckoutPage /></CustomerLayout>} />
                <Route path="/payment/qr/:orderId" element={<CustomerLayout><PaymentQRPage /></CustomerLayout>} />
                <Route path="/payment/success/:orderId" element={<CustomerLayout><PaymentSuccessPage /></CustomerLayout>} />
                <Route path="/payment/failure/:orderId" element={<CustomerLayout><PaymentFailurePage /></CustomerLayout>} />
                <Route path="/orders" element={<CustomerLayout><OrderHistoryPage /></CustomerLayout>} />
                <Route path="/receipt/:orderId" element={<CustomerLayout><DigitalReceiptPage /></CustomerLayout>} />
                <Route path="/dashboard" element={<CustomerLayout><CustomerDashboard /></CustomerLayout>} />
                <Route path="/profile" element={<CustomerLayout><CustomerProfile /></CustomerLayout>} />

                {/* 2. Authentication Routes */}
                <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
                <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
                <Route path="/forgot-password" element={<CustomerLayout><ForgotPassword /></CustomerLayout>} />

                {/* 3. Dedicated Admin Suite Routes */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProductManagement />} />
                  <Route path="products/add" element={<AdminAddProduct />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeLanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
