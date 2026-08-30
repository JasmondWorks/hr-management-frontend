"use client";

import { useQuery } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import { payrollService } from "../api/payroll.service";

export function usePayroll(options?: CommonQueryOptions) {
  return useQuery({
    queryKey: ["payroll", options],
    queryFn: () => payrollService.getOrganizationPayroll(options),
  });
}
