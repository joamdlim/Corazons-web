'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export interface CartItem {
  cartId: string; // Unique ID for the cart item (since same cake might have diff flavors)
  cakeId: string;
  name: string;
  flavor: string;
  size: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cartId'>) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load from local storage
  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('corazon-cart');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load cart', e);
      }
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('corazon-cart', JSON.stringify(items));
    }
  }, [items, mounted]);

  const addToCart = (newItem: Omit<CartItem, 'cartId'>) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (i) => i.cakeId === newItem.cakeId && i.flavor === newItem.flavor && i.size === newItem.size
      );
      
      if (existingItem) {
        toast.success(`Added another ${newItem.name} to cart!`);
        return prev.map((i) =>
          i.cartId === existingItem.cartId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i
        );
      }

      toast.success(`${newItem.name} added to cart!`);
      return [...prev, { ...newItem, cartId: Math.random().toString(36).substring(7) }];
    });
  };

  const removeFromCart = (cartId: string) => {
    setItems((prev) => prev.filter((i) => i.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i.cartId === cartId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
