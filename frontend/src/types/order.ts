export type CheckoutType = "PICKUP" | "DELIVERY";
export type OrderStatus = 
  | "PENDING" 
  | "DEPOSIT_SUBMITTED" 
  | "PAID_DEPOSIT" 
  | "PREPARING" 
  | "SHIPPING" 
  | "DELIVERED" 
  | "ESCROW_HOLDING" 
  | "COMPLETED" 
  | "CANCELLED";

export interface CheckoutRequest {
  checkoutType: CheckoutType;
}

export interface OrderItemSummary {
  productId: number;
  productName: string;
  productImage?: string;
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
  depositBillUrl?: string;
  escrowHoldAt?: string;
  sellerName?: string;
  sellerBankAccount?: string;
  sellerBankName?: string;
  buyerName?: string;
}
