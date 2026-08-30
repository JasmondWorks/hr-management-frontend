import { useQuery } from "@tanstack/react-query";
import { leaveService } from "./leaves.service";

export function useLeaves(params?: Record<string, any>) {
  return useQuery({
    queryKey: ["leaves", params],
    queryFn: () => leaveService.getOrganizationLeaves(params),
  });
}
