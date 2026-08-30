"use client";

import { OfficeBranchList } from "@/features/office-branch";

/**
 * Runs after the organization exists — branches are created immediately against
 * the live org rather than being held in wizard state, so re-entering the step
 * shows what is already saved.
 */
export function OfficeBranchesStep() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-semibold text-foreground">
          Add your office branches
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          The locations your organization operates from. You can attach jobs and
          employees to a branch later — and add more at any time.
        </p>
      </div>

      <OfficeBranchList showHeading={false} />
    </div>
  );
}
