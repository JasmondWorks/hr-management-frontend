"use client";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, InputField, SelectField } from "@/shared/ui";
import { useDepartments } from "@/features/department";
import { useOfficeBranches } from "@/features/office-branch";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useCreateInvitation } from "../hooks/useInvitations";
import {
  inviteEmployeeSchema,
  BUSINESS_ROLE_OPTIONS,
  type InviteEmployeeFormValues,
} from "../schema";

interface InviteEmployeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Replaces the old multi-step "add employee" form. The admin supplies only the
 * email plus the org-side context; the employee fills in everything personal
 * themselves after following the emailed link.
 */
export function InviteEmployeeModal({
  isOpen,
  onClose,
}: InviteEmployeeModalProps) {
  const { data: deptData } = useDepartments({ limit: 100 });
  const { data: branchData } = useOfficeBranches({ limit: 100 });
  const invite = useCreateInvitation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<InviteEmployeeFormValues>({
    resolver: zodResolver(inviteEmployeeSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      departmentId: "",
      officeBranchId: "",
      businessRole: "REGULAR",
    },
  });

  const departmentOptions = (deptData?.data ?? []).map((d) => ({
    label: d.name,
    value: d.id,
  }));

  const branchOptions = (branchData?.data ?? []).map((b) => ({
    label: b.isHeadquarters ? `${b.name} (HQ)` : b.name,
    value: b.id,
  }));

  const onSubmit = (values: InviteEmployeeFormValues) => {
    invite.mutate(
      {
        email: values.email,
        // Empty selects come through as ""; the API wants them absent.
        departmentId: values.departmentId || undefined,
        officeBranchId: values.officeBranchId || undefined,
        businessRole: values.businessRole || undefined,
      },
      {
        onSuccess: () => {
          toast.success(`Invitation sent to ${values.email}`);
          reset();
          onClose();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to send invitation")),
      },
    );
  };

  return (
    <Modal title="Invite an Employee" isOpen={isOpen} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <p className="text-sm text-muted-foreground">
          They&apos;ll get an email with a link to set their password and fill in
          their own details. The link expires in 7 days.
        </p>

        <InputField
          label="Email Address"
          type="email"
          placeholder="e.g. new.hire@company.com"
          {...register("email")}
          errorMessage={errors.email?.message}
        />

        <SelectField
          label="Department (optional)"
          placeholder="Select Department"
          options={departmentOptions}
          {...register("departmentId")}
          value={watch("departmentId")}
          errorMessage={errors.departmentId?.message}
        />

        <SelectField
          label="Office Branch (optional)"
          placeholder="Select Office Branch"
          options={branchOptions}
          {...register("officeBranchId")}
          value={watch("officeBranchId")}
          errorMessage={errors.officeBranchId?.message}
        />

        <SelectField
          label="Role"
          placeholder="Select Role"
          options={[...BUSINESS_ROLE_OPTIONS]}
          {...register("businessRole")}
          value={watch("businessRole")}
          errorMessage={errors.businessRole?.message}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={invite.isPending}>
            {invite.isPending ? "Sending..." : "Send Invitation"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
