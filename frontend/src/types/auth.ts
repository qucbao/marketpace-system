export type Role = "USER" | "ADMIN" | "SELLER";

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  token: string;
}
