"use client";

import { Building2, Briefcase, MapPin, ShieldCheck } from "lucide-react";
import type { OnboardingContext } from "../../api/onboarding.service";

const ROLE_LABELS: Record<string, string> = {
  REGULAR: "Employee",
  DEPARTMENT_ADMIN: "Department Admin",
  HR: "HR",
  ORGANIZATION_ADMIN: "Organization Admin",
};

/**
 * Read-only summary of what the organization already decided for this person.
 * Shown so they can see their department and role without being able to edit
 * them — those belong to the admin, not to the employee.
 */
export function PrefilledContextCard({
  context,
}: {
  context: OnboardingContext;
}) {
  const rows = [
    { icon: Building2, label: "Organization", value: context.organization?.name },
    { icon: Briefcase, label: "Department", value: context.department?.name },
    { icon: Briefcase, label: "Designation", value: context.designation?.name },
    { icon: MapPin, label: "Office Branch", value: context.officeBranch?.name },
    {
      icon: ShieldCheck,
      label: "Role",
      value: context.user.businessRole
        ? (ROLE_LABELS[context.user.businessRole] ?? context.user.businessRole)
        : undefined,
    },
  ].filter((r) => Boolean(r.value));

  if (rows.length === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-border bg-muted/40 p-4">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        Set by your organization
      </p>
      <dl className="grid gap-3 sm:grid-cols-2">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-2.5">
            <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-sm font-medium text-foreground">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </div>
  );
}
