import api from "@/shared/lib/axios";
import type { CommonQueryOptions, PaginationMeta } from "@/shared/api";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";
export type LeaveType = "ANNUAL" | "SICK" | "UNPAID" | "OTHER";

export interface Leave {
  id: string;
  employeeId: string;
  startDate: string;
  endDate: string;
  status: LeaveStatus;
  leaveType: LeaveType;
  leaveReason: string;
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    user?: { firstName: string; lastName: string };
  };
}

export interface GetLeavesResponse {
  success: boolean;
  message: string;
  data: Leave[];
  meta: PaginationMeta;
}

export interface RequestLeavePayload {
  startDate: string;
  endDate: string;
  leaveType: LeaveType;
  leaveReason: string;
}

export const leaveService = {
  getOrganizationLeaves: async (
    options?: CommonQueryOptions,
  ): Promise<GetLeavesResponse> => {
    const { data } = await api.get<GetLeavesResponse>("/leaves", {
      params: options,
    });
    return data;
  },
  getMyLeaves: async (
    options?: CommonQueryOptions,
  ): Promise<GetLeavesResponse> => {
    const { data } = await api.get<GetLeavesResponse>("/leaves/mine", {
      params: options,
    });
    return data;
  },
  requestLeave: async (payload: RequestLeavePayload) => {
    const { data } = await api.post("/leaves", payload);
    return data;
  },
  approve: async (id: string) => {
    const { data } = await api.patch(`/leaves/${id}/approve`);
    return data;
  },
  reject: async (id: string) => {
    const { data } = await api.patch(`/leaves/${id}/reject`);
    return data;
  },
};
