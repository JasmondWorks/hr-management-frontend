import api from "@/shared/lib/axios";
import { PaginatedResponse } from "../employee/employee.service";

export interface Application {
  id: string;
  candidateId: string;
  jobId: string;
  status: string;
  createdAt: string;
  // ... other fields based on backend
}

export async function getApplications(params?: Record<string, any>) {
  const response = await api.get<PaginatedResponse<Application>>("/applications", { params });
  return response.data;
}
