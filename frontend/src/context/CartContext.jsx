import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    subtotal: 0,
    discount_total: 0,
    tax: 0,
    total: 0,
    item_count: 0,
  });
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showToast = (message, type = 'success') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 3500);
  };

  const fetchCart = useCallback(async () => {
    try {
      const res = await cartAPI.getCart();
      setCart(res.data);
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productData, quantity = 1) => {
    setLoading(true);
    try {
      const payload = {
        quantity,
        ...(productData.barcode ? { barcode: productData.barcode } : { product_id: productData.id || productData._id })
      };
      const res = await cartAPI.addItem(payload);
      await fetchCart();
      showToast(res.data.message || `Added ${productData.name} to cart!`, 'success');
      return { success: true, data: res.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to add item to cart.';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      await cartAPI.updateItem({ product_id: productId, quantity });
      await fetchCart();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Could not update quantity';
      showToast(errorMsg, 'error');
      return { success: false, error: errorMsg };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await cartAPI.removeItem(productId);
      await fetchCart();
      showToast('Item removed from cart', 'info');
      return { success: true };
    } catch (err) {
      showToast('Failed to remove item', 'error');
      return { success: false };
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart();
      await fetchCart();
      showToast('Cart cleared', 'info');
      return { success: true };
    } catch (err) {
      return { success: false };
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        notification,
        showToast,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemCount: cart?.item_count || 0,
        total: cart?.total || 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
