import api from "@/shared/lib/axios";
import type { ApiResponse, CommonQueryOptions, PaginationMeta } from "@/shared/api";
// Assuming Employee/User are used, we can define a simplified version here for now
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role?: string;
  businessRole?: string | null;
}

export interface Employee {
  id: string;
  userId: string;
  departmentId: string | null;
  salary?: number | null;
}

export interface DepartmentEmployee extends Employee {
  user: User;
}

export interface Department {
  id: string;
  name: string;
  description?: string | null;
  location?: string | null;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  employees: DepartmentEmployee[];
}

export interface GetDepartmentsResponse {
  success: boolean;
  message: string;
  data: Department[];
  meta: PaginationMeta;
}

export interface GetDepartmentResponse {
  success: boolean;
  message: string;
  data: Department;
}

export const departmentService = {
  getDepartments: async (options?: CommonQueryOptions): Promise<GetDepartmentsResponse> => {
    const { data } = await api.get<GetDepartmentsResponse>("/departments", { params: options });
    return data;
  },

  getDepartmentById: async (id: string): Promise<GetDepartmentResponse> => {
    const { data } = await api.get<GetDepartmentResponse>(`/departments/${id}`);
    return data;
  },

  createDepartment: async (payload: { name: string; description?: string; location?: string }): Promise<GetDepartmentResponse> => {
    const { data } = await api.post<GetDepartmentResponse>("/departments", payload);
    return data;
  }
};
