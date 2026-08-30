import { useQuery } from "@tanstack/react-query";
import { organizationService } from "@/entities/organization/organization.service";

export function useMyOrganization() {
  return useQuery({
    queryKey: ["organization", "mine"],
    queryFn: () => organizationService.getMine(),
    retry: false,
  });
}
