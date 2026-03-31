import { apiClient } from "@/lib/api/client";
import type {
  CommentCreateRequest,
  CommentResponse,
  ProductCreateRequest,
  ProductResponse,
  ProductUpdateRequest,
} from "@/types";

export const productsApi = {
  getAll: (params?: { query?: string; categoryId?: number; minPrice?: number; maxPrice?: number; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.query) searchParams.append("query", params.query);
    if (params?.categoryId) searchParams.append("categoryId", params.categoryId.toString());
    if (params?.minPrice) searchParams.append("minPrice", params.minPrice.toString());
    if (params?.maxPrice) searchParams.append("maxPrice", params.maxPrice.toString());
    if (params?.sort) searchParams.append("sort", params.sort);
    
    const queryString = searchParams.toString();
    return apiClient.get<ProductResponse[]>(`/products${queryString ? `?${queryString}` : ""}`);
  },

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
