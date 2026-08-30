"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Mail, Briefcase, Calendar, Check, X } from "lucide-react";
import {
  useApplications,
  useAcceptApplication,
  useRejectApplication,
} from "@/features/applications";
import { useAuth } from "@/features/auth";
import { Card } from "@/shared/ui/shad-cn/card";
import { Button } from "@/shared/ui/shad-cn/button";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { ConfirmationModal } from "@/shared/ui/ConfirmationModal";

const STATUS: Record<
  string,
  { label: string; variant: "SUCCESS" | "WARNING" | "DANGER" | "INFO" }
> = {
  APPLIED: { label: "In Process", variant: "WARNING" },
  INTERVIEW: { label: "Interview", variant: "INFO" },
  OFFERED: { label: "Offered", variant: "SUCCESS" },
  ACCEPTED: { label: "Selected", variant: "SUCCESS" },
  REJECTED: { label: "Rejected", variant: "DANGER" },
};

export function CandidateDetailView() {
  const { id } = useParams() as { id: string };
  const { isAdmin } = useAuth();
  const [rejectOpen, setRejectOpen] = useState(false);

  const { data, isLoading } = useApplications("org", { limit: 100 });
  const application = data?.data?.find((a) => a.id === id);

  const accept = useAcceptApplication();
  const reject = useRejectApplication();

  const candidate = application?.candidate;
  const status = application ? STATUS[application.status] : undefined;
  const isPending = application?.status === "APPLIED" || application?.status === "INTERVIEW";

  const handleAccept = () =>
    application &&
    accept.mutate(application.id, {
      onSuccess: () => toast.success(`Application for ${application.job?.name || "job"} accepted`),
      onError: () => toast.error("Failed to accept application"),
    });

  const handleReject = () =>
    application &&
    reject.mutate(application.id, {
      onSuccess: () => {
        toast.success(`Application for ${application.job?.name || "job"} rejected`);
        setRejectOpen(false);
      },
      onError: () => toast.error("Failed to reject application"),
    });

  if (isLoading) {
    return <div className="text-muted-foreground">Loading candidate...</div>;
  }

  if (!application) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground">Candidate not found.</p>
        <Link href="/candidates" className="text-primary hover:underline">
          Back to Candidates
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {candidate?.firstName} {candidate?.lastName}
          </h1>
          <div className="text-sm text-muted-foreground mt-1 flex items-center space-x-2">
            <Link href="/candidates" className="hover:text-primary">
              All Candidates
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">
              {candidate?.firstName} {candidate?.lastName}
            </span>
          </div>
        </div>

        {isAdmin && isPending && (
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10"
              disabled={reject.isPending || accept.isPending}
              onClick={() => setRejectOpen(true)}
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={accept.isPending || reject.isPending}
              onClick={handleAccept}
            >
              <Check className="mr-2 h-4 w-4" />
              {accept.isPending ? "Accepting Application…" : "Accept Application"}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border p-6 flex flex-col items-center text-center gap-3 lg:col-span-1">
          <div className="h-20 w-20 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-2xl font-semibold">
            {candidate?.firstName?.[0]}
            {candidate?.lastName?.[0]}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {candidate?.firstName} {candidate?.lastName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {application.job?.name || "Applicant"}
            </p>
          </div>
          {status && <StatusBadge status={status.variant} label={status.label} />}
        </Card>

        <Card className="bg-card border-border p-6 lg:col-span-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Application Details
          </h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
            <DetailRow
              icon={<Mail className="h-4 w-4" />}
              label="Email Address"
              value={candidate?.email || "—"}
            />
            <DetailRow
              icon={<Briefcase className="h-4 w-4" />}
              label="Applied For"
              value={application.job?.name || "—"}
            />
            <DetailRow
              icon={<Briefcase className="h-4 w-4" />}
              label="Department"
              value={application.job?.department?.name || "—"}
            />
            <DetailRow
              icon={<Calendar className="h-4 w-4" />}
              label="Applied Date"
              value={
                application.appliedAt
                  ? new Date(application.appliedAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "—"
              }
            />
          </dl>
        </Card>
      </div>

      <ConfirmationModal
        isOpen={rejectOpen}
        title="Reject Application"
        message={
          <>
            <span className="font-medium text-foreground">
              {candidate?.firstName} {candidate?.lastName}
            </span>{" "}
            will be rejected for the {application.job?.name || "requested"} role. This action cannot be undone.
          </>
        }
        confirmText="Reject"
        isDestructive
        isLoading={reject.isPending}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
      />
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="text-sm font-medium text-foreground mt-0.5">{value}</dd>
      </div>
    </div>
  );
}

export default CandidateDetailView;
