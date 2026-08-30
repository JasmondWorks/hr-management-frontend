"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { onboardingService } from "../api/onboarding.service";

const KEY = ["onboarding-context"] as const;

export function useOnboardingContext() {
  return useQuery({
    queryKey: KEY,
    queryFn: onboardingService.getContext,
  });
}

export function useMarkOnboardingComplete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onboardingService.markComplete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}

export function useCompleteOnboarding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: onboardingService.complete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}
