import api from "@/shared/lib/axios";
import { ApiResponse } from "@/shared/api/types";

export interface DashboardStat {
  value: number;
  delta: string;
  trend: "up" | "down";
}

export interface DashboardStatsResponse {
  stats: {
    totalEmployees: DashboardStat;
    totalApplicants: DashboardStat;
    todayAttendance: DashboardStat;
    totalProjects: DashboardStat;
  };
  chartData: Array<{
    day: string;
    segment1: number;
    segment2: number;
    segment3: number;
  }>;
  scheduleEvents: Array<{
    date: string;
    events: Array<{
      time: string;
      subtitle: string;
      title: string;
    }>;
  }>;
}

export const getAdminDashboardStats = async (): Promise<
  ApiResponse<DashboardStatsResponse>
> => {
  const { data } = await api.get("/dashboard/admin");
  return data;
};

export interface CandidateDashboardStatsResponse {
  stats: {
    applications: number;
    interviews: number;
    openJobs: number;
  };
  recentApplications: Array<{
    id: string;
    role: string;
    date: string;
    status: string;
  }>;
}

export const getCandidateDashboardStats = async (): Promise<
  ApiResponse<CandidateDashboardStatsResponse>
> => {
  const { data } = await api.get("/dashboard/candidate");
  return data;
};
