import { apiClient } from "./client";
import type { OrderResponse } from "@/types";

export const sellerOrdersApi = {
  // Lấy tất cả đơn hàng của Shop đang đăng nhập
  getAll: () => apiClient.get<OrderResponse[]>("/seller/orders"),

  // Cập nhật trạng thái đơn (COMPLETED, CANCELLED)
  updateStatus: (id: number, status: string) => 
    apiClient.put<OrderResponse>(`/seller/orders/${id}/status`, { status }),
};
