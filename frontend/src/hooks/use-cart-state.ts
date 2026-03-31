"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { cartApi } from "@/lib/api";
import type { CartResponse } from "@/types";

interface OptimisticCartItem {
  productName: string;
  productPrice: number;
}

const CART_CACHE_TTL = 15_000;

let cartCache: {
  data: CartResponse[] | null;
  fetchedAt: number;
  promise: Promise<CartResponse[]> | null;
} = {
  data: null,
  fetchedAt: 0,
  promise: null,
};

function isCartCacheFresh() {
  return (
    cartCache.data !== null &&
    Date.now() - cartCache.fetchedAt < CART_CACHE_TTL
  );
}

function writeCartCache(data: CartResponse[]) {
  cartCache = {
    ...cartCache,
    data,
    fetchedAt: Date.now(),
  };
}

function invalidateCartCache() {
  cartCache = {
    ...cartCache,
    fetchedAt: 0,
    promise: null,
  };
}

function clearCartCacheState() {
  cartCache = {
    data: [],
    fetchedAt: Date.now(),
    promise: null,
  };
}

export function useCartState() {
  const [items, setItems] = useState<CartResponse[]>(cartCache.data ?? []);
  const [loading, setLoading] = useState(cartCache.data === null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function refreshCart(silent = false, force = false) {
    if (!force && isCartCacheFresh()) {
      setItems(cartCache.data ?? []);
      setErrorMessage(null);
      setLoading(false);
      return cartCache.data ?? [];
    }

    if (!force && cartCache.promise) {
      if (!silent) {
        setLoading(true);
      }

      try {
        const data = await cartCache.promise;
        setItems(data);
        setErrorMessage(null);
        return data;
      } catch (error) {
        setItems([]);
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load cart",
        );
        return [];
      } finally {
        setLoading(false);
      }
    }

    if (!silent) {
      setLoading(true);
    }

    const request = cartApi
      .get()
      .then((response) => {
        const data = response.data || [];
        writeCartCache(data);
        return data;
      })
      .finally(() => {
        cartCache = {
          ...cartCache,
          promise: null,
        };
      });

    cartCache = {
      ...cartCache,
      promise: request,
    };

    try {
      const data = await request;
      setItems(data);
      setErrorMessage(null);
      return data;
    } catch (error) {
      setItems([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load cart",
      );
      return [];
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (cartCache.data) {
      setItems(cartCache.data);
      setLoading(false);
    }

    const timer = setTimeout(() => {
      void refreshCart(false, false);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  async function addItem(
    productId: number,
    quantity: number = 1,
    optimisticItem?: OptimisticCartItem,
  ) {
    const previousItems = items;
    const optimisticId = -Date.now();

    setItems((current) => {
      const existingItem = current.find((item) => item.productId === productId);

      let nextItems: CartResponse[];

      if (existingItem) {
        nextItems = current.map((item) =>
          item.productId === productId
            ? {
                ...item,
                quantity: item.quantity + quantity,
                totalPrice: item.productPrice * (item.quantity + quantity),
              }
            : item,
        );
      } else if (optimisticItem) {
        const now = new Date().toISOString();
        nextItems = [
          ...current,
          {
            itemId: optimisticId,
            userId: 0,
            productId,
            productName: optimisticItem.productName,
            productPrice: optimisticItem.productPrice,
            quantity,
            totalPrice: optimisticItem.productPrice * quantity,
            createdAt: now,
            updatedAt: now,
          },
        ];
      } else {
        nextItems = current;
      }

      writeCartCache(nextItems);
      return nextItems;
    });

    try {
      const response = await cartApi.add({ productId, quantity });
      const savedItem = response.data;

      setItems((current) => {
        const hasOptimisticItem = current.some((item) => item.itemId === optimisticId);

        const nextItems = hasOptimisticItem
          ? current.map((item) =>
              item.itemId === optimisticId ? savedItem : item,
            )
          : current.map((item) =>
              item.productId === productId ? savedItem : item,
            );

        writeCartCache(nextItems);
        return nextItems;
      });

      setErrorMessage(null);
      toast.success("Added to cart.");
      await refreshCart(true, true);
    } catch {
      setItems(previousItems);
      writeCartCache(previousItems);
      toast.error("Please sign in to continue.");
    }
  }

  async function removeItem(itemId: number) {
    const previousItems = items;

    setItems((current) => {
      const nextItems = current.filter((item) => item.itemId !== itemId);
      writeCartCache(nextItems);
      return nextItems;
    });

    try {
      await cartApi.remove(itemId);
      invalidateCartCache();
    } catch {
      setItems(previousItems);
      writeCartCache(previousItems);
      toast.error("Unable to remove item.");
    }
  }

  function clearCart() {
    setItems([]);
    setErrorMessage(null);
    setLoading(false);
    clearCartCacheState();
  }

  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.totalPrice, 0),
    [items],
  );

  return {
    items,
    loading,
    errorMessage,
    refreshCart,
    addItem,
    removeItem,
    clearCart,
    totalAmount,
  };
}
