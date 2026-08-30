import api from "@/shared/lib/axios";
import { Organization, OrganizationPayload } from "./organization.types";

interface MyOrganizationResponse {
  success: boolean;
  message: string;
  data: Organization | null;
}

export const organizationService = {
  createOrganization: async (payload: OrganizationPayload): Promise<Organization> => {
    const response = await api.post<Organization>("/organizations", payload);
    return response.data;
  },

  // Returns the organization the logged-in user belongs to (or null if none).
  getMine: async (): Promise<MyOrganizationResponse> => {
    const { data } = await api.get<MyOrganizationResponse>("/organizations/mine");
    return data;
  },

  updateMine: async (payload: Partial<OrganizationPayload>): Promise<MyOrganizationResponse> => {
    const { data } = await api.patch<MyOrganizationResponse>("/organizations/mine", payload);
    return data;
  },
};
