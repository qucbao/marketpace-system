export * from "./api";
export * from "./auth";
export * from "./cart";
export * from "./category";
export * from "./comment";
export * from "./favorite";
export * from "./order";
export * from "./product";
export * from "./shop";

export interface CartResponse {
    itemId: number;
    userId: number;
    productId: number;
    productName: string;
    productPrice: number; // Trong Java là BigDecimal
    quantity: number;
    totalPrice: number;   // Trong Java là BigDecimal
    createdAt: string;
    updatedAt: string;
    productImage?: string;
}