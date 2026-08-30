import { useQuery } from "@tanstack/react-query";
import { getAdminDashboardStats, getCandidateDashboardStats } from "../api/dashboard.service";

export const useAdminDashboardStats = () => {
  return useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: getAdminDashboardStats,
  });
};

export const useCandidateDashboardStats = () => {
  return useQuery({
    queryKey: ["candidateDashboardStats"],
    queryFn: getCandidateDashboardStats,
  });
};
