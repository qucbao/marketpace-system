export interface CartAddRequest {
  productId: number;
  quantity: number;
}

export interface CartResponse {
  itemId: number;
  userId: number;
  productId: number;
  productName: string;
  productPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
