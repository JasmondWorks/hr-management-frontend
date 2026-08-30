"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { Calendar, Users, Clock } from "lucide-react";
import {
  useProject,
  useUpdateProjectStatus,
} from "@/features/projects";
import type { ProjectStatus } from "@/features/projects";
import { useAuth } from "@/features/auth";
import { Card } from "@/shared/ui/shad-cn/card";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { SelectField } from "@/shared/ui/SelectField";

const STATUS_OPTIONS: ProjectStatus[] = [
  "PLANNED",
  "IN_PROGRESS",
  "ON_HOLD",
  "COMPLETED",
  "CANCELLED",
];

const STATUS_VARIANT: Record<
  ProjectStatus,
  "SUCCESS" | "WARNING" | "DANGER" | "INFO"
> = {
  PLANNED: "INFO",
  IN_PROGRESS: "WARNING",
  ON_HOLD: "WARNING",
  COMPLETED: "SUCCESS",
  CANCELLED: "DANGER",
};

const fmtStatus = (s: ProjectStatus) =>
  s.charAt(0) + s.slice(1).toLowerCase().replace("_", " ");

const fmtDate = (iso: string | null) =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "—";

export function ProjectDetailView() {
  const { id } = useParams() as { id: string };
  const { isAdmin } = useAuth();

  const { data, isLoading } = useProject(id);
  const project = data?.data;

  const updateStatus = useUpdateProjectStatus();

  const handleStatusChange = (status: ProjectStatus) => {
    if (!project) return;
    updateStatus.mutate(
      { id: project.id, status },
      {
        onSuccess: () => toast.success("Project status updated"),
        onError: () => toast.error("Failed to update status"),
      },
    );
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading project...</div>;
  }

  if (!project) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-muted-foreground">Project not found.</p>
        <Link href="/projects" className="text-primary hover:underline">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full pb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {project.name}
          </h1>
          <div className="text-sm text-muted-foreground mt-1 flex items-center space-x-2">
            <Link href="/projects" className="hover:text-primary">
              All Projects
            </Link>
            <span>&gt;</span>
            <span className="text-foreground">{project.name}</span>
          </div>
        </div>

        {isAdmin ? (
          <div className="w-40">
            <SelectField
              label=""
              value={project.status}
              disabled={updateStatus.isPending}
              onChange={(e) => handleStatusChange(e.target.value as ProjectStatus)}
              options={STATUS_OPTIONS.map((s) => ({
                label: fmtStatus(s),
                value: s,
              }))}
            />
          </div>
        ) : (
          <StatusBadge
            status={STATUS_VARIANT[project.status]}
            label={fmtStatus(project.status)}
          />
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-card border-border p-6 lg:col-span-2 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              {project.name}
            </h2>
            <StatusBadge
              status={STATUS_VARIANT[project.status]}
              label={fmtStatus(project.status)}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Start Date"
              value={fmtDate(project.startDate)}
            />
            <InfoRow
              icon={<Calendar className="h-4 w-4" />}
              label="Finish Date"
              value={fmtDate(project.finishDate)}
            />
            <InfoRow
              icon={<Clock className="h-4 w-4" />}
              label="Timeline"
              value={project.timeline || "—"}
            />
            <InfoRow
              icon={<Users className="h-4 w-4" />}
              label="Collaborators"
              value={String(project.collaborators?.length ?? 0)}
            />
          </div>
        </Card>

        <Card className="bg-card border-border p-6 h-fit">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Team
          </h3>
          {project.collaborators?.length ? (
            <div className="flex flex-col gap-3">
              {project.collaborators.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-secondary flex items-center justify-center text-secondary-foreground text-xs font-semibold">
                    {c.userId.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm text-foreground">
                    {c.userId.split("-")[0]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No collaborators assigned.
            </p>
          )}
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
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-muted-foreground">{icon}</div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default ProjectDetailView;
