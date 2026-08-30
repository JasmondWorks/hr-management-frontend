import React from "react";
import { Modal } from "./Modal";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/shared/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  confirmButtonClassName?: string;
  cancelButtonClassName?: string;
  /** Disables the confirm button (e.g. while the action is pending). */
  isLoading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
  confirmButtonClassName,
  cancelButtonClassName,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="flex flex-col items-center text-center pb-4">
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center mb-6",
            isDestructive
              ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-500"
              : "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-500",
          )}
        >
          <ExclamationTriangleIcon className="w-8 h-8" />
        </div>
        <p className="text-sm text-muted-foreground mb-6">{message}</p>
        <div className="flex w-full gap-3">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "flex-1 py-2 px-4 border border-border rounded-lg text-foreground font-medium hover:bg-muted transition-colors",
              cancelButtonClassName,
            )}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={cn(
              "flex-1 py-2 px-4 rounded-lg text-white font-medium transition-colors disabled:opacity-60 disabled:pointer-events-none",
              isDestructive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-primary hover:bg-primary/90",
              confirmButtonClassName,
            )}
          >
            {isLoading ? "Please wait…" : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
