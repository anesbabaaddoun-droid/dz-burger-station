'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

export interface CartItem {
  menuItemId: string;
  name: string;
  basePrice: number;
  variantId?: string;
  variantName?: string;
  variantPrice: number;
  quantity: number;
  selectedExtras: Array<{ id: string; name: string; price: number }>;
  imageUrl: string;
}

export interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (menuItemId: string, variantId?: string) => void;
  updateQuantity: (menuItemId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) =>
          item.menuItemId === newItem.menuItemId &&
          item.variantId === newItem.variantId &&
          JSON.stringify(item.selectedExtras) === JSON.stringify(newItem.selectedExtras)
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      }

      return [...prevItems, newItem];
    });
  }, []);

  const removeItem = useCallback((menuItemId: string, variantId?: string) => {
    setItems((prevItems) =>
      prevItems.filter((item) => !(item.menuItemId === menuItemId && item.variantId === variantId))
    );
  }, []);

  const updateQuantity = useCallback((menuItemId: string, quantity: number, variantId?: string) => {
    if (quantity <= 0) {
      removeItem(menuItemId, variantId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.menuItemId === menuItemId && item.variantId === variantId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((total, item) => {
      const itemTotal = (item.variantPrice + item.selectedExtras.reduce((sum, extra) => sum + extra.price, 0)) * item.quantity;
      return total + itemTotal;
    }, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, getTotal, getItemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};
