"use client";

import { useCallback, useEffect, useState } from "react";

import { ordersApi } from "@/lib/api";
import type { OrderResponse } from "@/types";

export function useOrderDetail(orderId: number | null) {
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const refreshOrder = useCallback(async () => {
    if (!orderId || !Number.isFinite(orderId)) {
      setOrder(null);
      setLoading(false);
      setErrorMessage("Invalid order id");
      return null;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await ordersApi.getById(orderId);
      setOrder(response.data);
      return response.data;
    } catch (error) {
      setOrder(null);
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to load order",
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    void refreshOrder();
  }, [refreshOrder]);

  return {
    order,
    loading,
    errorMessage,
    refreshOrder,
  };
}
