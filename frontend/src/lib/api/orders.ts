import { apiClient } from "@/lib/api/client";
import type { CheckoutRequest, OrderResponse } from "@/types";

export const ordersApi = {
  checkout: (payload: CheckoutRequest) =>
    apiClient.post<OrderResponse>("/orders/checkout", payload),
  get: () => apiClient.get<OrderResponse[]>("/orders"),
  getById: (id: number) => apiClient.get<OrderResponse>(`/orders/${id}`),
  submitBill: (id: number, billUrl: string) =>
    apiClient.post<OrderResponse>(`/orders/${id}/submit-bill`, { billUrl }),
  approveDeposit: (id: number) =>
    apiClient.post<OrderResponse>(`/orders/${id}/approve-deposit`, {}),
  confirmDelivery: (id: number) =>
    apiClient.post<OrderResponse>(`/orders/${id}/confirm-delivery`, {}),
  releaseEscrow: (id: number) =>
    apiClient.post<OrderResponse>(`/orders/${id}/release-escrow`, {}),
};
