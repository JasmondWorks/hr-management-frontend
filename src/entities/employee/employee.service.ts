import api from "@/shared/lib/axios";

export interface PaginatedResponse<T> {
  message: string;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  departmentId?: string;
  designation?: string;
  salary?: number;
  // ... other fields based on backend
}

export async function getEmployees(params?: Record<string, any>) {
  const response = await api.get<PaginatedResponse<Employee>>("/employees", { params });
  return response.data;
}
