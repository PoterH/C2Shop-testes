import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '../data/products';

interface CartContextType {
  cartItems: Product[];
  isCartOpen: boolean;
  couponCode: string;
  subtotal: number;
  discountAmount: number;
  total: number;
  discountPercentage: number;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('c2shop_cart');
      const savedCoupon = localStorage.getItem('c2shop_coupon');
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      if (savedCoupon) {
        setCouponCode(savedCoupon);
      }
    } catch (e) {
      console.error('Error loading cart data from localStorage:', e);
    }
  }, []);

  // Save cart to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem('c2shop_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Error saving cart to localStorage:', e);
    }
  }, [cartItems]);

  // Save coupon to localStorage when changed
  useEffect(() => {
    try {
      if (couponCode) {
        localStorage.setItem('c2shop_coupon', couponCode);
      } else {
        localStorage.removeItem('c2shop_coupon');
      }
    } catch (e) {
      console.error('Error saving coupon to localStorage:', e);
    }
  }, [couponCode]);

  const addToCart = (product: Product) => {
    if (product.unavailable) return;
    
    setCartItems((prev) => {
      // Check if already in cart
      const exists = prev.find((item) => item.id === product.id);
      if (exists) return prev;
      return [...prev, product];
    });
    
    // Automatically open the cart drawer
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    setCouponCode('');
  };

  const applyCoupon = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    if (cleanCode === 'OFF10') {
      setCouponCode('OFF10');
      if (cartItems.length > 1) {
        return { success: true, message: 'Cupom OFF10 aplicado! Desconto de 10% ativo.' };
      } else {
        return { 
          success: true, 
          message: 'Cupom OFF10 inserido. Adicione mais um software para ativar os 10% de desconto!' 
        };
      }
    }
    return { success: false, message: 'Cupom inválido.' };
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  // Math calculations
  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  
  // Coupon OFF10 only applies when items count > 1
  const discountPercentage = (couponCode === 'OFF10' && cartItems.length > 1) ? 10 : 0;
  const discountAmount = subtotal * (discountPercentage / 100);
  const total = subtotal - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        isCartOpen,
        couponCode,
        subtotal,
        discountAmount,
        total,
        discountPercentage,
        addToCart,
        removeFromCart,
        clearCart,
        setIsCartOpen,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
