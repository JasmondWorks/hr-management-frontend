import api from "@/shared/lib/axios";
import { PaginatedResponse } from "../employee/employee.service";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkInTime: string | null;
  checkOutTime: string | null;
  status: string;
  // ... other fields based on backend
  employee?: {
    firstName: string;
    lastName: string;
    designation: string;
    avatarUrl?: string;
  };
}

export async function getAttendances(params?: Record<string, any>) {
  const response = await api.get<PaginatedResponse<AttendanceRecord>>("/attendance", { params });
  return response.data;
}
