import api from "@/shared/lib/axios";
import type { CommonQueryOptions, PaginationMeta } from "@/shared/api";

export interface OfficeBranch {
  id: string;
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode?: string | null;
  phone?: string | null;
  email?: string | null;
  isHeadquarters: boolean;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfficeBranchPayload {
  name: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  isHeadquarters?: boolean;
}

export interface GetOfficeBranchesResponse {
  success: boolean;
  message: string;
  data: OfficeBranch[];
  meta: PaginationMeta;
}

export interface GetOfficeBranchResponse {
  success: boolean;
  message: string;
  data: OfficeBranch;
}

export const officeBranchService = {
  getOfficeBranches: async (
    options?: CommonQueryOptions,
  ): Promise<GetOfficeBranchesResponse> => {
    const { data } = await api.get<GetOfficeBranchesResponse>(
      "/office-branches",
      { params: options },
    );
    return data;
  },

  getOfficeBranchById: async (id: string): Promise<GetOfficeBranchResponse> => {
    const { data } = await api.get<GetOfficeBranchResponse>(
      `/office-branches/${id}`,
    );
    return data;
  },

  createOfficeBranch: async (
    payload: OfficeBranchPayload,
  ): Promise<GetOfficeBranchResponse> => {
    const { data } = await api.post<GetOfficeBranchResponse>(
      "/office-branches",
      payload,
    );
    return data;
  },

  updateOfficeBranch: async ({
    id,
    ...payload
  }: Partial<OfficeBranchPayload> & { id: string }): Promise<GetOfficeBranchResponse> => {
    const { data } = await api.patch<GetOfficeBranchResponse>(
      `/office-branches/${id}`,
      payload,
    );
    return data;
  },

  deleteOfficeBranch: async (id: string): Promise<{ success: boolean; message: string }> => {
    const { data } = await api.delete<{ success: boolean; message: string }>(
      `/office-branches/${id}`,
    );
    return data;
  },
};
