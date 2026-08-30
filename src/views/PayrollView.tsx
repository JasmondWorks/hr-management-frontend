"use client";

import { usePayroll } from "@/features/payroll";
import { Search, Download } from "lucide-react";
import { Input } from "@/shared/ui/shad-cn/input";
import { Card } from "@/shared/ui/shad-cn/card";
import Table from "@/shared/ui/Table";
import { TableColumn } from "@/shared/ui/Table/types";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Button } from "@/shared/ui/shad-cn/button";

export function PayrollView() {
  const { data, isLoading } = usePayroll({ limit: 100 });

  const payrollRecords = data?.data || [];

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
      key: "ctc",
      label: "CTC",
      render: (row) => {
        const monthlySalary = row.amount;
        const ctc = monthlySalary * 12 + 2000;
        return `$${ctc.toLocaleString()}`;
      },
    },
    {
      key: "salaryPerMonth",
      label: "Salary Per Month",
      render: (row) => `$${row.amount.toLocaleString()}`,
    },
    {
      key: "deduction",
      label: "Deduction",
      render: (row) => (row.status === "PAID" ? "-" : "$666"),
    },
    {
      key: "status",
      label: "Status",
      render: (row) => {
        const statusLabel = row.status === "PAID" ? "Completed" : "Pending";
        const variant = row.status === "PAID" ? "SUCCESS" : "WARNING";
        return <StatusBadge status={variant} label={statusLabel} />;
      },
    },
  ];

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Payroll</h1>
          <p className="text-sm text-muted-foreground mt-1">
            All Employee Payroll
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search"
              className="pl-9 bg-card border-border h-10"
            />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        data={payrollRecords}
        loading={isLoading}
        hasHeaders={true}
        isPaginated={false}
      />
    </div>
  );
}

export default PayrollView;
