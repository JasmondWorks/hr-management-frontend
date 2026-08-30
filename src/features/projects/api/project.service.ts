import api from "@/shared/lib/axios";
import type { CommonQueryOptions, PaginationMeta } from "@/shared/api";

export type ProjectStatus =
  | "PLANNED"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED"
  | "CANCELLED";

export interface Project {
  id: string;
  name: string;
  startDate: string;
  finishDate: string | null;
  status: ProjectStatus;
  timeline: string | null;
  organizationId: string;
  createdById: string;
  collaborators?: { id: string; userId: string }[];
}

export interface GetProjectsResponse {
  success: boolean;
  message: string;
  data: Project[];
  meta: PaginationMeta;
}

export interface GetProjectResponse {
  success: boolean;
  message: string;
  data: Project;
}

export interface CreateProjectPayload {
  name: string;
  startDate: string;
  finishDate?: string;
  timeline?: string;
}

export const projectService = {
  getProjects: async (
    options?: CommonQueryOptions,
  ): Promise<GetProjectsResponse> => {
    const { data } = await api.get<GetProjectsResponse>("/projects", {
      params: options,
    });
    return data;
  },
  getMyProjects: async (
    options?: CommonQueryOptions,
  ): Promise<GetProjectsResponse> => {
    const { data } = await api.get<GetProjectsResponse>("/projects/mine", {
      params: options,
    });
    return data;
  },
  getById: async (id: string): Promise<GetProjectResponse> => {
    const { data } = await api.get<GetProjectResponse>(`/projects/${id}`);
    return data;
  },
  createProject: async (payload: CreateProjectPayload) => {
    const { data } = await api.post("/projects", payload);
    return data;
  },
  updateStatus: async (id: string, status: ProjectStatus) => {
    const { data } = await api.patch(`/projects/${id}/status`, { status });
    return data;
  },
};
