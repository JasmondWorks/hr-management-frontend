"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Building, Briefcase } from "lucide-react";
import { useAuth } from "@/features/auth";
import { APP_ROLES } from "@/shared/lib/roles";
import { listMyJobs } from "@/features/jobs/jobs.service";
import type { Job } from "@/features/jobs/types";
import { EmptyState } from "@/shared/ui";
import { AddJobModal } from "@/features/jobs/components/AddJobModal";
import { cn, formatBackendConstant } from "@/shared/lib/utils";
import { useDepartments } from "@/features/department";

function StatusBadge({ status }: { status: Job["status"] }) {
  return (
    <span
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-medium",
        status === "OPEN"
          ? "bg-success/15 text-success"
          : "bg-muted text-muted-foreground",
      )}
    >
      {status}
    </span>
  );
}

export function AdminJobsView() {
  const { appRole } = useAuth();
  const canAdd =
    appRole === APP_ROLES.ORGANIZATION_ADMIN ||
    appRole === APP_ROLES.DEPARTMENT_ADMIN;
  const [addOpen, setAddOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: departments, isPending: departmentsPending } = useDepartments();

  const fetchJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      // Authenticated request: the backend scopes this to the admin's org.
      const res = await listMyJobs({ limit: "100" });
      setJobs(res.data);
    } catch {
      toast.error("Failed to load your organization's jobs.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  function handleNewJob() {
    if (departmentsPending || departments?.data.length === 0) {
      toast.error("Please add a department first.");
      return;
    }
    setAddOpen(true);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchJobs();
  }, [fetchJobs]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Jobs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            All job postings in your organization.
          </p>
        </div>
        <button
          onClick={handleNewJob}
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 flex items-center"
        >
          <Briefcase className="mr-2 h-4 w-4" />
          New job
        </button>
      </div>

      <AddJobModal
        isOpen={addOpen}
        onClose={() => {
          setAddOpen(false);
          fetchJobs();
        }}
      />

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-card border border-border bg-card"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase />}
          title="No jobs yet"
          description="Create a department and post your first job."
          action={
            canAdd ? (
              <button
                onClick={handleNewJob}
                className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 flex items-center mt-2"
              >
                <Briefcase className="mr-2 h-4 w-4" />
                New job
              </button>
            ) : undefined
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-3 rounded-card border border-border bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-medium text-foreground">
                  {job.name}
                </h3>
                <StatusBadge status={job.status} />
              </div>
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Building className="size-3.5" />
                  {job.department?.name ?? "—"}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Briefcase className="size-3.5" />
                  {job.departmentDesignation?.name ?? "—"} ·{" "}
                  {job.workLocation ? formatBackendConstant(job.workLocation) : "On Site"}
                </span>
              </div>
              {job.amount != null && (
                <span className="mt-auto text-sm font-medium text-foreground">
                  ${Number(job.amount).toLocaleString()}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminJobsView;
