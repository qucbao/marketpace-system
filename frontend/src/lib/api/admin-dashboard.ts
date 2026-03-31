import { apiClient } from "@/lib/api/client";

export interface DashboardStats {
  totalUsers: number;
  pendingShops: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
}

export const adminDashboardApi = {
  getStats: () => apiClient.get<DashboardStats>("/admin/dashboard/stats"),
};
