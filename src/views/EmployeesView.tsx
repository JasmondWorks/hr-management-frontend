"use client";

import EmployeesListTable from "@/entities/employee/components/EmployeesListTable";
import { useAuth } from "@/features/auth";

import { useState } from "react";
import { Search, PlusCircle, Filter } from "@/shared/ui/icons";
import { EmployeeFilterModal } from "@/features/employee/filter/ui/EmployeeFilterModal";
import { InviteEmployeeModal, InvitationsTable } from "@/features/invitation";
import { useSetHeader } from "@/shared/ui/HeaderContext";
import { cn } from "@/shared/lib/utils";

type Tab = "employees" | "invitations";

export function EmployeesView() {
  const { appRole } = useAuth();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("employees");

  useSetHeader({
    pageHeader: "All Employees",
    subHeader: "All Employee Information",
  });

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "employees", label: "Employees" },
    // Until someone accepts, an invited person has no user or employee record —
    // this tab is the only place they show up.
    { id: "invitations", label: "Pending Invitations" },
  ];

  return (
    <div className="flex flex-col flex-1 gap-6">
      <div className="flex-1 flex flex-col gap-6">
        {/* Action Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search"
              className="w-full bg-white border border-border rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsInviteOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#f97316] hover:bg-[#ea580c] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <PlusCircle className="h-5 w-5" />
              Invite Employee
            </button>
            <button
              onClick={() => setIsFilterOpen(true)}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-transparent border border-border hover:bg-muted text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <Filter className="h-5 w-5" />
              Filter
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1 border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "-mb-px border-b-2 px-4 py-2 text-sm font-medium transition-colors",
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="rounded-card border border-border bg-card p-0 overflow-hidden">
          {tab === "employees" ? <EmployeesListTable /> : <InvitationsTable />}
        </div>
      </div>

      <EmployeeFilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />

      <InviteEmployeeModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
      />
    </div>
  );
}

export default EmployeesView;
