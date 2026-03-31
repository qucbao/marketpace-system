import { apiClient } from "@/lib/api/client";
import type { OrderResponse } from "@/types";

export const adminOrdersApi = {
  getAll: () => apiClient.get<OrderResponse[]>("/admin/orders"),
  approveDeposit: (id: number) => apiClient.post<OrderResponse>(`/admin/orders/${id}/approve-deposit`, {}),
  releaseEscrow: (id: number) => apiClient.post<OrderResponse>(`/admin/orders/${id}/release-escrow`, {}),
  updateStatus: (id: number, status: string) => apiClient.patch<OrderResponse>(`/admin/orders/${id}/status?status=${status}`, {}),
};
