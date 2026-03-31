import { apiClient } from "@/lib/api/client";
import type { ShopRegisterRequest, ShopResponse } from "@/types";

export const shopsApi = {
  // Lấy danh sách tất cả các shop (Cho Admin chi tiết)
  getAllDetail: () => apiClient.get<any[]>("/admin/shops"),

  // Lấy danh sách APPROVED shops (Cho trang chủ/khám phá)
  getAll: () => apiClient.get<ShopResponse[]>("/shops"),

  // Lấy các shop đang chờ duyệt (Dành cho Admin)
  getPending: () => apiClient.get<ShopResponse[]>("/admin/shops/pending"),

  register: (payload: ShopRegisterRequest) =>
    apiClient.post<ShopResponse>("/shops/register", payload),

  getById: (id: number) => apiClient.get<ShopResponse>(`/shops/${id}`),

  // Duyệt/Từ chối (Cho Admin)
  approve: (id: number) =>
    apiClient.post<ShopResponse>(`/admin/shops/${id}/approve`),

  reject: (id: number) =>
    apiClient.post<ShopResponse>(`/admin/shops/${id}/reject`),

  // Mới: Cho Seller
  getMe: () => apiClient.get<ShopResponse>("/shops/me"),
  
  updateMe: (data: { name: string; description: string; avatarUrl?: string; address?: string }) => 
    apiClient.patch<ShopResponse>("/shops/me", data),
};