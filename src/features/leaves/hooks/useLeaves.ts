"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import { leaveService, type RequestLeavePayload } from "../api/leaves.service";

const KEY = ["leaves"] as const;

export function useLeaves(
  scope: "org" | "mine",
  options?: CommonQueryOptions,
) {
  return useQuery({
    queryKey: [...KEY, scope, options],
    queryFn: () =>
      scope === "org"
        ? leaveService.getOrganizationLeaves(options)
        : leaveService.getMyLeaves(options),
  });
}

export function useRequestLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RequestLeavePayload) =>
      leaveService.requestLeave(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useApproveLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveService.approve(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRejectLeave() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leaveService.reject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
