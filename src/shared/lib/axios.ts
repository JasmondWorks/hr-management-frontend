import axios, {
  AxiosError,
  type InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken, setAccessToken } from "./token-store";
import { ROUTES } from "./constants";
import { refreshSession } from "@/features/auth/session.actions";

// Base URL points at the API root, e.g. http://localhost:5000/api/v1
// Data calls authenticate with the in-memory access token (Bearer). The refresh
// token lives in an httpOnly cookie handled by server actions, so no cookies are
// sent to the backend from here.
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach the in-memory access token as a Bearer header on every request.
api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A single in-flight refresh shared across concurrent 401s.
let refreshPromise: Promise<string | null> | null = null;

/**
 * Calls the refresh endpoint (using the httpOnly refresh cookie), stores the new
 * access token in memory, and returns it. Returns null if refresh fails.
 * Safe to call concurrently — callers share one in-flight request.
 */
export function refreshAccessToken(): Promise<string | null> {
  // Delegates to the server action, which reads the httpOnly refresh cookie,
  // refreshes at the backend, rotates the cookie, and returns a new token.
  refreshPromise ??= refreshSession()
    .then((token) => {
      setAccessToken(token);
      return token;
    })
    .catch(() => {
      setAccessToken(null);
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });
  return refreshPromise;
}

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

// On a 401, refresh once and replay the original request. If refresh fails,
// clear the token and (in the browser) redirect to login.
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;
    const status = error.response?.status;
    const isAuthCall = original?.url?.includes("/auth/");

    if (status === 401 && original && !original._retry && !isAuthCall) {
      original._retry = true;
      const token = await refreshAccessToken();
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
      if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith(ROUTES.login)
      ) {
        window.location.href = ROUTES.login;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
