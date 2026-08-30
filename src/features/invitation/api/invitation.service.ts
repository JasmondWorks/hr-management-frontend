import api from "@/shared/lib/axios";
import type { CommonQueryOptions, PaginationMeta } from "@/shared/api";

export type InvitationStatus = "PENDING" | "ACCEPTED" | "EXPIRED" | "REVOKED";
export type InvitationBusinessRole =
  | "REGULAR"
  | "DEPARTMENT_ADMIN"
  | "HR"
  | "ORGANIZATION_ADMIN";

export interface Invitation {
  id: string;
  email: string;
  organizationId: string;
  departmentId: string | null;
  designationId: string | null;
  officeBranchId: string | null;
  businessRole: InvitationBusinessRole;
  status: InvitationStatus;
  invitedById: string;
  acceptedUserId: string | null;
  acceptedAt: string | null;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvitationPayload {
  email: string;
  departmentId?: string;
  designationId?: string;
  officeBranchId?: string;
  businessRole?: InvitationBusinessRole;
}

/** Per-email outcome from a bulk invite — one bad address does not fail the batch. */
export interface BulkInvitationResult {
  email: string;
  status: "invited" | "failed";
  reason?: string;
}

/** What the public accept page shows before the account exists. */
export interface InvitationPreview {
  email: string;
  organizationName: string;
  departmentName: string | null;
  designationName: string | null;
  officeBranchName: string | null;
  businessRole: InvitationBusinessRole;
  expiresAt: string;
}

export interface AcceptInvitationPayload {
  token: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

interface Envelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type GetInvitationsResponse = Envelope<Invitation[]> & {
  meta: PaginationMeta;
};

export const invitationService = {
  getInvitations: async (
    options?: CommonQueryOptions & { status?: InvitationStatus },
  ): Promise<GetInvitationsResponse> => {
    const { data } = await api.get<GetInvitationsResponse>("/invitations", {
      params: options,
    });
    return data;
  },

  createInvitation: async (
    payload: InvitationPayload,
  ): Promise<Envelope<Invitation>> => {
    const { data } = await api.post<Envelope<Invitation>>(
      "/invitations",
      payload,
    );
    return data;
  },

  createInvitationsBulk: async (
    invitations: InvitationPayload[],
  ): Promise<Envelope<BulkInvitationResult[]>> => {
    const { data } = await api.post<Envelope<BulkInvitationResult[]>>(
      "/invitations/bulk",
      { invitations },
    );
    return data;
  },

  checkInvitationEmail: async (
    email: string,
  ): Promise<Envelope<{ success: boolean }>> => {
    const { data } = await api.post<Envelope<{ success: boolean }>>(
      "/invitations/check",
      { email },
    );
    return data;
  },

  resendInvitation: async (id: string): Promise<Envelope<Invitation>> => {
    const { data } = await api.post<Envelope<Invitation>>(
      `/invitations/${id}/resend`,
    );
    return data;
  },

  revokeInvitation: async (id: string): Promise<Envelope<null>> => {
    const { data } = await api.delete<Envelope<null>>(`/invitations/${id}`);
    return data;
  },

  // --- public: no auth, the invitee has no account yet ---

  verifyInvitation: async (
    token: string,
  ): Promise<Envelope<InvitationPreview>> => {
    const { data } = await api.get<Envelope<InvitationPreview>>(
      "/invitations/verify",
      { params: { token } },
    );
    return data;
  },

  acceptInvitation: async (payload: AcceptInvitationPayload) => {
    const { data } = await api.post<
      Envelope<{
        user: {
          id: string;
          email: string;
          role: "CANDIDATE" | "EMPLOYEE" | "ADMIN";
          businessRole: InvitationBusinessRole | null;
          organizationId: string | null;
          firstName: string;
          lastName: string;
        };
        accessToken: string;
        refreshToken: string;
      }>
    >("/invitations/accept", payload);
    return data;
  },
};
