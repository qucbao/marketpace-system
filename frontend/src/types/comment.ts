export interface CommentCreateRequest {
  content: string;
  rating: number;
  imageUrls?: string;
  orderId?: number;
}

export interface CommentResponse {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
  rating: number;
  imageUrls?: string;
  orderId?: number;
}
