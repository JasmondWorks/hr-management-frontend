"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { CommonQueryOptions } from "@/shared/api";
import { departmentService } from "../api/department.service";

const KEY = ["departments"] as const;

export function useDepartments(options?: CommonQueryOptions) {
  return useQuery({
    queryKey: [...KEY, options],
    queryFn: () => departmentService.getDepartments(options),
  });
}

export function useDepartment(id: string) {
  return useQuery({
    queryKey: ["department", id],
    queryFn: () => departmentService.getDepartmentById(id),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentService.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KEY });
    },
  });
}
