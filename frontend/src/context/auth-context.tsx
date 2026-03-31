"use client";

import React, { createContext, useContext } from "react";

import { useAuthSession } from "@/hooks/use-auth-session";
import type { AuthResponse } from "@/types";

interface AuthContextType {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (data: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuthSession();

  return (
    <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
