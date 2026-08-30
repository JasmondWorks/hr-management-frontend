"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import { applicationService } from "../api/application.service";

const KEY = ["applications"] as const;

export function useApplications(
  scope: "org" | "mine",
  options?: CommonQueryOptions,
) {
  return useQuery({
    queryKey: [...KEY, scope, options],
    queryFn: () =>
      scope === "org"
        ? applicationService.getOrganizationApplications(options)
        : applicationService.getMyApplications(options),
  });
}

export function useAcceptApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationService.accept(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useRejectApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => applicationService.reject(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
