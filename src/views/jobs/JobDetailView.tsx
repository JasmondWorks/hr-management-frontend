"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Building, DollarSign, MapPin, Briefcase } from "lucide-react";
import { useJob } from "@/features/jobs/hooks/useJobs";
import { applyToJob } from "@/features/jobs/jobs.service";
import { useAuth } from "@/features/auth";
import { Card } from "@/shared/ui/shad-cn/card";
import { Button } from "@/shared/ui/shad-cn/button";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { formatBackendConstant } from "@/shared/lib/utils";

export function JobDetailView() {
  const { id } = useParams() as { id: string };
  const { isAdmin } = useAuth();
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  const { data: job, isLoading } = useJob(id);

  const handleApply = async () => {
    if (!job) return;
    try {
      setApplying(true);
      await applyToJob(job.id);
      toast.success(`Applied to ${job.name}`);
      setApplied(true);
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } } };
      toast.error(e.response?.data?.message || "Failed to apply.");
    } finally {
      setApplying(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading job...</div>;
  }

  if (!job) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground">Job not found.</p>
        <Link href="/jobs" className="text-primary hover:underline">
          Back to Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{job.name}</h1>
          <div className="text-sm text-muted-foreground mt-1 flex items-center space-x-2">
            <Link href="/jobs" className="hover:text-primary">
              All Jobs
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">{job.name}</span>
          </div>
        </div>

        {!isAdmin && (
          <Button
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={applying || applied || job.status === "CLOSED"}
            onClick={handleApply}
          >
            {applied
              ? "Applied"
              : applying
                ? "Applying…"
                : job.status === "CLOSED"
                  ? "Closed"
                  : "Apply Now"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border p-6 lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/15 text-primary flex items-center justify-center">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">{job.name}</h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" />
                {job.department?.name || "Department"}
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Description
            </h3>
            <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">
              {job.description || "No description provided."}
            </p>
          </div>
        </Card>

        <Card className="bg-card border-border p-6 flex flex-col gap-4 h-fit">
          <h3 className="text-sm font-medium text-muted-foreground">Overview</h3>
          <InfoRow
            icon={<MapPin className="h-4 w-4" />}
            label="Location"
            value={job.workLocation ? formatBackendConstant(job.workLocation) : "On Site"}
          />
          <InfoRow
            icon={<Briefcase className="h-4 w-4" />}
            label="Contract"
            value={job.contractType ? formatBackendConstant(job.contractType) : "Full Time"}
          />
          {job.amount != null && (
            <InfoRow
              icon={<DollarSign className="h-4 w-4" />}
              label="Salary"
              value={`$${job.amount.toLocaleString()}/yr`}
            />
          )}
          <InfoRow
            icon={<Building className="h-4 w-4" />}
            label="Department"
            value={job.department?.name || "—"}
          />
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-muted-foreground">Status</span>
            <StatusBadge
              status={job.status === "OPEN" ? "SUCCESS" : "DANGER"}
              label={job.status === "OPEN" ? "Open" : "Closed"}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

export default JobDetailView;
