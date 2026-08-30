"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { RefreshCw, X } from "lucide-react";
import { EmptyState, ConfirmationModal } from "@/shared/ui";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import {
  useInvitations,
  useResendInvitation,
  useRevokeInvitation,
} from "../hooks/useInvitations";
import type { Invitation, InvitationStatus } from "../api/invitation.service";

const STATUS_STYLES: Record<InvitationStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-600",
  ACCEPTED: "bg-emerald-500/10 text-emerald-600",
  EXPIRED: "bg-muted text-muted-foreground",
  REVOKED: "bg-destructive/10 text-destructive",
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

/**
 * Until someone accepts, an invited person exists nowhere else in the UI — no
 * user, no employee row. This table is the only place they are visible.
 */
export function InvitationsTable() {
  const { data, isLoading } = useInvitations({ limit: 100 });
  const resend = useResendInvitation();
  const revoke = useRevokeInvitation();
  const [pendingRevoke, setPendingRevoke] = useState<Invitation | undefined>();

  const invitations = data?.data ?? [];

  if (isLoading) {
    return <p className="p-6 text-sm text-muted-foreground">Loading invitations...</p>;
  }

  if (invitations.length === 0) {
    return (
      <EmptyState
        title="No invitations yet"
        description="Invite someone by email and they'll appear here until they accept."
      />
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Invited</th>
              <th className="px-4 py-3 font-medium">Expires</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invitations.map((invitation) => {
              const isPending = invitation.status === "PENDING";
              const canResend = invitation.status !== "ACCEPTED";

              return (
                <tr key={invitation.id} className="border-b border-border/60">
                  <td className="px-4 py-3 font-medium text-foreground">
                    {invitation.email}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_STYLES[invitation.status]}`}
                    >
                      {invitation.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(invitation.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {invitation.status === "ACCEPTED"
                      ? "—"
                      : formatDate(invitation.expiresAt)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {canResend && (
                        <button
                          type="button"
                          aria-label={`Resend invitation to ${invitation.email}`}
                          disabled={resend.isPending}
                          onClick={() =>
                            resend.mutate(invitation.id, {
                              // Resending rotates the token, so any previously
                              // emailed link stops working.
                              onSuccess: () =>
                                toast.success(`New link sent to ${invitation.email}`),
                              onError: (error) =>
                                toast.error(
                                  getApiErrorMessage(error, "Failed to resend"),
                                ),
                            })
                          }
                          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-50"
                        >
                          <RefreshCw className="size-4" />
                        </button>
                      )}
                      {isPending && (
                        <button
                          type="button"
                          aria-label={`Revoke invitation for ${invitation.email}`}
                          onClick={() => setPendingRevoke(invitation)}
                          className="rounded p-1.5 text-muted-foreground hover:bg-muted hover:text-destructive"
                        >
                          <X className="size-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ConfirmationModal
        isOpen={Boolean(pendingRevoke)}
        onClose={() => setPendingRevoke(undefined)}
        title="Revoke invitation"
        message={`Revoke the invitation for ${pendingRevoke?.email}? Their link will stop working immediately.`}
        confirmText="Revoke"
        isLoading={revoke.isPending}
        onConfirm={() => {
          if (!pendingRevoke) return;
          revoke.mutate(pendingRevoke.id, {
            onSuccess: () => {
              toast.success("Invitation revoked");
              setPendingRevoke(undefined);
            },
            onError: (error) =>
              toast.error(getApiErrorMessage(error, "Failed to revoke")),
          });
        }}
      />
    </>
  );
}
