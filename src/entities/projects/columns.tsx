import { TableColumn } from "@/shared/ui/Table/types";

import { StatusBadge } from "@/shared/ui/StatusBadge";

export const projectsColumns: TableColumn<any>[] = [
  {
    key: "name",
    label: "Project Name",
    render: (row) => row.name,
  },
  {
    key: "startDate",
    label: "Start Date",
    render: (row) => new Date(row.startDate).toLocaleDateString(),
  },
  {
    key: "finishDate",
    label: "Finish Date",
    render: (row) => row.finishDate ? new Date(row.finishDate).toLocaleDateString() : "-",
  },
  {
    key: "status",
    label: "Status",
    render: (row) => {
      let variant: "default" | "success" | "warning" | "danger" = "default";
      if (row.status === "COMPLETED") variant = "success";
      if (row.status === "IN_PROGRESS" || row.status === "PLANNED") variant = "warning";
      if (row.status === "CANCELLED") variant = "danger";
      
      return (
        <StatusBadge statusVariant={variant}>
          {row.status.replace("_", " ")}
        </StatusBadge>
      );
    },
  },
];
