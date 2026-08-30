"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { PlusCircle } from "@/shared/ui/icons";
import {
  useLeaves,
  useRequestLeave,
  useApproveLeave,
  useRejectLeave,
  type Leave,
  type LeaveType,
} from "@/features/leaves";
import { useAuth } from "@/features/auth";
import Table from "@/shared/ui/Table";
import type { TableColumn, TableAction } from "@/shared/ui/Table/types";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ConfirmationModal } from "@/shared/ui/ConfirmationModal";
import { Modal, Button, InputField, SelectField } from "@/shared/ui";

const LEAVE_TYPES: LeaveType[] = ["ANNUAL", "SICK", "UNPAID", "OTHER"];
const EMPTY = {
  startDate: "",
  endDate: "",
  leaveType: "ANNUAL" as LeaveType,
  leaveReason: "",
};

export function LeavesView() {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY);

  const { data, isLoading } = useLeaves(isAdmin ? "org" : "mine", {
    limit: 100,
  });
  const leaves = data?.data ?? [];

  const approve = useApproveLeave();
  const reject = useRejectLeave();
  const request = useRequestLeave();

  const columns: TableColumn<Leave>[] = [
    ...(isAdmin
      ? [
          {
            key: "employee",
            label: "Employee",
            render: (row: Leave) =>
              row.employee?.user
                ? `${row.employee.user.firstName} ${row.employee.user.lastName}`
                : "—",
          },
        ]
      : []),
    { key: "leaveType", label: "Type", render: (row) => row.leaveType },
    {
      key: "startDate",
      label: "Start",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      key: "endDate",
      label: "End",
      render: (row) => new Date(row.endDate).toLocaleDateString(),
    },
    { key: "leaveReason", label: "Reason", render: (row) => row.leaveReason },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>{row.status}</StatusBadge>
      ),
    },
  ];

  const actions: TableAction<Leave>[] = isAdmin
    ? [
        {
          label: "Approve",
          onClick: (row) =>
            approve.mutate(row.id, {
              onSuccess: () => toast.success("Leave approved"),
              onError: () => toast.error("Failed to approve"),
            }),
          condition: (row) => row.status === "PENDING",
        },
        {
          label: "Reject",
          className: "text-destructive",
          onClick: (row) => setRejectId(row.id),
          condition: (row) => row.status === "PENDING",
        },
      ]
    : [];

  const submitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    request.mutate(form, {
      onSuccess: () => {
        toast.success("Leave requested");
        setOpen(false);
        setForm(EMPTY);
      },
      onError: () => toast.error("Failed to request leave"),
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Leaves
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "Review and decide on leave requests."
              : "Request time off and track your leave requests."}
          </p>
        </div>
        {!isAdmin && (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlusCircle className="size-4" /> Request Leave
          </button>
        )}
      </div>

      <Table
        columns={columns}
        data={leaves}
        loading={isLoading}
        actions={actions}
        isPaginated={false}
        emptyMessage={isAdmin ? "No leave requests." : "No leave requests yet."}
      />

      <Modal title="Request Leave" isOpen={open} onClose={() => setOpen(false)}>
        <form className="flex flex-col gap-4" onSubmit={submitRequest}>
          <InputField
            label="Start date"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
          <InputField
            label="End date"
            type="date"
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            required
          />
          <SelectField
            label="Type"
            value={form.leaveType}
            onChange={(e) =>
              setForm({ ...form, leaveType: e.target.value as LeaveType })
            }
            options={LEAVE_TYPES}
          />
          <InputField
            label="Reason"
            value={form.leaveReason}
            onChange={(e) => setForm({ ...form, leaveReason: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={request.isPending}>
              {request.isPending ? "Requesting…" : "Request"}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmationModal
        isOpen={!!rejectId}
        title="Reject leave"
        message="This leave request will be rejected."
        confirmText="Reject"
        isDestructive
        isLoading={reject.isPending}
        onClose={() => setRejectId(null)}
        onConfirm={() =>
          rejectId &&
          reject.mutate(rejectId, {
            onSuccess: () => {
              toast.success("Leave rejected");
              setRejectId(null);
            },
            onError: () => toast.error("Failed to reject"),
          })
        }
      />
    </div>
  );
}

export default LeavesView;
