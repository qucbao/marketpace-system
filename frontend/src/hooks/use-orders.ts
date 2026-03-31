"use client";

import { useCallback, useEffect, useState } from "react";

import { ordersApi } from "@/lib/api";
import type { OrderResponse } from "@/types";

const ORDERS_CACHE_TTL = 30_000;

let ordersCache: {
  data: OrderResponse[] | null;
  fetchedAt: number;
  promise: Promise<OrderResponse[]> | null;
} = {
  data: null,
  fetchedAt: 0,
  promise: null,
};

function isOrdersCacheFresh() {
  return (
    ordersCache.data !== null &&
    Date.now() - ordersCache.fetchedAt < ORDERS_CACHE_TTL
  );
}

function writeOrdersCache(data: OrderResponse[]) {
  ordersCache = {
    ...ordersCache,
    data,
    fetchedAt: Date.now(),
  };
}

export function useOrders() {
  const [orders, setOrders] = useState<OrderResponse[]>(ordersCache.data ?? []);
  const [loading, setLoading] = useState(ordersCache.data === null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshOrders = useCallback(async (force = false) => {
    if (!force && isOrdersCacheFresh()) {
      setOrders(ordersCache.data ?? []);
      setErrorMessage(null);
      setLoading(false);
      return ordersCache.data ?? [];
    }

    if (!force && ordersCache.promise) {
      setLoading(true);

      try {
        const data = await ordersCache.promise;
        setOrders(data);
        setErrorMessage(null);
        return data;
      } catch (error) {
        setOrders([]);
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to load orders",
        );
        return [];
      } finally {
        setLoading(false);
      }
    }

    setLoading(true);
    setErrorMessage(null);

    const request = ordersApi
      .get()
      .then((response) => {
        const data = response.data;
        writeOrdersCache(data);
        return data;
      })
      .finally(() => {
        ordersCache = {
          ...ordersCache,
          promise: null,
        };
      });

    ordersCache = {
      ...ordersCache,
      promise: request,
    };

    try {
      const data = await request;
      setOrders(data);
      return data;
    } catch (error) {
      setOrders([]);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load orders",
      );
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ordersCache.data) {
      setOrders(ordersCache.data);
      setLoading(false);
    }

    void refreshOrders(false);
  }, [refreshOrders]);

  return {
    orders,
    loading,
    errorMessage,
    refreshOrders,
  };
}
