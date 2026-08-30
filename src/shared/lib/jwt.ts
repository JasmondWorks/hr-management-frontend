import type { Role, BusinessRole } from "./constants";

// Claims embedded in the backend access token (see backend TokenPayload).
export interface JwtClaims {
  userId: string;
  email: string;
  role: Role;
  businessRole: BusinessRole | null;
  organizationId: string | null;
  // False until every step of the user's onboarding flow is finished. Drives the
  // onboarding gate in proxy.ts.
  isOnboarded?: boolean;
  // The employee's department, or null while an admin has not placed them in
  // one. Regular staff are held on /no-department until it is set.
  departmentId?: string | null;
  iat?: number;
  exp?: number;
}

// Decodes a JWT payload without verifying the signature (verification happens
// server-side). Used to derive the current user's identity/roles from the
// in-memory access token. Returns null on malformed input.
export function decodeToken(token: string): JwtClaims | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof atob === "function"
        ? atob(normalized)
        : Buffer.from(normalized, "base64").toString("utf-8");
    return JSON.parse(json) as JwtClaims;
  } catch {
    return null;
  }
}
