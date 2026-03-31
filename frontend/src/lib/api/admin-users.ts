import { apiClient } from "@/lib/api/client";
import type { Role } from "@/types";

export interface UserResponse {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  createdAt: string;
  bankAccount: string | null;
  bankName: string | null;
}

export interface UserDetailResponse extends UserResponse {
  isLocked: boolean;
  lockReason: string | null;
  shopName: string | null;
  shopId: number | null;
  totalProducts: number;
}

export const adminUsersApi = {
  getAll: () => apiClient.get<UserDetailResponse[]>("/admin/users"),
  lock: (id: number, reason: string) => 
    apiClient.patch<UserResponse>(`/admin/users/${id}/lock`, { reason }),
  unlock: (id: number) => 
    apiClient.patch<UserResponse>(`/admin/users/${id}/unlock`, {}),
  delete: (id: number) => 
    apiClient.delete<null>(`/admin/users/${id}`),
};
