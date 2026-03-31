import type { AuthResponse, Role } from "@/types";

const AUTH_TOKEN_KEY = "marketplace-auth-token";
const AUTH_USER_KEY = "marketplace-auth-user";
export const AUTH_STATE_CHANGE_EVENT = "marketplace-auth-state-change";

type JwtClaims = {
  sub?: string;
  userId?: number;
  exp?: number;
};

function canUseStorage() {
  return typeof window !== "undefined";
}

function notifyAuthStateChanged() {
  if (!canUseStorage()) {
    return;
  }

  window.dispatchEvent(new Event(AUTH_STATE_CHANGE_EVENT));
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return window.atob(normalized + padding);
}

function decodeJwtClaims(token: string): JwtClaims | null {
  if (!canUseStorage()) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  try {
    return JSON.parse(decodeBase64Url(parts[1])) as JwtClaims;
  } catch {
    return null;
  }
}

function isExpired(claims: JwtClaims | null) {
  return Boolean(claims?.exp && Date.now() >= claims.exp * 1000);
}

function readStoredUser() {
  if (!canUseStorage()) {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthResponse;
  } catch {
    return null;
  }
}

function buildFallbackUser(token: string, claims: JwtClaims): AuthResponse | null {
  if (!claims.userId || !claims.sub) {
    return null;
  }

  const fallbackName = claims.sub.split("@")[0] || claims.sub;

  return {
    id: claims.userId,
    email: claims.sub,
    fullName: fallbackName,
    role: "USER" as Role,
    token,
  };
}

export function getAuthToken() {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function saveAuthToken(token: string) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  notifyAuthStateChanged();
}

export function saveAuthSession(auth: AuthResponse) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, auth.token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(auth));
  notifyAuthStateChanged();
}

export function clearAuthSession() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
  notifyAuthStateChanged();
}

export function clearAuthToken() {
  clearAuthSession();
}

export function restoreAuthSession() {
  const token = getAuthToken();
  if (!token) {
    return null;
  }

  const claims = decodeJwtClaims(token);
  if (!claims || isExpired(claims)) {
    clearAuthSession();
    return null;
  }

  const storedUser = readStoredUser();
  if (storedUser?.token === token && storedUser.id === claims.userId) {
    return storedUser;
  }

  const fallbackUser = buildFallbackUser(token, claims);
  if (!fallbackUser) {
    clearAuthSession();
    return null;
  }

  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(fallbackUser));
  return fallbackUser;
}
