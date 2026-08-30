"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { PlusCircle } from "@/shared/ui/icons";
import {
  useProjects,
  useCreateProject,
  type Project,
} from "@/features/projects";
import { useAuth } from "@/features/auth";
import Table from "@/shared/ui/Table";
import type { TableColumn } from "@/shared/ui/Table/types";
import { StatusBadge } from "@/shared/ui/StatusBadge";
import { Modal, Button, InputField } from "@/shared/ui";

export function ProjectsView() {
  const { isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    finishDate: "",
    timeline: "",
  });

  const { data, isLoading } = useProjects(isAdmin ? "org" : "mine", {
    limit: 100,
  });
  const projects = data?.data ?? [];

  const create = useCreateProject();

  const submitCreate = (e: React.FormEvent) => {
    e.preventDefault();
    create.mutate(
      {
        name: form.name,
        startDate: form.startDate,
        finishDate: form.finishDate || undefined,
        timeline: form.timeline || undefined,
      },
      {
        onSuccess: () => {
          toast.success("Project created");
          setOpen(false);
          setForm({ name: "", startDate: "", finishDate: "", timeline: "" });
        },
        onError: () => toast.error("Failed to create project"),
      },
    );
  };

  const columns: TableColumn<Project>[] = [
    { key: "name", label: "Project", render: (row) => row.name },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <StatusBadge status={row.status}>
          {row.status.replace("_", " ")}
        </StatusBadge>
      ),
    },
    {
      key: "startDate",
      label: "Start",
      render: (row) => new Date(row.startDate).toLocaleDateString(),
    },
    {
      key: "finishDate",
      label: "Finish",
      render: (row) =>
        row.finishDate ? new Date(row.finishDate).toLocaleDateString() : "—",
    },
    {
      key: "collaborators",
      label: "Collaborators",
      render: (row) => String(row.collaborators?.length ?? 0),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isAdmin
              ? "Manage your organization's projects."
              : "Projects you collaborate on."}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <PlusCircle className="size-4" /> New Project
          </button>
        )}
      </div>

      <Table
        columns={columns}
        data={projects}
        loading={isLoading}
        getRowHref={(row) => `/projects/${row.id}`}
        isPaginated={false}
        emptyMessage={
          isAdmin ? "No projects yet." : "You're not on any projects yet."
        }
      />

      <Modal title="New Project" isOpen={open} onClose={() => setOpen(false)}>
        <form className="flex flex-col gap-4" onSubmit={submitCreate}>
          <InputField
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <InputField
            label="Start date"
            type="date"
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            required
          />
          <InputField
            label="Finish date"
            type="date"
            value={form.finishDate}
            onChange={(e) => setForm({ ...form, finishDate: e.target.value })}
          />
          <InputField
            label="Timeline / notes"
            value={form.timeline}
            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ProjectsView;
