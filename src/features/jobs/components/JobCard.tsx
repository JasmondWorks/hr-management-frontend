"use client";

import { useState } from "react";
import { Job } from "../types";
import { applyToJob } from "../jobs.service";
import toast from "react-hot-toast";
import {
  Briefcase,
  DollarSign,
  Building,
  CheckCircle2,
  Users,
} from "lucide-react";
import { useAuth } from "@/features/auth";
import { formatBackendConstant } from "@/shared/lib";

interface JobCardProps {
  job: Job;
  onApply?: () => void;
  /** True when the logged-in candidate has already applied to this job. */
  applied?: boolean;
}

export function JobCard({ job, onApply, applied = false }: JobCardProps) {
  const [isApplying, setIsApplying] = useState(false);
  const { appRole } = useAuth();

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await applyToJob(job.id);
      toast.success("Successfully applied to " + job.name);
      if (onApply) onApply();
    } catch (error: unknown) {
      // If error is 401/403, we might need to redirect to login, handled in page level usually, or here
      const e = error as any;
      const msg =
        e.response?.data?.message ||
        "Failed to apply. Please make sure you are logged in.";
      toast.error(msg);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-card text-card-foreground border border-border rounded-card p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <Users />
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{job?.organization?.name}</span>
        </div>
      </div>
      <div className="flex justify-between items-start gap-4">
        <div>
          <h3 className="text-xl font-semibold text-foreground">{job.name}</h3>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Building className="w-4 h-4" />
            <span className="text-sm">
              {job.department?.name || "Various Departments"}
            </span>
          </div>
        </div>
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold tracking-wide">
          {job.workLocation}
        </span>
      </div>

      <p className="text-muted-foreground text-sm line-clamp-3">
        {job.description || "No description provided."}
      </p>

      <div className="flex flex-wrap items-center gap-4 mt-auto pt-4 border-t border-border">
        {job.amount && (
          <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
            <DollarSign className="w-4 h-4 text-muted-foreground" />$
            {job.amount.toLocaleString()}/yr
          </div>
        )}
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Briefcase className="w-4 h-4 text-muted-foreground" />
          {formatBackendConstant(job.contractType)}
        </div>
        {appRole === "CANDIDATE" && (
          <>
            {applied ? (
              <span className="ml-auto inline-flex items-center gap-1.5 text-sm font-medium text-success">
                <CheckCircle2 className="w-4 h-4" />
                Applied
              </span>
            ) : (
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="ml-auto bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isApplying ? "Applying..." : "Apply Now"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
