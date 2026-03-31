export interface CommentCreateRequest {
  content: string;
}

export interface CommentResponse {
  id: number;
  productId: number;
  userId: number;
  userName: string;
  content: string;
  createdAt: string;
}
