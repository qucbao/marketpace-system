import { apiClient } from "@/lib/api/client";
import type { CategoryResponse } from "@/types";

export const categoriesApi = {
  getAll: () => apiClient.get<CategoryResponse[]>("/categories"),
};
