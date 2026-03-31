"use client";

import React, { createContext, useContext } from "react";

import { useCartState } from "@/hooks/use-cart-state";
import type { CartResponse } from "@/types";

interface CartContextType {
  items: CartResponse[];
  loading: boolean;
  errorMessage: string | null;
  refreshCart: (silent?: boolean, force?: boolean) => Promise<CartResponse[]>;
  addItem: (
    productId: number,
    quantity?: number,
    optimisticItem?: {
      productName: string;
      productPrice: number;
    },
  ) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const cart = useCartState();

  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
