import React from "react";
import { Badge } from "./shad-cn/badge";
import { cn } from "@/shared/lib/utils";

type StatusVariant =
  | "success" // Green (On Time, Completed, Approved)
  | "warning" // Yellow/Orange (In Process, Pending)
  | "danger" // Red (Late, Reject)
  | "info" // Blue
  | "default" // Grey
  | "permanent" // Specific for "Permanent" status shown in screenshot
  | "remote"; // Specific for "Remote" status

interface StatusBadgeProps extends React.ComponentProps<typeof Badge> {
  /** Explicit lowercase variant. */
  statusVariant?: StatusVariant;
  /** Uppercase status keyword (e.g. "COMPLETED", "PENDING") — auto-mapped to a variant. */
  status?: string;
  /** Text to render when using the status/label API. */
  label?: string;
}

const statusStyles: Record<StatusVariant, string> = {
  success: "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-transparent",
  warning: "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-transparent",
  danger: "bg-red-500/10 text-red-500 hover:bg-red-500/20 border-transparent",
  info: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-transparent",
  default: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20 border-transparent",
  permanent: "bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316]/20 border-transparent",
  remote: "bg-gray-500/10 text-gray-300 hover:bg-gray-500/20 border-transparent",
};

// Maps common uppercase status keywords to a colour variant.
const statusToVariant: Record<string, StatusVariant> = {
  SUCCESS: "success",
  COMPLETED: "success",
  APPROVED: "success",
  ACTIVE: "success",
  ON_TIME: "success",
  "ON TIME": "success",
  PAID: "success",
  SELECTED: "success",
  ACCEPTED: "success",
  OPEN: "success",
  WARNING: "warning",
  PENDING: "warning",
  IN_PROCESS: "warning",
  "IN PROCESS": "warning",
  INTERVIEW: "warning",
  OFFERED: "warning",
  DANGER: "danger",
  REJECT: "danger",
  REJECTED: "danger",
  LATE: "danger",
  ABSENT: "danger",
  UNPAID: "danger",
  CLOSED: "danger",
  INFO: "info",
  PERMANENT: "permanent",
  REMOTE: "remote",
};

export function StatusBadge({
  statusVariant,
  status,
  label,
  className,
  children,
  ...props
}: StatusBadgeProps) {
  const variant =
    statusVariant ??
    (status ? (statusToVariant[status.toUpperCase()] ?? "default") : "default");
  const content = children ?? label ?? status;

  return (
    <Badge
      variant="outline"
      className={cn(
        "px-2.5 py-0.5 font-medium border-0 rounded",
        statusStyles[variant],
        className,
      )}
      {...props}
    >
      {content}
    </Badge>
  );
}
