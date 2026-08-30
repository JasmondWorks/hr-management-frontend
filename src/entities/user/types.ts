import type { Role, BusinessRole } from "@/shared/lib/constants";

// Full user profile as returned by the backend (e.g. in the login response).
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: Role;
  businessRole: BusinessRole | null;
  organizationId: string | null;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Minimal identity derived from the access token's claims. Always available
// while authenticated (even after a reload, before the full profile is loaded).
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  businessRole: BusinessRole | null;
  organizationId: string | null;
}
