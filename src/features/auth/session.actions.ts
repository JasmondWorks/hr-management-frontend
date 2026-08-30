"use server";

import { cookies } from "next/headers";
import { REFRESH_COOKIE } from "@/shared/lib/constants";

// Server-only: writing an httpOnly cookie must happen on the server. These
// actions are the ONLY place the refresh token is stored — Next.js owns the
// cookie, the backend just returns tokens in the response body.

const BACKEND_URL =
  process.env.BACKEND_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "";
const REFRESH_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function cookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: REFRESH_MAX_AGE,
  };
}

/** Persist the refresh token (returned by login) in the httpOnly cookie. */
export async function storeRefreshToken(refreshToken: string): Promise<void> {
  const store = await cookies();
  store.set(REFRESH_COOKIE, refreshToken, cookieOptions());
}

/** Clear the refresh cookie (logout). */
export async function clearRefreshToken(): Promise<void> {
  const store = await cookies();
  store.delete(REFRESH_COOKIE);
}

/**
 * Reads the httpOnly refresh cookie, exchanges it at the backend for a new
 * access token, rotates the refresh cookie, and returns the new access token.
 * Returns null when there is no valid session. Called on mount and on reload.
 */
export async function refreshSession(): Promise<string | null> {
  const store = await cookies();
  const refreshToken = store.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;

  const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  });

  if (!res.ok) {
    store.delete(REFRESH_COOKIE);
    return null;
  }

  const json = await res.json();
  const accessToken: string | undefined = json?.data?.accessToken;
  const newRefreshToken: string | undefined = json?.data?.refreshToken;

  if (newRefreshToken) {
    store.set(REFRESH_COOKIE, newRefreshToken, cookieOptions());
  }
  return accessToken ?? null;
}
