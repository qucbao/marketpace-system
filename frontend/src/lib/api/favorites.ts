import { apiClient } from "@/lib/api/client";
import type { FavoriteResponse } from "@/types";

export const favoritesApi = {
  get: () => apiClient.get<FavoriteResponse[]>("/favorites"),
  add: (productId: number) =>
    apiClient.post<FavoriteResponse>(`/favorites/${productId}`),
  remove: (productId: number) =>
    apiClient.delete<null>(`/favorites/${productId}`),
};
