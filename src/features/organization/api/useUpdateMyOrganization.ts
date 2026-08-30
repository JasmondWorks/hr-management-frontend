import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/entities/organization/organization.service";
import { OrganizationPayload } from "@/entities/organization/organization.types";
import toast from "react-hot-toast";

export function useUpdateMyOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<OrganizationPayload>) =>
      organizationService.updateMine(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["organization", "mine"] });
      toast.success(res.message || "Organization updated successfully");
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.error?.message ||
        "Failed to update organization";
      toast.error(message);
    },
  });
}
