"use client";

import React from "react";
import Table from "@/shared/ui/Table";
import { projectsColumns } from "../columns";
import { useProjects } from "@/entities/project/hooks/useProjects";

export function ProjectsTable({ employeeId }: { employeeId: string }) {
  const { data: response, isLoading } = useProjects({ employeeId, limit: 10 });
  const data = response?.data || [];

  return (
    <Table
      columns={projectsColumns}
      data={data}
      hasHeaders={true}
      isPaginated={true}
      loading={isLoading}
    />
  );
}
