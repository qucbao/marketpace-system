export type ShopStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ShopRegisterRequest {
  ownerId: number;
  name: string;
  description: string;
}

export interface ShopResponse {
  id: number;
  name: string;
  description: string;
  avatarUrl?: string;
  address?: string;
  ownerId: number;
  ownerName: string;
  status: ShopStatus;
  createdAt: string;
  updatedAt: string;
}
