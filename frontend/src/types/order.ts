export type CheckoutType = "PICKUP" | "DELIVERY";
export type OrderStatus = "PENDING" | "PAID_DEPOSIT" | "COMPLETED" | "CANCELLED";

export interface CheckoutRequest {
  checkoutType: CheckoutType;
}

export interface OrderItemSummary {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderResponse {
  id: number;
  userId: number;
  shopId: number;
  shopName: string;
  checkoutType: CheckoutType;
  status: OrderStatus;
  totalAmount: number;
  depositAmount: number;
  createdAt: string;
  items: OrderItemSummary[];
}
