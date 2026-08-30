"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import { officeBranchService } from "../api/office-branch.service";

const KEY = ["office-branches"] as const;

export function useOfficeBranches(options?: CommonQueryOptions) {
  return useQuery({
    queryKey: [...KEY, options],
    queryFn: () => officeBranchService.getOfficeBranches(options),
  });
}

export function useOfficeBranch(id: string) {
  return useQuery({
    queryKey: ["office-branch", id],
    queryFn: () => officeBranchService.getOfficeBranchById(id),
    enabled: !!id,
  });
}

export function useCreateOfficeBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: officeBranchService.createOfficeBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useUpdateOfficeBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: officeBranchService.updateOfficeBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useDeleteOfficeBranch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: officeBranchService.deleteOfficeBranch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}
