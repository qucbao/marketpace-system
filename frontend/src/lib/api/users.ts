import { apiClient } from "./client";
import type { Role } from "@/types";

export interface UserProfileResponse {
  id: number;
  fullName: string;
  email: string;
  role: Role;
  createdAt: string;
}

export interface UserUpdateRequest {
  fullName: string;
}

export const usersApi = {
  getProfile: () => 
    apiClient.get<UserProfileResponse>("/users/profile"),
    
  updateProfile: (data: UserUpdateRequest) =>
    apiClient.put<UserProfileResponse>("/users/profile", data),
};
