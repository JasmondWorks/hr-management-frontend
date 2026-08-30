"use client";

import { useRouter } from "next/navigation";
import { useApplications } from "@/features/applications";
import { Search } from "lucide-react";
import { Input } from "@/shared/ui/shad-cn/input";
import { Card } from "@/shared/ui/shad-cn/card";
import Table from "@/shared/ui/Table";
import { TableColumn } from "@/shared/ui/Table/types";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Button } from "@/shared/ui/shad-cn/button";
import TableHeader from "@/shared/ui/Table/TableHeader";

export function CandidatesView() {
  const router = useRouter();
  const { data, isLoading } = useApplications("org", { limit: 100 });

  const applications = data?.data || [];

  const columns: TableColumn<any>[] = [
    {
      key: "candidateName",
      label: "Candidate Name",
      render: (row) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold shrink-0">
            {row.candidate?.firstName?.[0]}
            {row.candidate?.lastName?.[0]}
          </div>
          <span className="font-medium whitespace-nowrap">
            {row.candidate?.firstName} {row.candidate?.lastName}
          </span>
        </div>
      ),
    },
    {
      key: "appliedFor",
      label: "Applied For",
      render: (row) => row.job?.name || "Unknown Job",
    },
    {
      key: "appliedDate",
      label: "Applied Date",
      render: (row) =>
        row.appliedAt
          ? new Date(row.appliedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })
          : "-",
    },
    {
      key: "email",
      label: "Email Address",
      render: (row) => row.candidate?.email,
    },
    {
      key: "mobile",
      label: "Mobile Number",
      render: () => "(555) 555-5555",
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        let statusLabel = "In Process";
        let variant: "SUCCESS" | "WARNING" | "DANGER" | "INFO" = "WARNING";

        if (row.status === "ACCEPTED" || row.status === "OFFERED") {
          statusLabel = "Selected";
          variant = "SUCCESS";
        } else if (row.status === "REJECTED") {
          statusLabel = "Rejected";
          variant = "DANGER";
        }
        return <StatusBadge status={variant} label={statusLabel} />;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <TableHeader
        title="Candidates"
        description="Show All Candidates"
        searchValue=""
        onSearchChange={() => {}}
      />

      <Table
        columns={columns}
        data={applications}
        loading={isLoading}
        selectable={true}
        hasHeaders={true}
        isPaginated={false}
        onItemClick={(item) => router.push(`/candidates/${item.id}`)}
      />
    </div>
  );
}

export default CandidatesView;
