"use client";

import toast from "react-hot-toast";
import { Modal } from "@/shared/ui";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useCreateOfficeBranch, useUpdateOfficeBranch } from "../hooks/useOfficeBranches";
import { OfficeBranchForm } from "./OfficeBranchForm";
import type { OfficeBranch } from "../api/office-branch.service";

interface AddOfficeBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** Pass a branch to edit it; omit to create a new one. */
  branch?: OfficeBranch;
}

export function AddOfficeBranchModal({
  isOpen,
  onClose,
  branch,
}: AddOfficeBranchModalProps) {
  const create = useCreateOfficeBranch();
  const update = useUpdateOfficeBranch();
  const isEditing = Boolean(branch);
  const isSubmitting = create.isPending || update.isPending;

  return (
    <Modal
      title={isEditing ? "Edit Office Branch" : "Add Office Branch"}
      isOpen={isOpen}
      onClose={onClose}
    >
      <OfficeBranchForm
        // Remount on target change so the form picks up fresh defaults.
        key={branch?.id ?? "new"}
        branch={branch}
        isSubmitting={isSubmitting}
        submitLabel={isEditing ? "Save changes" : "Add branch"}
        onCancel={onClose}
        onSubmit={(payload) => {
          const onSettled = {
            onSuccess: () => {
              toast.success(isEditing ? "Office branch updated" : "Office branch created");
              onClose();
            },
            onError: (error: unknown) =>
              toast.error(
                getApiErrorMessage(
                  error,
                  isEditing ? "Failed to update office branch" : "Failed to create office branch",
                ),
              ),
          };

          if (isEditing && branch) {
            update.mutate({ id: branch.id, ...payload }, onSettled);
          } else {
            create.mutate(payload, onSettled);
          }
        }}
      />
    </Modal>
  );
}
