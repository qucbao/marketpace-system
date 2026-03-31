"use client";

import { useEffect, useState } from "react";

import {
  AUTH_STATE_CHANGE_EVENT,
  clearAuthSession,
  restoreAuthSession,
  saveAuthSession,
} from "@/lib/auth-token";
import type { AuthResponse } from "@/types";

export function useAuthSession() {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function syncAuthFromStorage() {
      setUser(restoreAuthSession());
      setLoading(false);
    }

    syncAuthFromStorage();

    window.addEventListener(AUTH_STATE_CHANGE_EVENT, syncAuthFromStorage);
    window.addEventListener("storage", syncAuthFromStorage);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGE_EVENT, syncAuthFromStorage);
      window.removeEventListener("storage", syncAuthFromStorage);
    };
  }, []);

  function login(data: AuthResponse) {
    saveAuthSession(data);
    setUser(data);
  }

  function logout() {
    clearAuthSession();
    setUser(null);
    window.location.href = "/login";
  }

  return {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
