import { useMutation, useQueryClient } from "@tanstack/react-query";
import { organizationService } from "@/entities/organization/organization.service";
import { OrganizationPayload } from "@/entities/organization/organization.types";
import { refreshAccessToken } from "@/shared/lib/axios";
import { ROUTES } from "@/shared/lib/constants";
import toast from "react-hot-toast";

import { getApiErrorMessage } from "@/shared/lib/api-error";

interface UseCreateOrganizationOptions {
  /**
   * Where to go once the organization exists. The onboarding wizard passes
   * "stay" because it has further steps (office branches, invitations) that
   * need the new organizationId — a hard redirect would abandon them.
   */
  onSettled?: "redirect" | "stay";
}

export function useCreateOrganization(
  { onSettled = "redirect" }: UseCreateOrganizationOptions = {},
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: OrganizationPayload) =>
      organizationService.createOrganization(payload),
    onSuccess: async () => {
      toast.success("Organization created successfully");
      // Must happen before anything else is requested: the new organizationId
      // only reaches the client by minting a fresh token, and every subsequent
      // org-scoped call is authorized from that claim.
      await refreshAccessToken();
      queryClient.invalidateQueries();
      if (onSettled === "redirect") {
        window.location.href = ROUTES.dashboard;
      }
    },
    onError: (error: any) => {
      toast.error(getApiErrorMessage(error, "Failed to create organization"));
    },
  });
}
