"use client";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, InputField, SelectField, CheckboxField } from "@/shared/ui";
import { useDepartments } from "@/features/department";
import { useOfficeBranches } from "@/features/office-branch";
import { useCreateJob } from "@/features/jobs/hooks/useJobs";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { jobSchema, type JobFormValues } from "../schema";

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddJobModal({ isOpen, onClose }: AddJobModalProps) {
  const { data: deptData } = useDepartments({ limit: 100 });
  const departments = deptData?.data ?? [];
  const { data: branchData } = useOfficeBranches({ limit: 100 });
  const officeBranches = branchData?.data ?? [];
  const create = useCreateJob();

  const {
    register,
    handleSubmit,
    watch,
    resetField,
    formState: { errors },
    reset,
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobSchema),
    mode: "onChange",
    defaultValues: {
      departmentId: "",
      name: "",
      designation: "",
      description: "",
      amount: "",
      workLocation: "ON_SITE",
      contractType: "FULL_TIME",
      contractDuration: "",
      hasOfficeBranch: false,
      officeBranchId: "",
    },
  });

  const watchContractType = watch("contractType");
  const watchHasOfficeBranch = watch("hasOfficeBranch");

  const onSubmit = (data: JobFormValues) => {
    create.mutate(
      {
        departmentId: data.departmentId,
        name: data.name,
        designation: data.designation,
        description: data.description,
        amount: data.amount,
        workLocation: data.workLocation,
        contractType: data.contractType,
        contractDuration: data.contractDuration,
        // Only associate a branch when the box is ticked, so unticking it after
        // picking one does not smuggle the id through.
        officeBranchId: data.hasOfficeBranch ? data.officeBranchId : undefined,
      },
      {
        onSuccess: () => {
          toast.success("Job created");
          reset();
          onClose();
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create job")),
      },
    );
  };

  const departmentOptions = departments.map((d) => ({
    label: d.name,
    value: d.id,
  }));

  const officeBranchOptions = officeBranches.map((b) => ({
    label: b.isHeadquarters ? `${b.name} (HQ)` : b.name,
    value: b.id,
  }));

  return (
    <Modal title="Add New Job" isOpen={isOpen} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <SelectField
          label="Department"
          placeholder="Select Department"
          options={departmentOptions}
          {...register("departmentId")}
          value={watch("departmentId")}
          errorMessage={errors.departmentId?.message}
        />

        <InputField
          label="Job Title"
          placeholder="Enter Job Title"
          {...register("name")}
          errorMessage={errors.name?.message}
        />
        <InputField
          label="Designation"
          placeholder="e.g. Senior Engineer"
          {...register("designation")}
          errorMessage={errors.designation?.message}
        />
        <InputField
          label="Description"
          placeholder="Role description"
          {...register("description")}
          errorMessage={errors.description?.message}
        />
        <InputField
          label="Amount"
          placeholder="Enter Amount"
          {...register("amount")}
          errorMessage={errors.amount?.message}
        />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <div className="flex items-center gap-6 text-sm">
            {(
              [
                ["ON_SITE", "On Site"],
                ["REMOTE", "Remote"],
                ["HYBRID", "Hybrid"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={value}
                  {...register("workLocation")}
                />
                {label}
              </label>
            ))}
          </div>
          {errors.workLocation && (
            <p className="text-xs text-destructive">{errors.workLocation.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">Contract Type</label>
          <div className="flex items-center gap-6 text-sm">
            {(
              [
                ["FULL_TIME", "Full Time"],
                ["PART_TIME", "Part Time"],
                ["CONTRACT", "Contract"],
              ] as const
            ).map(([value, label]) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="radio"
                  value={value}
                  {...register("contractType")}
                />
                {label}
              </label>
            ))}
          </div>
          {errors.contractType && (
            <p className="text-xs text-destructive">{errors.contractType.message}</p>
          )}
        </div>

        {watchContractType === "CONTRACT" && (
          <InputField
            label="Contract Duration"
            placeholder="e.g. 6 Months"
            {...register("contractDuration")}
            errorMessage={errors.contractDuration?.message}
          />
        )}

        <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
          <CheckboxField
            label="This job is at a specific office branch"
            description="Leave unticked if the role is not tied to one of your locations."
            {...register("hasOfficeBranch", {
              // Clear the selection when the box is unticked so a stale id never
              // lingers in form state.
              onChange: (e) => {
                if (!e.target.checked) resetField("officeBranchId");
              },
            })}
            errorMessage={errors.hasOfficeBranch?.message}
          />

          {watchHasOfficeBranch &&
            (officeBranchOptions.length > 0 ? (
              <SelectField
                label="Office Branch"
                placeholder="Select Office Branch"
                options={officeBranchOptions}
                {...register("officeBranchId")}
                value={watch("officeBranchId")}
                errorMessage={errors.officeBranchId?.message}
              />
            ) : (
              <p className="text-xs text-muted-foreground">
                No office branches yet. Add one from your organization settings first.
              </p>
            ))}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Adding…" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default AddJobModal;
