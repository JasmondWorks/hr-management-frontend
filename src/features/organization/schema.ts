import { z } from "zod";

export const organizationSettingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zipCode: z.string().min(1, "Zip code is required"),
  logoUrl: z.string().optional().nullable(),
  websiteUrl: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  attendanceCheckOutTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be in 24h HH:MM format"),
});

export type OrganizationSettingsValues = z.infer<typeof organizationSettingsSchema>;
