"use client";

import { useQuery } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import { attendanceService } from "../api/attendance.service";

export function useAttendance(options?: CommonQueryOptions) {
  return useQuery({
    queryKey: ["attendance", options],
    queryFn: () => attendanceService.getOrganizationAttendance(options),
  });
}
