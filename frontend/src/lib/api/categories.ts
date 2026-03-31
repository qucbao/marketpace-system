import { apiClient } from "@/lib/api/client";
import type { CategoryResponse } from "@/types";

export const categoriesApi = {
  getAll: () => apiClient.get<CategoryResponse[]>("/categories"),
  
  // Admin only
  create: (name: string) => 
    apiClient.post<CategoryResponse>("/admin/categories", { name }),
    
  update: (id: number, name: string) =>
    apiClient.put<CategoryResponse>(`/admin/categories/${id}`, { name }),
    
  delete: (id: number) =>
    apiClient.delete<void>(`/admin/categories/${id}`),
};
