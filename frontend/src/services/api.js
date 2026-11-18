import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5676/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Attach JWT token or anonymous session ID to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('qc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  let sessionId = localStorage.getItem('qc_session_id');
  if (!sessionId) {
    sessionId = 'sess_' + Math.random().toString(36).substring(2, 12);
    localStorage.setItem('qc_session_id', sessionId);
  }
  config.headers['X-Session-ID'] = sessionId;

  return config;
}, (error) => Promise.reject(error));

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register/', data),
  login: (data) => api.post('/auth/login/', data),
  refresh: (token) => api.post('/auth/refresh/', { token }),
  getProfile: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.put('/auth/profile/', data),
  forgotPassword: (email) => api.post('/auth/forgot-password/', { email }),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products/', { params }),
  getById: (id) => api.get(`/products/${id}/`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}/`, data),
  delete: (id) => api.delete(`/products/${id}/`),
  getCategories: () => api.get('/categories/'),
};

// Barcode API - Critical Admin-to-Customer integration
export const barcodeAPI = {
  lookup: (barcode) => api.get(`/products/barcode/${barcode}/`),
  scan: (barcode) => api.post('/products/scan/', { barcode }),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart/'),
  addItem: (data) => api.post('/cart/add/', data),
  updateItem: (data) => api.patch('/cart/update/', data),
  removeItem: (productId) => api.delete(`/cart/remove/?product_id=${productId}`),
  clearCart: () => api.post('/cart/clear/'),
};

// Orders API
export const ordersAPI = {
  create: (data) => api.post('/orders/create/', data),
  getAll: (params) => api.get('/orders/', { params }),
  getById: (id) => api.get(`/orders/${id}/`),
};

// Payments API
export const paymentsAPI = {
  createPayment: (data) => api.post('/payments/create/', data),
  verifyPayment: (data) => api.post('/payments/verify/', data),
};

// Admin API
export const adminAPI = {
  getAnalytics: () => api.get('/analytics/'),
  getInventory: (params) => api.get('/inventory/', { params }),
  getCustomers: () => api.get('/customers/'),
  getTransactions: () => api.get('/transactions/'),
};

// Health API
export const healthAPI = {
  check: () => api.get('/health/'),
};

export default api;
