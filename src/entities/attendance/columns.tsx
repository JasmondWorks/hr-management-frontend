import { TableColumn } from "@/shared/ui/Table/types";

import { StatusBadge } from "@/shared/ui/StatusBadge";

export const attendanceColumns: TableColumn<any>[] = [
  {
    key: "date",
    label: "Date",
    render: (row) => new Date(row.date).toLocaleDateString(),
  },
  {
    key: "checkInTime",
    label: "Check In",
    render: (row) => row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
  },
  {
    key: "checkOutTime",
    label: "Check Out",
    render: (row) => row.checkOutTime ? new Date(row.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "-",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <StatusBadge statusVariant={row.status === "PRESENT" ? "success" : row.status === "LATE" ? "warning" : row.status === "ABSENT" ? "danger" : "default"}>
        {row.status}
      </StatusBadge>
    ),
  },
];
