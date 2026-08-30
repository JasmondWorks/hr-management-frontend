"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { keepPreviousData } from "@tanstack/react-query";
import { useEmployees } from "../hooks/useEmployees";
import { buildEmployeesListColumns } from "../columns";
import { InboxIcon } from "@heroicons/react/24/outline";
import Table from "@/shared/ui/Table";
import { AssignDepartmentModal } from "@/features/employee";
import type { Employee } from "../types";

const PAGE_SIZE = 10;

export default function EmployeesListTable() {
  const [page, setPage] = useState(1);
  const [assigning, setAssigning] = useState<Employee | null>(null);
  const router = useRouter();

  const { data: response, isLoading } = useEmployees(
    { page, limit: PAGE_SIZE },
    { placeholderData: keepPreviousData },
  );

  const employees = response?.data ?? [];
  const meta = response?.meta;

  const columns = useMemo(
    () => buildEmployeesListColumns({ onAssignDepartment: setAssigning }),
    [],
  );

  return (
    <>
    <Table
      columns={columns}
      data={employees}
      loading={isLoading}
      isPaginated
      onItemClick={(item) => router.push(`/employees/${item.id}`)}
      currentPage={meta?.page ?? page}
      totalPages={meta?.totalPages ?? 1}
      onPageChange={setPage}
      emptyMessage={
        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <InboxIcon className="h-12 w-12 mb-4 text-muted-foreground/50" />
          <p className="text-sm font-medium">No employees found</p>
          <p className="text-xs">
            There are no employees to display at this time.
          </p>
        </div>
      }
    />

    <AssignDepartmentModal
      isOpen={Boolean(assigning)}
      employee={assigning}
      onClose={() => setAssigning(null)}
    />
    </>
  );
}
