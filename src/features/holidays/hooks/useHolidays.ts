"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import { holidayService, type CreateHolidayPayload } from "../api/holiday.service";

const KEY = ["holidays"] as const;

export function useHolidays(options?: CommonQueryOptions) {
  return useQuery({
    queryKey: [...KEY, options],
    queryFn: () => holidayService.getHolidays(options),
  });
}

export function useCreateHoliday() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateHolidayPayload) =>
      holidayService.createHoliday(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: KEY }),
  });
}
