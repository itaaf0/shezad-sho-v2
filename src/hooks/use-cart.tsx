
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import type { Product } from '@/lib/data';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from './use-auth';

export interface CartItem extends Product {
  quantity: number;
  size?: string;
  cartItemId: string; // Unique identifier for a product + size combination
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartLoaded: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const previousCartItems = useRef<CartItem[]>([]);

  const getStorageKey = useCallback(() => {
    return user ? `shezad_shop_cart_${user.uid}` : 'shezad_shop_cart_guest';
  }, [user]);

  // Effect to load cart from local storage
  useEffect(() => {
    setIsCartLoaded(false);
    try {
      const storedCart = localStorage.getItem(getStorageKey());
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
        previousCartItems.current = parsedCart;
      } else {
        setCartItems([]);
        previousCartItems.current = [];
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
      localStorage.removeItem(getStorageKey());
    } finally {
      setIsCartLoaded(true);
    }
  }, [getStorageKey]);

  // Effect to save cart to local storage
  useEffect(() => {
    if (isCartLoaded) {
      localStorage.setItem(getStorageKey(), JSON.stringify(cartItems));
    }
  }, [cartItems, isCartLoaded, getStorageKey]);

  // Effect to show toast notifications
  useEffect(() => {
    if (!isCartLoaded) return;

    if (cartItems.length > previousCartItems.current.length) {
      const newItem = cartItems.find(item => !previousCartItems.current.some(prev => prev.cartItemId === item.cartItemId));
      if (newItem) {
        toast({
          title: "Added to cart",
          description: `${newItem.name}${newItem.size ? ` (${newItem.size})` : ''} has been added.`,
        });
      }
    } else if (cartItems.length < previousCartItems.current.length) {
       const removedItem = previousCartItems.current.find(prev => !cartItems.some(item => item.cartItemId === prev.cartItemId));
        if (removedItem) {
          toast({
            variant: "destructive",
            title: "Item removed",
            description: `${removedItem.name}${removedItem.size ? ` (${removedItem.size})` : ''} has been removed.`,
          });
        }
    } else {
        const updatedItem = cartItems.find(item => {
          const prevItem = previousCartItems.current.find(p => p.cartItemId === item.cartItemId);
          return prevItem && item.quantity !== prevItem.quantity;
        });
        if (updatedItem) {
            const prevItem = previousCartItems.current.find(p => p.cartItemId === updatedItem.cartItemId);
            if(prevItem && updatedItem.quantity > prevItem.quantity){
                 toast({ title: "Cart updated" });
            }
        }
    }
    
    previousCartItems.current = cartItems;
  }, [cartItems, isCartLoaded, toast]);
  
  const addToCart = useCallback((product: Product, quantity = 1, size?: string) => {
    const cartItemId = size ? `${product.id}_${size}` : product.id;
    
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(item => item.cartItemId === cartItemId);
      if (existingItemIndex > -1) {
        const newItems = [...prevItems];
        newItems[existingItemIndex].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, { ...product, quantity, size, cartItemId }];
      }
    });
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartItemId !== cartItemId));
  }, []);

  const updateQuantity = useCallback((cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCartItems(prevItems => prevItems.map(item =>
      item.cartItemId === cartItemId ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, isCartLoaded }}>
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
