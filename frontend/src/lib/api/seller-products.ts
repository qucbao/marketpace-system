import { apiClient } from "./client";
import type { ProductResponse, ProductCreateRequest, ProductUpdateRequest } from "@/types";

export const sellerProductsApi = {
  // Lấy tất cả sản phẩm của Shop đang đăng nhập
  getAll: () => apiClient.get<ProductResponse[]>("/seller/products"),

  create: (data: Partial<ProductCreateRequest>) => 
    apiClient.post<ProductResponse>("/seller/products", data),

  update: (id: number, data: Partial<ProductUpdateRequest>) => 
    apiClient.put<ProductResponse>(`/seller/products/${id}`, data),

  delete: (id: number) => 
    apiClient.delete<{ success: boolean; message: string }>(`/seller/products/${id}`),
};
