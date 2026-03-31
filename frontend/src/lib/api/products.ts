import { apiClient } from "@/lib/api/client";
import type {
  CommentCreateRequest,
  CommentResponse,
  ProductCreateRequest,
  ProductResponse,
  ProductUpdateRequest,
} from "@/types";

export const productsApi = {
  getAll: () => apiClient.get<ProductResponse[]>("/products"),

  getById: (id: number) => apiClient.get<ProductResponse>(`/products/${id}`),

  create: (payload: ProductCreateRequest) =>
    apiClient.post<ProductResponse>("/products", payload),

  update: (id: number, payload: ProductUpdateRequest) =>
    apiClient.put<ProductResponse>(`/products/${id}`, payload),

  remove: (id: number, ownerId: number) =>
    apiClient.delete<null>(`/products/${id}?ownerId=${ownerId}`),

  getComments: (id: number) =>
    apiClient.get<CommentResponse[]>(`/products/${id}/comments`),

  createComment: (id: number, payload: CommentCreateRequest) =>
    apiClient.post<CommentResponse>(`/products/${id}/comments`, payload),
};
