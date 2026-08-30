import * as z from "zod";

export const BUSINESS_ROLE_OPTIONS = [
  { label: "Employee", value: "REGULAR" },
  { label: "Department Admin", value: "DEPARTMENT_ADMIN" },
  { label: "HR", value: "HR" },
  { label: "Organization Admin", value: "ORGANIZATION_ADMIN" },
] as const;

export const inviteEmployeeSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  departmentId: z.string().optional(),
  designationId: z.string().optional(),
  officeBranchId: z.string().optional(),
  businessRole: z
    .enum(["REGULAR", "DEPARTMENT_ADMIN", "HR", "ORGANIZATION_ADMIN"])
    .optional(),
});

export type InviteEmployeeFormValues = z.infer<typeof inviteEmployeeSchema>;

// The accept page: the invitee sets their password and confirms who they are.
export const acceptInvitationSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    phone: z.string().min(7, "Phone number must be at least 7 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AcceptInvitationFormValues = z.infer<typeof acceptInvitationSchema>;
