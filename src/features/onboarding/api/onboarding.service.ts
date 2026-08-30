import api from "@/shared/lib/axios";

export interface OnboardingNamedRef {
  id: string;
  name: string;
}

/**
 * The org-side context an admin already decided for this employee, plus whatever
 * personal details they have saved. The org-side block is displayed read-only —
 * the employee never types their own department or role.
 */
export interface OnboardingContext {
  isOnboarded: boolean;
  onboardedAt: string | null;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    businessRole: string | null;
  };
  organization: OnboardingNamedRef | null;
  department: OnboardingNamedRef | null;
  designation: OnboardingNamedRef | null;
  officeBranch: OnboardingNamedRef | null;
  joiningDate: string | null;
  profile: EmployeeProfile | null;
}

export interface EmployeeProfile {
  id: string;
  dateOfBirth: string | null;
  gender: "MALE" | "FEMALE" | "OTHER" | null;
  maritalStatus: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED" | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zipCode: string | null;
  avatarUrl: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;
}

export interface CompleteOnboardingPayload {
  firstName: string;
  lastName: string;
  phone: string;
  dateOfBirth?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  maritalStatus?: "SINGLE" | "MARRIED" | "DIVORCED" | "WIDOWED";
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  avatarUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
}

interface OnboardingResponse {
  success: boolean;
  message: string;
  data: OnboardingContext;
}

export const onboardingService = {
  getContext: async (): Promise<OnboardingResponse> => {
    const { data } = await api.get<OnboardingResponse>("/me/onboarding");
    return data;
  },

  /** Finishes a flow that has no personal-details form (the admin wizard). */
  markComplete: async (): Promise<OnboardingResponse> => {
    const { data } = await api.post<OnboardingResponse>(
      "/me/onboarding/complete",
    );
    return data;
  },

  complete: async (
    payload: CompleteOnboardingPayload,
  ): Promise<OnboardingResponse> => {
    const { data } = await api.patch<OnboardingResponse>(
      "/me/onboarding",
      payload,
    );
    return data;
  },
};
