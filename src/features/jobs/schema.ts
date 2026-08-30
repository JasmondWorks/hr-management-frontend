import * as z from "zod";

export const jobSchema = z.object({
  departmentId: z.string().min(1, "Department is required"),
  name: z.string().min(1, "Job Title is required"),
  designation: z.string().min(1, "Designation is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().min(1, "Amount is required"),
  workLocation: z.enum(["ON_SITE", "REMOTE", "HYBRID"]),
  contractType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]),
  contractDuration: z.string().optional(),
  // Ticking the box reveals the branch select; the id is only required once it is.
  hasOfficeBranch: z.boolean(),
  officeBranchId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.contractType === "CONTRACT" && !data.contractDuration) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Contract duration is required for contractors",
      path: ["contractDuration"],
    });
  }
  if (data.hasOfficeBranch && !data.officeBranchId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Select an office branch",
      path: ["officeBranchId"],
    });
  }
});

export type JobFormValues = z.infer<typeof jobSchema>;
