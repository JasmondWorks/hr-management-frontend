import React from "react";
import Link from "next/link";
import { StatusBadge } from "@/shared/ui/StatusBadge";

import { useAttendances } from "@/entities/attendance/hooks/useAttendances";
import Table from "@/shared/ui/Table";
import { TableColumn } from "@/shared/ui/Table/types";

export function DashboardAttendanceList() {
  const { data: response, isLoading } = useAttendances({ limit: 7, sort: "-date" });
  const records = response?.data || [];

  const columns: TableColumn<any>[] = [
    {
      key: "employeeName",
      label: "Employee Name",
      render: (row) => {
        const employeeName = row.employee 
          ? `${row.employee.firstName} ${row.employee.lastName}` 
          : "Unknown Employee";
        const avatar = row.employee?.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(employeeName)}&background=random`;
        
        return (
          <div className="flex items-center gap-3">
            <img src={avatar} alt={employeeName} className="w-8 h-8 rounded-full object-cover" />
            <span className="font-medium text-foreground">{employeeName}</span>
          </div>
        );
      }
    },
    {
      key: "designation",
      label: "Designation",
      render: (row) => row.employee?.designation || "N/A"
    },
    {
      key: "type",
      label: "Type",
      render: () => "Office"
    },
    {
      key: "checkInTime",
      label: "Check In Time",
      render: (row) => row.checkInTime ? new Date(row.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "N/A"
    },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge statusVariant={row.status === "On Time" ? "success" : "danger"}>
          {row.status || "Unknown"}
        </StatusBadge>
      )
    }
  ];

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <h2 className="text-lg font-semibold">Attendance Overview</h2>
        <Link 
          href="/attendance"
          className="text-sm border border-border rounded-md px-4 py-1.5 hover:bg-accent/50 transition-colors"
        >
          View All
        </Link>
      </div>
      
      <Table
        columns={columns}
        data={records}
        loading={isLoading}
        hasHeaders={true}
        isPaginated={false}
      />
    </div>
  );
}
