"use client";

import React from "react";
import Table from "@/shared/ui/Table";
import { attendanceColumns } from "../columns";
import { useAttendances } from "../hooks/useAttendances";

export function AttendanceTable({ employeeId }: { employeeId: string }) {
  const { data: response, isLoading } = useAttendances({
    employeeId,
    limit: 10,
  });
  const data = response?.data || [];

  return (
    <Table
      columns={attendanceColumns}
      data={data}
      loading={isLoading}
      hasHeaders={true}
      isPaginated={true}
    />
  );
}
