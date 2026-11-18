import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('qc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('qc_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('qc_token', token);
    } else {
      localStorage.removeItem('qc_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('qc_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('qc_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login({ email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      const msg = err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const demoLogin = async (role = 'customer') => {
    if (role === 'admin') {
      return await login('admin@quickcheckout.in', 'adminpassword123');
    }
    return await login('customer@quickcheckout.in', 'password123');
  };

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.register(data);
      setToken(res.data.token);
      setUser(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed.';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('qc_token');
    localStorage.removeItem('qc_user');
  };

  const updateProfile = async (updates) => {
    try {
      const res = await authAPI.updateProfile(updates);
      setUser(prev => ({ ...prev, ...res.data }));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || 'Update failed' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        demoLogin,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
