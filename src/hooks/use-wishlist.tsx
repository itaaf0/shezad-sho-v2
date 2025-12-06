
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './use-auth';
import { useToast } from './use-toast';
import { useRouter } from 'next/navigation';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlistLoaded: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isWishlistLoaded, setIsWishlistLoaded] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const getStorageKey = useCallback(() => {
    if (!user) return null;
    return `shezad_shop_wishlist_${user.uid}`;
  }, [user]);
  
  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey) {
      try {
        const storedWishlist = localStorage.getItem(storageKey);
        if (storedWishlist) {
          setWishlist(JSON.parse(storedWishlist));
        } else {
          setWishlist([]);
        }
      } catch (error) {
        console.error("Failed to parse wishlist from localStorage", error);
        localStorage.removeItem(storageKey);
      }
    } else {
      // Clear wishlist when user logs out
      setWishlist([]);
    }
    setIsWishlistLoaded(true);
  }, [getStorageKey]);

  useEffect(() => {
    const storageKey = getStorageKey();
    if (storageKey && isWishlistLoaded) {
      localStorage.setItem(storageKey, JSON.stringify(wishlist));
    }
  }, [wishlist, getStorageKey, isWishlistLoaded]);

  const toggleWishlist = useCallback((productId: string) => {
    if (!isAuthenticated) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        action: (
            <button className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground" onClick={() => router.push('/login')}>
              Login
            </button>
        )
      });
      return;
    }

    setWishlist(prevWishlist => {
      const isInWishlist = prevWishlist.includes(productId);
      if (isInWishlist) {
        toast({ title: "Removed from wishlist" });
        return prevWishlist.filter(id => id !== productId);
      } else {
        toast({ title: "Added to wishlist" });
        return [...prevWishlist, productId];
      }
    });
  }, [isAuthenticated, toast, router]);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlistLoaded }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
