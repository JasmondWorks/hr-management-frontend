import { useCrud } from "@/shared/hooks/useCrud";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/shared/lib/axios";
import { Employee, UpdateEmployeeDto } from "../types";


// `useCreate` is deliberately not re-exported: employees are no longer created
// directly. They arrive by invitation (POST /invitations), and the backend route
// this would have called has been removed.
export const {
  useFindAll: useEmployees,
  useFindOne: useEmployee,
  useUpdate: useUpdateEmployee,
  useDelete: useDeleteEmployee,
} = useCrud<Employee, UpdateEmployeeDto, UpdateEmployeeDto>({
  baseQueryKey: ["employees"],
  endpoint: "/employees",
});

export function useUpdateEmployeeRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, businessRole }: { id: string; businessRole: string }) => {
      const { data } = await api.patch(`/employees/${id}/business-role`, { businessRole });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employees", variables.id] });
    },
  });
}

export function useAssignEmployeeDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, departmentId }: { id: string; departmentId: string | null }) => {
      const { data } = await api.patch(`/employees/${id}/department`, { departmentId });
      return data;
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["employees", variables.id] });
    },
  });
}
