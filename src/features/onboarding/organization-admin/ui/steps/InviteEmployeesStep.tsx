"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Mail, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { Button, InputField, SelectField } from "@/shared/ui";
import { useDepartments } from "@/features/department";
import { useOfficeBranches } from "@/features/office-branch";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import {
  BUSINESS_ROLE_OPTIONS,
  type InvitationBusinessRole,
  useCheckInvitationEmail,
} from "@/features/invitation";
import type { OrganizationOnboardingFormValues } from "../../schema";

interface InviteRow {
  email: string;
  departmentId: string;
  officeBranchId: string;
  businessRole: InvitationBusinessRole;
}

const emptyRow = (): InviteRow => ({
  email: "",
  departmentId: "",
  officeBranchId: "",
  businessRole: "REGULAR",
});

/**
 * Validates and stages an invitation for a single employee in the local form state,
 * displaying all staged invitations below with the ability to remove them.
 * Actual sending happens in the parent component upon finishing setup.
 */
export function InviteEmployeesStep() {
  const { data: deptData } = useDepartments({ limit: 100 });
  const { data: branchData } = useOfficeBranches({ limit: 100 });

  const checkEmail = useCheckInvitationEmail();

  const { watch, setValue } =
    useFormContext<OrganizationOnboardingFormValues>();
  const stagedInvitations = watch("invitations") || [];

  const [form, setForm] = useState(emptyRow());

  const departmentOptions = (deptData?.data ?? []).map((d) => ({
    label: d.name,
    value: d.id,
  }));
  const branchOptions = (branchData?.data ?? []).map((b) => ({
    label: b.isHeadquarters ? `${b.name} (HQ)` : b.name,
    value: b.id,
  }));

  const update = (patch: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const stageInvite = async () => {
    const email = form.email.trim();
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (
      stagedInvitations.some(
        (inv) => inv.email.toLowerCase() === email.toLowerCase(),
      )
    ) {
      toast.error("This email is already in your staging list.");
      return;
    }

    try {
      await checkEmail.mutateAsync(email);

      setValue(
        "invitations",
        [
          ...stagedInvitations,
          {
            email,
            departmentId: form.departmentId || undefined,
            officeBranchId: form.officeBranchId || undefined,
            businessRole: form.businessRole,
          },
        ],
        { shouldValidate: true },
      );

      toast.success("Added to list");
      setForm(emptyRow());
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to validate email"));
    }
  };

  const removeStagedInvite = (emailToRemove: string) => {
    setValue(
      "invitations",
      stagedInvitations.filter((inv) => inv.email !== emailToRemove),
      { shouldValidate: true },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Invite your team
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Each person gets an email with a link to set their password and fill
          in their own details. You can skip this and invite people later.
        </p>
      </div>

      <div className="flex flex-col gap-4 py-4 relative">
        <div className="w-full">
          <InputField
            label="Email"
            type="email"
            placeholder="name@company.com"
            value={form.email}
            onChange={(e) => update({ email: e.target.value })}
          />
        </div>
        <div className="w-full">
          <SelectField
            label="Department"
            placeholder="Optional"
            options={departmentOptions}
            value={form.departmentId}
            onChange={(e) => update({ departmentId: e.target.value })}
          />
        </div>
        <div className="w-full">
          <SelectField
            label="Branch"
            placeholder="Optional"
            options={branchOptions}
            value={form.officeBranchId}
            onChange={(e) => update({ officeBranchId: e.target.value })}
          />
        </div>
        <div className="w-full">
          <SelectField
            label="Role"
            options={[...BUSINESS_ROLE_OPTIONS]}
            value={form.businessRole}
            onChange={(e) =>
              update({
                businessRole: e.target.value as InvitationBusinessRole,
              })
            }
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            onClick={stageInvite}
            disabled={checkEmail.isPending}
          >
            {checkEmail.isPending ? "Validating..." : "Add to list"}
          </Button>
        </div>
      </div>

      {stagedInvitations.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-sm font-medium text-foreground">
            Staged Invitations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stagedInvitations.map((inv) => {
              const deptName = departmentOptions.find(
                (d) => d.value === inv.departmentId,
              )?.label;
              const branchName = branchOptions.find(
                (b) => b.value === inv.officeBranchId,
              )?.label;
              const roleDisplay = inv.businessRole
                .replace(/_/g, " ")
                .toLowerCase();

              const meta = [
                deptName,
                branchName,
                roleDisplay.charAt(0).toUpperCase() + roleDisplay.slice(1),
              ]
                .filter(Boolean)
                .join(" • ");

              return (
                <div
                  key={inv.email}
                  className="flex items-center justify-between p-4 border border-border rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="flex items-center justify-center shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-medium text-foreground truncate block">
                        {inv.email}
                      </span>
                      <span className="text-xs text-muted-foreground mt-0.5 truncate block">
                        {meta}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeStagedInvite(inv.email)}
                    className="p-2 ml-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors shrink-0"
                    title="Remove invitation"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
