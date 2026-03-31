import { apiClient } from "@/lib/api/client";
import type { ShopRegisterRequest, ShopResponse } from "@/types";

export const shopsApi = {
  // THÊM: Lấy danh sách tất cả các shop
  getAll: () => apiClient.get<ShopResponse[]>("/shops"),

  register: (payload: ShopRegisterRequest) =>
    apiClient.post<ShopResponse>("/shops/register", payload),

  getById: (id: number) => apiClient.get<ShopResponse>(`/shops/${id}`),

  approve: (id: number) =>
    apiClient.post<ShopResponse>(`/admin/shops/${id}/approve`),

  reject: (id: number) =>
    apiClient.post<ShopResponse>(`/admin/shops/${id}/reject`),
};