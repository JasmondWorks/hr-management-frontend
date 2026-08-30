import { TableColumn } from "@/shared/ui/Table/types";

import { StatusBadge } from "@/shared/ui/StatusBadge";

export const leavesColumns: TableColumn<any>[] = [
  {
    key: "date",
    label: "Leave Dates",
    render: (row) => `${new Date(row.startDate).toLocaleDateString()} - ${new Date(row.endDate).toLocaleDateString()}`,
  },
  {
    key: "leaveType",
    label: "Leave Type",
    render: (row) => row.leaveType,
  },
  {
    key: "leaveReason",
    label: "Reason",
    render: (row) => row.leaveReason,
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <StatusBadge statusVariant={row.status === "APPROVED" ? "success" : row.status === "REJECTED" ? "danger" : "warning"}>
        {row.status}
      </StatusBadge>
    ),
  },
];
