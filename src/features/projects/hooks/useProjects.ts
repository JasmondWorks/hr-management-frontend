"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import {
  projectService,
  type CreateProjectPayload,
  type ProjectStatus,
} from "../api/project.service";

const KEY = ["projects"] as const;

export function useProjects(
  scope: "org" | "mine",
  options?: CommonQueryOptions,
) {
  return useQuery({
    queryKey: [...KEY, scope, options],
    queryFn: () =>
      scope === "org"
        ? projectService.getProjects(options)
        : projectService.getMyProjects(options),
  });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => projectService.getById(id),
    enabled: !!id,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProjectPayload) =>
      projectService.createProject(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}

export function useUpdateProjectStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProjectStatus }) =>
      projectService.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
