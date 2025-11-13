"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartContextValue = {
  items: number[]; // product ids
  add: (id: number) => void;
  remove: (id: number) => void;
  toggle: (id: number) => void;
  clear: () => void;
  count: number;
};

const CART_KEY = "cart_v1";
const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<number[]>([]);

  // Load cart from localStorage once on mount
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const raw = localStorage.getItem(CART_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as number[];
          if (Array.isArray(parsed)) setItems(parsed);
        }
      }
    } catch {
      // ignore bad JSON or storage errors
    }
  }, []);

  // Persist cart whenever items change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
      }
    } catch {
      // ignore quota/storage errors
    }
  }, [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      add: (id) => setItems((prev) => (prev.includes(id) ? prev : [...prev, id])),
      remove: (id) => setItems((prev) => prev.filter((x) => x !== id)),
      toggle: (id) =>
        setItems((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])),
      clear: () => setItems([]),
      count: items.length,
    }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
