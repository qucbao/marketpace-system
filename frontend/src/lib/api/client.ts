import { clearAuthSession, getAuthToken } from "@/lib/auth-token";
import { API_BASE_URL } from "@/lib/config";
import type { ApiResponse } from "@/types";

type RequestInitWithJson = RequestInit & {
  json?: unknown;
};

const MAX_RETRIES = 1;
const RETRY_DELAY_MS = 250;

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetriableStatus(status: number) {
  return status === 408 || status === 429 || status >= 500;
}

async function request<T>(
  path: string,
  init: RequestInitWithJson = {},
): Promise<ApiResponse<T>> {
  const headers = new Headers(init.headers);
  const isFormData = init.json instanceof FormData;

  if (init.json !== undefined && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const method = (init.method ?? "GET").toUpperCase();
  const canRetry = method === "GET";

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
        body: isFormData 
          ? (init.json as FormData) 
          : (init.json !== undefined ? JSON.stringify(init.json) : init.body),
        cache: "no-store",
      });

      const rawPayload = await response.text();
      let payload: ApiResponse<T> | null = null;

      if (rawPayload) {
        try {
          payload = JSON.parse(rawPayload) as ApiResponse<T>;
        } catch {
          payload = null;
        }
      }

      if (response.status === 401) {
        clearAuthSession();
        throw new Error(payload?.message || "Your session has expired. Please sign in again.");
      }

      if (canRetry && attempt < MAX_RETRIES && isRetriableStatus(response.status)) {
        await delay(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.message || response.statusText || "Request failed");
      }

      return payload;
    } catch (error) {
      const isNetworkError = error instanceof TypeError;

      if (canRetry && isNetworkError && attempt < MAX_RETRIES) {
        await delay(RETRY_DELAY_MS * (attempt + 1));
        continue;
      }

      throw error;
    }
  }

  throw new Error("Request failed");
}

export const apiClient = {
  get: <T>(path: string, init?: RequestInit) => request<T>(path, init),
  post: <T>(path: string, json?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "POST", json }),
  put: <T>(path: string, json?: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "PUT", json }),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "DELETE" }),
};
