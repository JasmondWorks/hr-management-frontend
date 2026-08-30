import api from "@/shared/lib/axios";
import type { ApiResponse } from "@/shared/api";
import { User } from "./types";

// Returns the full backend envelope (see shared/api/types).

export async function getUsers(): Promise<ApiResponse<User[]>> {
  const { data } = await api.get<ApiResponse<User[]>>("/users");
  return data;
}

export async function getUser(id: string): Promise<ApiResponse<User>> {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
  return data;
}
