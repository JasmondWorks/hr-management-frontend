import api from "@/shared/lib/axios";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterUserResponse,
  RegisterCandidateResponse,
} from "./types";

// Direct calls to the dedicated backend. Services return the FULL backend
// envelope ({ success, message, data, meta }). Refresh-token cookie handling is
// done by the server actions in session.actions.ts, not here.

export async function login(body: LoginRequest): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/auth/login", body);
  return data;
}

export async function registerOrganizationAdmin(
  body: RegisterRequest,
): Promise<RegisterUserResponse> {
  const { data } = await api.post<RegisterUserResponse>(
    "/auth/register/organization-admin",
    body,
  );
  return data;
}

export async function registerCandidate(
  body: RegisterRequest,
): Promise<RegisterCandidateResponse> {
  const { data } = await api.post<RegisterCandidateResponse>(
    "/auth/register/candidate",
    body,
  );
  return data;
}

// Employee accounts are created by an org admin (backend guards this route).
export async function registerEmployee(
  body: RegisterRequest,
): Promise<RegisterUserResponse> {
  const { data } = await api.post<RegisterUserResponse>(
    "/auth/register/employee",
    body,
  );
  return data;
}
