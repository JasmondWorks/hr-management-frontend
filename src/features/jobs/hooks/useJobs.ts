"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobsService, type CreateJobPayload } from "../jobs.service";
import { JobQuery } from "../types";

const KEY = ["jobs"] as const;

export function useJobs(query?: JobQuery) {
  return useQuery({
    queryKey: [...KEY, query],
    queryFn: () => jobsService.getMyJobs(query as Record<string, unknown>),
  });
}

export function usePublicJobs(query?: JobQuery) {
  return useQuery({
    queryKey: ["public-jobs", query],
    queryFn: () => jobsService.getJobs(query as Record<string, unknown>),
  });
}

export function useJob(id: string) {
  return useQuery({
    queryKey: [...KEY, "detail", id],
    queryFn: () => jobsService.getJobById(id),
    enabled: !!id,
  });
}

export function useCreateJob() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateJobPayload) => jobsService.createJob(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
