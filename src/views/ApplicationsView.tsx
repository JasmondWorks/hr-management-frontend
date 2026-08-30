"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  useApplications,
  useAcceptApplication,
  useRejectApplication,
  type Application,
} from "@/features/applications";
import { useAuth } from "@/features/auth";
import Table from "@/shared/ui/Table";
import type { TableColumn, TableAction } from "@/shared/ui/Table/types";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ConfirmationModal } from "@/shared/ui/ConfirmationModal";

const TERMINAL = ["ACCEPTED", "REJECTED"];

export function ApplicationsView() {
  const { isAdmin } = useAuth();
  const [rejectId, setRejectId] = useState<string | null>(null);

  const { data, isLoading } = useApplications(isAdmin ? "org" : "mine", {
    limit: 100,
  });
  const applications = data?.data ?? [];

  const accept = useAcceptApplication();
  const reject = useRejectApplication();

  const onAccept = (row: Application) =>
    accept.mutate(row.id, {
      onSuccess: () => toast.success("Application accepted"),
      onError: () => toast.error("Failed to accept"),
    });

  const columns: TableColumn<Application>[] = [
    ...(isAdmin
      ? [
          {
            key: "candidate",
            label: "Candidate",
            render: (row: Application) =>
              row.candidate
                ? `${row.candidate.firstName} ${row.candidate.lastName}`
                : "—",
          },
        ]
      : []),
    { key: "job", label: "Applied For", render: (row) => row.job?.name ?? "—" },
    {
      key: "appliedAt",
      label: "Applied Date",
      render: (row) => new Date(row.appliedAt).toLocaleDateString(),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>{row.status}</StatusBadge>
      ),
    },
  ];

  const actions: TableAction<Application>[] = isAdmin
    ? [
        {
          label: "Accept",
          onClick: onAccept,
          condition: (row) => !TERMINAL.includes(row.status),
        },
        {
          label: "Reject",
          className: "text-destructive",
          onClick: (row) => setRejectId(row.id),
          condition: (row) => !TERMINAL.includes(row.status),
        },
      ]
    : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Applications
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isAdmin
            ? "Review applications to your organization's jobs."
            : "Track the jobs you've applied to."}
        </p>
      </div>

      <Table
        columns={columns}
        data={applications}
        loading={isLoading}
        actions={actions}
        isPaginated={false}
        emptyMessage={
          isAdmin
            ? "No applications yet."
            : "You haven't applied to any jobs yet."
        }
      />

      <ConfirmationModal
        isOpen={!!rejectId}
        title="Reject application"
        message="This application will be rejected. The candidate can still apply to other roles."
        confirmText="Reject"
        isDestructive
        isLoading={reject.isPending}
        onClose={() => setRejectId(null)}
        onConfirm={() =>
          rejectId &&
          reject.mutate(rejectId, {
            onSuccess: () => {
              toast.success("Application rejected");
              setRejectId(null);
            },
            onError: () => toast.error("Failed to reject"),
          })
        }
      />
    </div>
  );
}

export default ApplicationsView;
