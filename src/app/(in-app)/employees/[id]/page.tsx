"use client";
import React from "react";
import { EmployeeDetailsView } from "@/entities/employee/components/EmployeeDetailsView";
import { useSetHeader } from "@/shared/ui/HeaderContext";

export default function EmployeeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);
  
  useSetHeader({
    pageHeader: "Employee Profile",
    subHeader: (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>All Employee</span>
        <span>&gt;</span>
        <span className="text-foreground">Employee Profile</span>
      </div>
    )
  });

  return (
    <div className="flex flex-col flex-1">
      <EmployeeDetailsView employeeId={unwrappedParams.id} />
    </div>
  );
}
