
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";

interface User {
  uid: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoaded: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const MOCK_USERS: { [key: string]: User } = {
  "user@example.com": { uid: "123", name: "Test User", email: "user@example.com" },
};
const MOCK_PASSWORDS: { [key: string]: string } = {
  "user@example.com": "password",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('shezad_shop_user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      localStorage.removeItem('shezad_shop_user');
    }
    setIsAuthLoaded(true);
  }, []);

  const login = async (email: string, pass: string) => {
    const existingUser = MOCK_USERS[email];
    if (existingUser && MOCK_PASSWORDS[email] === pass) {
      setUser(existingUser);
      localStorage.setItem('shezad_shop_user', JSON.stringify(existingUser));
      toast({ title: "Logged in successfully!" });
      router.push('/orders');
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Please check your credentials and try again.",
      });
    }
  };
  
  const signup = async (name: string, email: string, pass: string) => {
    if (MOCK_USERS[email]) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "An account with this email already exists.",
      });
      return;
    }
    const newUser = { uid: `mock_uid_${Date.now()}`, name, email };
    MOCK_USERS[email] = newUser;
    MOCK_PASSWORDS[email] = pass;
    
    setUser(newUser);
    localStorage.setItem('shezad_shop_user', JSON.stringify(newUser));
    toast({ title: "Account created successfully!" });
    router.push('/orders');
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('shezad_shop_user');
    router.push('/');
    toast({ title: "Logged out" });
  };
  
  useEffect(() => {
    const protectedRoutes = ['/orders', '/wishlist'];
    if (isAuthLoaded && !user && protectedRoutes.includes(pathname)) {
        router.push('/login');
    }
  }, [user, isAuthLoaded, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isAuthLoaded, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
