"use client";

import { useDepartment } from "@/features/department";
import { Card } from "@/shared/ui/shad-cn/card";
import { Search, Plus, Filter, Eye, Edit2, Trash2 } from "lucide-react";
import { Input } from "@/shared/ui/shad-cn/input";
import { Button } from "@/shared/ui/shad-cn/button";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Table from "@/shared/ui/Table";
import { TableColumn } from "@/shared/ui/Table/types";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { useDeleteEmployee } from "@/entities/employee/hooks/useEmployees";
import { ConfirmationModal } from "@/shared/ui/ConfirmationModal";
import { InviteEmployeeModal } from "@/features/invitation";
import { useState } from "react";

export function DepartmentDetailsView() {
  const { id } = useParams() as { id: string };

  const router = useRouter();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data, isLoading, refetch } = useDepartment(id);

  const department = data?.data;
  const employees = department?.employees || [];

  const { mutate: deleteEmployee, isPending: deleting } = useDeleteEmployee({
    onSuccess: () => {
      toast.success("Employee removed");
      setDeleteTarget(null);
      refetch();
    },
    onError: () => toast.error("Failed to remove employee"),
  });

  const handleDelete = (employeeId: string, name: string) =>
    setDeleteTarget({ id: employeeId, name });

  const columns: TableColumn<any>[] = [
    {
      key: "employeeId",
      label: "Employee ID",
      render: (row) => (
        <span className="font-medium text-muted-foreground">
          {row.id.split("-")[0]}
        </span>
      ),
    },
    {
      key: "employeeName",
      label: "Employee Name",
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold">
            {row.user?.firstName?.[0]}
            {row.user?.lastName?.[0]}
          </div>
          <span className="font-medium">
            {row.user?.firstName} {row.user?.lastName}
          </span>
        </div>
      ),
    },
    {
      key: "designation",
      label: "Designation",
      render: (row) => row.user?.businessRole || "Employee",
    },
    {
      key: "type",
      label: "Type",
      render: () => "Office",
    },
    {
      key: "status",
      label: "Status",
      render: () => <StatusBadge status="ACTIVE" label="Permanent" />,
    },
    {
      key: "actions",
      label: "Action",
      render: (row) => (
        <div className="flex items-center justify-end space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => router.push(`/employees/${row.id}`)}
            aria-label="View employee"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => router.push(`/employees/${row.id}`)}
            aria-label="Edit employee"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            disabled={deleting}
            onClick={() =>
              handleDelete(
                row.id,
                `${row.user?.firstName ?? ""} ${row.user?.lastName ?? ""}`.trim() ||
                  "This employee",
              )
            }
            aria-label="Remove employee"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {department?.name || "Department Details"}
          </h1>
          <div className="text-sm text-muted-foreground mt-1 flex items-center space-x-2">
            <Link href="/departments" className="hover:text-primary">
              All Departments
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">{department?.name}</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-9 bg-card border-border h-10"
            />
          </div>
          <Button 
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setIsInviteOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Invite Employee
          </Button>
          <Button variant="outline" className="border-border">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={employees}
        loading={isLoading}
        hasHeaders={true}
        isPaginated={false}
      />

      <InviteEmployeeModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />

      <ConfirmationModal
        isOpen={!!deleteTarget}
        title="Remove employee"
        message={
          <>
            <span className="font-medium text-foreground">
              {deleteTarget?.name}
            </span>{" "}
            will be removed. This action cannot be undone.
          </>
        }
        confirmText="Remove"
        isDestructive
        isLoading={deleting}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && deleteEmployee(deleteTarget.id)}
      />
    </div>
  );
}

export default DepartmentDetailsView;
