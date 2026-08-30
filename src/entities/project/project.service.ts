import api from "@/shared/lib/axios";
import { PaginatedResponse } from "../employee/employee.service";

export interface Project {
  id: string;
  name: string;
  status: string;
  // ... other fields based on backend
}

export async function getProjects(params?: Record<string, any>) {
  const response = await api.get<PaginatedResponse<Project>>("/projects", { params });
  return response.data;
}
