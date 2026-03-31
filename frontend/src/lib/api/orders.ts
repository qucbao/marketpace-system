import { apiClient } from "@/lib/api/client";
import type { CheckoutRequest, OrderResponse } from "@/types";

export const ordersApi = {
  checkout: (payload: CheckoutRequest) =>
    apiClient.post<OrderResponse>("/orders/checkout", payload),
  get: () => apiClient.get<OrderResponse[]>("/orders"),
  getById: (id: number) => apiClient.get<OrderResponse>(`/orders/${id}`),
};
