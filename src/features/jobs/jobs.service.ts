import api from "@/shared/lib/axios";
import { Job, JobPaginationResponse, JobQuery } from "./types";

export async function listJobs(query?: JobQuery): Promise<JobPaginationResponse> {
  const { data } = await api.get<JobPaginationResponse>("/jobs", {
    params: query,
  });
  return data;
}

export async function listMyJobs(query?: JobQuery): Promise<JobPaginationResponse> {
  const { data } = await api.get<JobPaginationResponse>("/jobs/mine", {
    params: query,
  });
  return data;
}

export async function getJobById(id: string): Promise<Job> {
  const { data } = await api.get<Job>(`/jobs/${id}`);
  return data;
}

export async function applyToJob(jobId: string): Promise<unknown> {
  const { data } = await api.post("/applications", { jobId });
  return data;
}

export interface CreateJobPayload {
  departmentId: string;
  name?: string;
  description: string;
  amount: string;
  // Named to match the API (`workLocation`), which never accepted the
  // `workArrangement` this previously declared.
  workLocation?: "ON_SITE" | "REMOTE" | "HYBRID";
  contractType?: "FULL_TIME" | "PART_TIME" | "CONTRACT";
  contractDuration?: string;
  designation: string;
  officeBranchId?: string;
}

// Object API mirroring the other feature services (departmentService, etc.).
export const jobsService = {
  getJobs: async (
    query?: Record<string, unknown>,
  ): Promise<JobPaginationResponse> => {
    const { data } = await api.get<JobPaginationResponse>("/jobs", {
      params: query,
    });
    return data;
  },
  getMyJobs: async (
    query?: Record<string, unknown>,
  ): Promise<JobPaginationResponse> => {
    const { data } = await api.get<JobPaginationResponse>("/jobs/mine", {
      params: query,
    });
    return data;
  },
  getJobById,
  applyToJob,
  createJob: async (payload: CreateJobPayload) => {
    const { data } = await api.post("/jobs", payload);
    return data;
  },
};
