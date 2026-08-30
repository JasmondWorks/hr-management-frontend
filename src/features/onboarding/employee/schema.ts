import * as z from "zod";

/**
 * Only what the employee knows about themselves. Department, designation, office
 * branch, business role and joining date are deliberately absent — those are set
 * by the admin on the invitation and shown read-only.
 */
export const employeeOnboardingSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().min(7, "Phone number must be at least 7 characters"),

  dateOfBirth: z.string().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional().or(z.literal("")),
  maritalStatus: z
    .enum(["SINGLE", "MARRIED", "DIVORCED", "WIDOWED"])
    .optional()
    .or(z.literal("")),

  address: z.string().optional(),
  country: z.string().optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  zipCode: z.string().optional(),

  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
});

export type EmployeeOnboardingFormValues = z.infer<
  typeof employeeOnboardingSchema
>;
