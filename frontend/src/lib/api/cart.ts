import { apiClient } from "@/lib/api/client";
import type { CartAddRequest, CartResponse } from "@/types";

export const cartApi = {
  get: () => apiClient.get<CartResponse[]>("/cart"),
  add: (payload: CartAddRequest) => apiClient.post<CartResponse>("/cart", payload),
  remove: (itemId: number) => apiClient.delete<null>(`/cart/${itemId}`),
};
