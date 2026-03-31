export type ProductStatus = "ACTIVE" | "SOLD" | "HIDDEN";

export interface ProductCreateRequest {
  shopId: number;
  ownerId: number;
  categoryId: number;
  name: string;
  description: string;
  condition: string;
  price: number;
  stock: number;
  imageUrls: string[];
}

export interface ProductUpdateRequest {
  ownerId: number;
  categoryId: number;
  name: string;
  description: string;
  condition: string;
  price: number;
  stock: number;
  status: ProductStatus;
  imageUrls: string[];
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  condition: string;
  price: number;
  stock: number;
  status: ProductStatus;
  shopId: number;
  shopName: string;
  categoryId: number;
  categoryName: string;
  ownerId: number;
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  imageUrls: string[];
  averageRating: number;
  soldCount: number;
}
