import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getT } from '../i18n/translations';

const AppContext = createContext({});

export function AppProvider({ children }) {
  const [language, setLanguage]   = useState('en');
  const [token, setToken]         = useState(null);
  const [customer, setCustomer]   = useState(null);
  const [cart, setCart]           = useState([]);
  const [wishlist, setWishlist]   = useState([]);

  const t = getT(language);

  // Load persisted state on startup
  useEffect(() => {
    (async () => {
      try {
        const [savedLang, savedToken, savedCustomer, savedCart] = await Promise.all([
          AsyncStorage.getItem('language'),
          AsyncStorage.getItem('token'),
          AsyncStorage.getItem('customer'),
          AsyncStorage.getItem('cart'),
        ]);
        if (savedLang)     setLanguage(savedLang);
        if (savedToken)    setToken(savedToken);
        if (savedCustomer) setCustomer(JSON.parse(savedCustomer));
        if (savedCart)     setCart(JSON.parse(savedCart));
      } catch {}
    })();
  }, []);

  // Persist cart
  useEffect(() => {
    AsyncStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // ---- Auth ----
  const loginUser = useCallback(async (tokenVal, customerVal) => {
    setToken(tokenVal);
    setCustomer(customerVal);
    await AsyncStorage.setItem('token', tokenVal);
    await AsyncStorage.setItem('customer', JSON.stringify(customerVal));
  }, []);

  const logoutUser = useCallback(async () => {
    setToken(null);
    setCustomer(null);
    setWishlist([]);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('customer');
  }, []);

  // ---- Language ----
  const switchLanguage = useCallback(async (lang) => {
    setLanguage(lang);
    await AsyncStorage.setItem('language', lang);
  }, []);

  // ---- Cart ----
  const addToCart = useCallback((product, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.product_id === product.id);
      if (existing) {
        return prev.map(i =>
          i.product_id === product.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        );
      }
      return [...prev, {
        product_id: product.id,
        name:       product.name,
        price:      product.price,
        image:      product.image,
        quantity,
      }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart(prev => prev.filter(i => i.product_id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(i => i.product_id === productId ? { ...i, quantity } : i)
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount   = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal   = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  // ---- Wishlist (local, syncs with API when logged in) ----
  const toggleWishlist = useCallback((product) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === product.id);
      return exists ? prev.filter(i => i.id !== product.id) : [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback((productId) =>
    wishlist.some(i => i.id === productId), [wishlist]);

  return (
    <AppContext.Provider value={{
      // Language
      language, t, switchLanguage,
      // Auth
      token, customer, loginUser, logoutUser,
      isLoggedIn: !!token,
      // Cart
      cart, cartCount, cartTotal,
      addToCart, removeFromCart, updateQuantity, clearCart,
      // Wishlist
      wishlist, toggleWishlist, isInWishlist,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
