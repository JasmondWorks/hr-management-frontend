"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Plus, Briefcase, MapPin, Loader2 } from "lucide-react";
import { Input } from "@/shared/ui/shad-cn/input";
import { Button } from "@/shared/ui/shad-cn/button";
import { EmptyState } from "@/shared/ui";
import { Job } from "@/features/jobs/types";
import { useJobs } from "@/features/jobs/hooks/useJobs";
import { AddJobModal } from "@/features/jobs/components/AddJobModal";

export function JobsView() {
  const [addOpen, setAddOpen] = useState(false);
  const { data, isLoading } = useJobs({ limit: "100" });

  const jobs = data?.data || [];

  const activeJobs = jobs.filter((j) => j.status === "OPEN");
  // We'll mock inactive and completed based on CLOSED for now to have visual columns
  const completedJobs = jobs.filter((j) => j.status === "CLOSED");
  const inactiveJobs = [] as typeof jobs;

  const renderJobCard = (job: Job) => (
    <Link
      href={`/jobs/${job.id}`}
      key={job.id}
      className="bg-[#1A1A1A] p-5 rounded-xl border border-border flex flex-col gap-4 transition-colors hover:border-primary/40"
    >
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 bg-secondary/30 text-muted-foreground rounded flex items-center justify-center shrink-0">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-semibold text-foreground text-sm leading-tight mb-1">
            {job.name || job.departmentDesignation?.name || "Job Title"}
          </h4>
          <p className="text-xs text-muted-foreground">
            {job.department?.name || "Department"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <span className="px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-medium tracking-wide">
          {job.department?.name || "Design"}
        </span>
        <span className="px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-medium tracking-wide">
          Full Time
        </span>
        {job.workLocation === "REMOTE" && (
          <span className="px-2 py-1 rounded bg-primary/20 text-primary text-[10px] font-medium tracking-wide">
            Remote
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 border-t border-border/50 pt-4">
        <div className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          <span>Moldova</span>
        </div>
        <div className="font-semibold text-foreground">
          ${job.amount || "3600"}/Month
        </div>
      </div>
    </Link>
  );

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Jobs</h1>
          <p className="text-sm text-muted-foreground mt-1">Show All Jobs</p>
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
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={() => setAddOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Job
          </Button>
        </div>
      </div>

      <AddJobModal isOpen={addOpen} onClose={() => setAddOpen(false)} />

      {isLoading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : jobs.length === 0 ? (
        <EmptyState
          icon={<Briefcase />}
          title="No Jobs Found"
          description="There are currently no job openings. Get started by adding a new job."
          action={
            <Button onClick={() => setAddOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add New Job
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Active Jobs Column */}
          <div className="flex flex-col gap-4 border border-border/50 rounded-xl bg-card p-4">
            <div className="flex items-center gap-2 mb-2 font-medium">
              <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
              Active Jobs
            </div>
            {activeJobs.map(renderJobCard)}
          </div>

          {/* Inactive Jobs Column */}
          <div className="flex flex-col gap-4 border border-border/50 rounded-xl bg-card p-4">
            <div className="flex items-center gap-2 mb-2 font-medium">
              <div className="w-2 h-2 rounded-full bg-red-500"></div>
              Inactive Jobs
            </div>
            {inactiveJobs.map(renderJobCard)}
          </div>

          {/* Completed Jobs Column */}
          <div className="flex flex-col gap-4 border border-border/50 rounded-xl bg-card p-4">
            <div className="flex items-center gap-2 mb-2 font-medium">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              Completed Jobs
            </div>
            {completedJobs.map(renderJobCard)}
          </div>
        </div>
      )}
    </div>
  );
}

export default JobsView;
