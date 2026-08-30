"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { Building2, Pencil, Trash2 } from "lucide-react";
import { Button, EmptyState, ConfirmationModal } from "@/shared/ui";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useOfficeBranches, useDeleteOfficeBranch } from "../hooks/useOfficeBranches";
import { AddOfficeBranchModal } from "./AddOfficeBranchModal";
import type { OfficeBranch } from "../api/office-branch.service";

interface OfficeBranchListProps {
  /** Hides the heading when embedded in a wizard step that has its own. */
  showHeading?: boolean;
}

export function OfficeBranchList({ showHeading = true }: OfficeBranchListProps) {
  const { data, isLoading } = useOfficeBranches({ limit: 100 });
  const remove = useDeleteOfficeBranch();
  const [editing, setEditing] = useState<OfficeBranch | undefined>();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<OfficeBranch | undefined>();

  const branches = data?.data ?? [];

  const openCreate = () => {
    setEditing(undefined);
    setIsFormOpen(true);
  };

  const openEdit = (branch: OfficeBranch) => {
    setEditing(branch);
    setIsFormOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {showHeading && (
          <h2 className="text-lg font-semibold text-foreground">Office Branches</h2>
        )}
        <Button type="button" onClick={openCreate} className="ml-auto">
          Add Branch
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading branches...</p>
      ) : branches.length === 0 ? (
        <EmptyState
          title="No office branches yet"
          description="Add the locations your organization operates from. You can attach jobs to a branch later."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {branches.map((branch) => (
            <li
              key={branch.id}
              className="flex items-start justify-between gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div className="flex items-start gap-3">
                <Building2 className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                    {branch.name}
                    {branch.isHeadquarters && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                        HQ
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {[branch.address, branch.city, branch.state, branch.country]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  aria-label={`Edit ${branch.name}`}
                  onClick={() => openEdit(branch)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label={`Delete ${branch.name}`}
                  onClick={() => setPendingDelete(branch)}
                  className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <AddOfficeBranchModal
        isOpen={isFormOpen}
        branch={editing}
        onClose={() => {
          setIsFormOpen(false);
          setEditing(undefined);
        }}
      />

      <ConfirmationModal
        isOpen={Boolean(pendingDelete)}
        onClose={() => setPendingDelete(undefined)}
        title="Delete office branch"
        message={`Delete "${pendingDelete?.name}"? This cannot be undone.`}
        confirmText="Delete"
        isLoading={remove.isPending}
        onConfirm={() => {
          if (!pendingDelete) return;
          remove.mutate(pendingDelete.id, {
            onSuccess: () => {
              toast.success("Office branch deleted");
              setPendingDelete(undefined);
            },
            // The API refuses with 409 while jobs or employees still point at
            // the branch; surface that message rather than a generic failure.
            onError: (error) =>
              toast.error(getApiErrorMessage(error, "Failed to delete office branch")),
          });
        }}
      />
    </div>
  );
}
