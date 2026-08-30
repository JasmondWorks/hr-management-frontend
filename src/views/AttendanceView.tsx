"use client";

import { useAttendance } from "@/features/attendance";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/shad-cn/input";
import { Card } from "@/shared/ui/shad-cn/card";
import Table from "@/shared/ui/Table";
import { TableColumn } from "@/shared/ui/Table/types";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Button } from "@/shared/ui/shad-cn/button";

export function AttendanceView() {
  const { data, isLoading } = useAttendance({ limit: 100 });

  const attendanceRecords = data?.data || [];

  const columns: TableColumn<any>[] = [
    {
      key: "employeeName",
      label: "Employee Name",
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold shrink-0">
            {row.employee?.user?.firstName?.[0]}
            {row.employee?.user?.lastName?.[0]}
          </div>
          <span className="font-medium whitespace-nowrap">
            {row.employee?.user?.firstName} {row.employee?.user?.lastName}
          </span>
        </div>
      ),
    },
    {
      key: "designation",
      label: "Designation",
      render: (row) => row.employee?.user?.businessRole || "Employee",
    },
    {
      key: "type",
      label: "Type",
      render: () => "Office",
    },
    {
      key: "checkInTime",
      label: "Check In Time",
      render: (row) =>
        row.checkInTime
          ? new Date(row.checkInTime).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "-",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        let statusLabel = row.status === "PRESENT" ? "On Time" : row.status;
        let variant: "SUCCESS" | "WARNING" | "DANGER" | "INFO" = "SUCCESS";
        if (row.status === "LATE") {
          statusLabel = "Late";
          variant = "DANGER";
        }
        return <StatusBadge status={variant} label={statusLabel} />;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Attendance</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All Employee Attendance
          </p>
        </div>

        <div className="relative w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-9 bg-card border-border h-10"
          />
        </div>
      </div>

      <Table
        columns={columns}
        data={attendanceRecords}
        loading={isLoading}
        hasHeaders={true}
        isPaginated={false}
      />
    </div>
  );
}

export default AttendanceView;
