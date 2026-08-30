"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Building } from "lucide-react";
import { listJobs } from "@/features/jobs/jobs.service";
import type { Job } from "@/features/jobs/types";
import { JobCard } from "@/features/jobs/components/JobCard";
import {
  applicationService,
  type Application,
  type ApplicationStatus,
} from "@/features/applications";
import { cn } from "@/shared/lib/utils";

type Tab = "all" | "mine";

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  APPLIED: "bg-primary/15 text-primary",
  INTERVIEW: "bg-warning/15 text-warning",
  OFFERED: "bg-primary/15 text-primary",
  ACCEPTED: "bg-success/15 text-success",
  REJECTED: "bg-destructive/15 text-destructive",
};

export function CandidateJobsView() {
  const [tab, setTab] = useState<Tab>("all");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [jobsRes, appsRes] = await Promise.all([
        listJobs({ limit: "100" }),
        applicationService.getMyApplications(),
      ]);
      setJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch {
      toast.error("Failed to load jobs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  // Job ids the candidate has already applied to (their own applications).
  const appliedJobIds = new Set(applications.map((a) => a.jobId));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Jobs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Browse open roles and track your applications.
        </p>
      </div>

      {/* Tabs */}
      <div className="inline-flex items-center gap-1 self-start rounded-full border border-border bg-card p-1">
        {(
          [
            ["all", "All jobs"],
            ["mine", `My applications${applications.length ? ` (${applications.length})` : ""}`],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setTab(value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-40 animate-pulse rounded-card border border-border bg-card"
            />
          ))}
        </div>
      ) : tab === "all" ? (
        jobs.length ? (
          <div className="flex flex-col gap-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onApply={load}
                applied={appliedJobIds.has(job.id)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No open jobs"
            subtitle="Check back soon for new opportunities."
          />
        )
      ) : applications.length ? (
        <div className="flex flex-col gap-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className="flex items-center justify-between gap-4 rounded-card border border-border bg-card p-5"
            >
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {app.job?.name ?? "Job"}
                </h3>
                <span className="mt-1 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Building className="size-3.5" />
                  {app.job?.department?.name ?? "—"} · applied{" "}
                  {new Date(app.appliedAt).toLocaleDateString()}
                </span>
              </div>
              <span
                className={cn(
                  "rounded-full px-2.5 py-0.5 text-xs font-medium",
                  STATUS_STYLES[app.status],
                )}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No applications yet"
          subtitle="Apply to a job from the All jobs tab to see it here."
        />
      )}
    </div>
  );
}

function EmptyState({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="rounded-card border border-border bg-card p-10 text-center">
      <h3 className="text-sm font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
    </div>
  );
}

export default CandidateJobsView;
