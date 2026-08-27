'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AgentPackage, TravelPackageCartItem } from '../types/travelPackage';

interface TravelPackageCartContextType {
  cart: TravelPackageCartItem[];
  addToCart: (pkg: AgentPackage, travelers?: number) => void;
  removeFromCart: (packageId: number) => void;
  updateQuantity: (packageId: number, travelers: number) => void;
  updateDates: (packageId: number, startDate?: string, endDate?: string) => void;
  clearCart: () => void;
  totalAmount: number;
  totalItems: number;
}

const TravelPackageCartContext = createContext<TravelPackageCartContextType | undefined>(undefined);

export const TravelPackageCartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<TravelPackageCartItem[]>([]);

  // Load persistent cart from localStorage
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('santun_pos_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error('Error loading cart:', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('santun_pos_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart:', e);
    }
  }, [cart]);

  const addToCart = (pkg: AgentPackage, travelers: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.package.id === pkg.id);
      if (existing) {
        return prev.map((item) =>
          item.package.id === pkg.id
            ? { ...item, travelers_count: item.travelers_count + travelers }
            : item
        );
      }
      return [
        ...prev,
        {
          package: pkg,
          travelers_count: travelers,
          travel_date_start: pkg.available_dates_start || undefined,
          travel_date_end: pkg.available_dates_end || undefined,
        },
      ];
    });
  };

  const removeFromCart = (packageId: number) => {
    setCart((prev) => prev.filter((item) => item.package.id !== packageId));
  };

  const updateQuantity = (packageId: number, travelers: number) => {
    if (travelers <= 0) {
      removeFromCart(packageId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.package.id === packageId ? { ...item, travelers_count: travelers } : item
      )
    );
  };

  const updateDates = (packageId: number, startDate?: string, endDate?: string) => {
    setCart((prev) =>
      prev.map((item) =>
        item.package.id === packageId
          ? { ...item, travel_date_start: startDate, travel_date_end: endDate }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.package.final_price * item.travelers_count,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.travelers_count, 0);

  return (
    <TravelPackageCartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateDates,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </TravelPackageCartContext.Provider>
  );
};

export const useTravelPackageCart = () => {
  const context = useContext(TravelPackageCartContext);
  if (!context) {
    throw new Error('useTravelPackageCart must be used within TravelPackageCartProvider');
  }
  return context;
};
