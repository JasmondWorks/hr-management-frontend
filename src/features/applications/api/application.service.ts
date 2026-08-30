import api from "@/shared/lib/axios";
import type { CommonQueryOptions, PaginationMeta } from "@/shared/api";
import { Job } from "@/features/jobs/types";

export type ApplicationStatus = "APPLIED" | "INTERVIEW" | "OFFERED" | "ACCEPTED" | "REJECTED";

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userId: string;
}

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  status: ApplicationStatus;
  appliedAt: string;
  job?: Job;
  candidate?: Candidate;
}

export interface GetApplicationsResponse {
  success: boolean;
  message: string;
  data: Application[];
  meta: PaginationMeta;
}

export const applicationService = {
  // Org admin: all applications to the organization's jobs.
  getOrganizationApplications: async (
    options?: CommonQueryOptions,
  ): Promise<GetApplicationsResponse> => {
    const { data } = await api.get<GetApplicationsResponse>("/applications", {
      params: options,
    });
    return data;
  },

  // Candidate: their own applications.
  getMyApplications: async (
    options?: CommonQueryOptions,
  ): Promise<GetApplicationsResponse> => {
    const { data } = await api.get<GetApplicationsResponse>(
      "/applications/mine",
      { params: options },
    );
    return data;
  },

  accept: async (id: string) => {
    const { data } = await api.post(`/applications/${id}/accept`);
    return data;
  },

  reject: async (id: string) => {
    const { data } = await api.post(`/applications/${id}/reject`);
    return data;
  },
};
