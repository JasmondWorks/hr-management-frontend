import { ApiResponse } from "@/shared/api/types";
import { User } from "@/entities/user/types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginData {
  user: User;
  accessToken: string;
  // Returned in the body; the client hands this to the storeRefreshToken
  // server action, which persists it in an httpOnly cookie.
  refreshToken: string;
}
export type LoginResponse = ApiResponse<LoginData>;

// Same body for organization-admin, employee and candidate registration.
export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

// Account type a public sign-up can create.
export type RegisterRole = "organization-admin" | "candidate";

export type RegisterUserResponse = ApiResponse<User>;
export type RegisterCandidateResponse = ApiResponse<{
  user: User;
  candidate: { id: string; email: string };
}>;

export type RefreshResponse = ApiResponse<{ accessToken: string }>;
