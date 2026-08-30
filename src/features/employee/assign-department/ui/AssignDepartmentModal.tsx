"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Modal, Button, SelectField } from "@/shared/ui";
import { useDepartments } from "@/features/department";
import { useAssignEmployeeDepartment } from "@/entities/employee/hooks/useEmployees";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import type { Employee } from "@/entities/employee/types";

interface AssignDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee?: Employee | null;
}

const UNASSIGNED = "";

/**
 * Used from both the employees table and the employee details page, so the two
 * cannot drift apart.
 */
export function AssignDepartmentModal({
  isOpen,
  onClose,
  employee,
}: AssignDepartmentModalProps) {
  const { data: deptData, isLoading: isLoadingDepartments } = useDepartments({
    limit: 100,
  });
  const assign = useAssignEmployeeDepartment();

  const currentDepartmentId = employee?.departmentId ?? UNASSIGNED;
  const [selected, setSelected] = useState<string>(currentDepartmentId);

  // Re-seed when the modal is opened for a different employee — the component
  // stays mounted between rows in the table.
  useEffect(() => {
    if (isOpen) setSelected(currentDepartmentId);
  }, [isOpen, currentDepartmentId]);

  const departments = deptData?.data ?? [];
  const name = employee?.user
    ? `${employee.user.firstName} ${employee.user.lastName}`
    : "this employee";

  const isUnchanged = selected === currentDepartmentId;

  const handleSave = () => {
    if (!employee) return;

    assign.mutate(
      // An empty selection clears the assignment; the API takes null for that.
      { id: employee.id, departmentId: selected || null },
      {
        onSuccess: () => {
          toast.success(
            selected
              ? `${name} moved to ${departments.find((d) => d.id === selected)?.name}`
              : `${name} removed from their department`,
          );
          onClose();
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to assign department")),
      },
    );
  };

  return (
    <Modal title="Assign Department" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted-foreground">
          Choose the department <strong>{name}</strong> belongs to.
        </p>

        <SelectField
          label="Department"
          placeholder="No department"
          value={selected}
          onChange={(e) => setSelected(e.target.value)}
          disabled={isLoadingDepartments || assign.isPending}
          options={[
            { label: "No department", value: UNASSIGNED },
            ...departments.map((d) => ({ label: d.name, value: d.id })),
          ]}
        />

        {departments.length === 0 && !isLoadingDepartments && (
          <p className="text-xs text-muted-foreground">
            No departments exist yet. Create one from the Departments page first.
          </p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={assign.isPending || isUnchanged}
          >
            {assign.isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
