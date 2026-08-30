import * as z from "zod";

export const editProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Mobile number is required"),
  dob: z.string().optional(),
  maritalStatus: z.string().optional(),
  gender: z.string().optional(),
  country: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
});

export type EditProfileFormValues = z.infer<typeof editProfileSchema>;
