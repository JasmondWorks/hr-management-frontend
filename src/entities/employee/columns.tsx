import { TableColumn } from "@/shared/ui/Table/types";
import { Employee } from "./types";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Edit, Trash } from "@/shared/ui/icons";
import { Building2 } from "lucide-react";

interface EmployeeColumnHandlers {
  /** Opens the assign-department modal for this row. */
  onAssignDepartment?: (employee: Employee) => void;
}

// A factory rather than a constant so row actions can reach component state
// (the table owns the modal) without the columns needing a context.
export const buildEmployeesListColumns = ({
  onAssignDepartment,
}: EmployeeColumnHandlers = {}): TableColumn<Employee>[] => [
  {
    key: "firstName",
    label: "Employee Name",
    render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 overflow-hidden">
          {/* Placeholder for avatar */}
          <span className="text-xs font-medium text-muted-foreground">
            {(row.user?.firstName?.[0] || row.firstName?.[0] || "").toUpperCase()}
          </span>
        </div>
        <span className="font-medium">{row.user?.firstName ?? row.firstName}</span>
      </div>
    ),
  },
  {
    key: "id",
    label: "Employee ID",
    render: (row) => (
      <span className="text-muted-foreground">{row.id.substring(0, 8)}</span>
    ),
  },
  {
    key: "department",
    label: "Department",
    render: (row) =>
      row.department ? (
        <span>{row.department.name}</span>
      ) : onAssignDepartment ? (
        // Unassigned is the actionable case, so make it the affordance rather
        // than a dash the admin has to hunt past.
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onAssignDepartment(row);
          }}
          className="text-muted-foreground underline decoration-dotted underline-offset-4 hover:text-foreground"
        >
          Assign
        </button>
      ) : (
        <span className="text-muted-foreground">—</span>
      ),
  },
  {
    key: "designation",
    label: "Designation",
    render: (row) => (
      <span className={row.designation ? "" : "text-muted-foreground"}>
        {row.designation?.name ?? "—"}
      </span>
    ),
  },
  {
    key: "officeBranch",
    label: "Office Branch",
    render: (row) => (
      <span className={row.officeBranch ? "" : "text-muted-foreground"}>
        {row.officeBranch
          ? row.officeBranch.isHeadquarters
            ? `${row.officeBranch.name} (HQ)`
            : row.officeBranch.name
          : "—"}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    // Someone who accepted an invitation but never filled in their details is
    // a real account with an empty profile — worth surfacing to the admin.
    render: (row) =>
      row.user?.isOnboarded ? (
        <StatusBadge statusVariant="success">Active</StatusBadge>
      ) : (
        <StatusBadge statusVariant="warning">Profile incomplete</StatusBadge>
      ),
  },
  {
    key: "actions",
    label: "Action",
    render: (row) => (
      <div className="flex items-center gap-2">
        {onAssignDepartment && (
          <button
            type="button"
            aria-label={`Assign department for ${row.user?.firstName ?? "employee"}`}
            title="Assign department"
            onClick={(e) => {
              // The row itself navigates to the details page.
              e.stopPropagation();
              onAssignDepartment(row);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Building2 className="w-4 h-4" />
          </button>
        )}
        <button 
          onClick={(e) => e.stopPropagation()} 
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          <Edit className="w-4 h-4 fill-current" />
        </button>
        <button 
          onClick={(e) => e.stopPropagation()} 
          className="text-muted-foreground hover:text-red-500 transition-colors"
        >
          <Trash className="w-4 h-4 fill-current" />
        </button>
      </div>
    ),
  },
];

// Back-compat for call sites that render the table without row actions.
export const employeesListColumns = buildEmployeesListColumns();
