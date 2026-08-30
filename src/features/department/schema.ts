import * as z from "zod";

export const departmentSchema = z.object({
  name: z.string().min(1, "Department Name is required"),
  description: z.string().optional(),
  location: z.string().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
