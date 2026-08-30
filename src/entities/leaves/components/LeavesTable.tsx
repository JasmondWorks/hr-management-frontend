"use client";

import React from "react";
import Table from "@/shared/ui/Table";
import { leavesColumns } from "../columns";
import { useLeaves } from "@/features/leaves/api/useLeaves";

export function LeavesTable({ employeeId }: { employeeId: string }) {
  const { data: response, isLoading } = useLeaves({ employeeId, limit: 10 });
  const data = response?.data || [];

  return (
    <Table
      columns={leavesColumns}
      data={data}
      hasHeaders={true}
      isPaginated={true}
      loading={isLoading}
    />
  );
}
