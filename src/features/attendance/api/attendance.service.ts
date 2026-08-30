import api from "@/shared/lib/axios";
import type { CommonQueryOptions, PaginationMeta } from "@/shared/api";
import { Employee } from "@/features/employee";

export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "ON_LEAVE" | "WEEKEND";

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: AttendanceStatus;
  createdAt: string;
  updatedAt: string;
  employee?: Employee & { user?: any };
}

export interface GetAttendanceResponse {
  success: boolean;
  message: string;
  data: Attendance[];
  meta: PaginationMeta;
}

export const attendanceService = {
  getOrganizationAttendance: async (options?: CommonQueryOptions): Promise<GetAttendanceResponse> => {
    const { data } = await api.get<GetAttendanceResponse>("/attendance", { params: options });
    return data;
  }
};
