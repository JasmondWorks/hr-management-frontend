import api from "@/shared/lib/axios";
import type { CommonQueryOptions, PaginationMeta } from "@/shared/api";
import { Employee } from "@/features/employee";

export type PayrollStatus = "PENDING" | "PAID" | "UNPAID";

export interface Payroll {
  id: string;
  employeeId: string;
  month: number;
  year: number;
  amount: number;
  status: PayrollStatus;
  createdAt: string;
  updatedAt: string;
  employee?: Employee & { user?: any; salary?: number };
}

export interface GetPayrollResponse {
  success: boolean;
  message: string;
  data: Payroll[];
  meta: PaginationMeta;
}

export const payrollService = {
  getOrganizationPayroll: async (options?: CommonQueryOptions): Promise<GetPayrollResponse> => {
    const { data } = await api.get<GetPayrollResponse>("/payroll", { params: options });
    return data;
  }
};
