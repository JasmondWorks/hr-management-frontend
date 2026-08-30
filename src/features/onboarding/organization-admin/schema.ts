import * as z from "zod";

export const organizationOnboardingSchema = z.object({
  name: z.string().min(1, "Organization Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone Number is required"),
  
  address: z.string().min(1, "Street Address is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State / Province is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "ZIP / Postal Code is required"),
  
  website: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional(),

  invitations: z.array(
    z.object({
      email: z.string().email(),
      departmentId: z.string().optional(),
      officeBranchId: z.string().optional(),
      businessRole: z.string(),
    })
  ).optional(),
});

export type OrganizationOnboardingFormValues = z.infer<
  typeof organizationOnboardingSchema
>;
