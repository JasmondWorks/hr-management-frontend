"use client";

import React, { useState } from "react";
import { Modal } from "@/shared/ui/Modal";
import { Button, SelectField } from "@/shared/ui";
import { useAuth } from "@/features/auth";
import { useDepartments } from "@/features/department/hooks/useDepartments";
import { 
  useUpdateEmployeeRole, 
  useAssignEmployeeDepartment 
} from "@/entities/employee/hooks/useEmployees";
import toast from "react-hot-toast";

interface ManageRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: any;
}

const BUSINESS_ROLES = [
  { value: "REGULAR", label: "Team Member" },
  { value: "DEPARTMENT_ADMIN", label: "Department Admin" },
  { value: "HR", label: "HR" },
  { value: "ORGANIZATION_ADMIN", label: "Organization Admin" },
];

export function ManageRoleModal({ isOpen, onClose, employee }: ManageRoleModalProps) {
  const { isAdmin } = useAuth();
  const updateRole = useUpdateEmployeeRole();
  const assignDepartment = useAssignEmployeeDepartment();
  
  const { data: departmentsResponse, isLoading: isLoadingDepartments } = useDepartments();
  const departments = departmentsResponse?.data || [];

  const initialRole = employee?.user?.businessRole || "REGULAR";
  const initialDepartment = employee?.departmentId || "";

  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [selectedDepartment, setSelectedDepartment] = useState<string>(initialDepartment);

  const handleSave = async () => {
    try {
      // If role changed
      if (selectedRole !== initialRole) {
        await updateRole.mutateAsync({ 
          id: employee.id, 
          businessRole: selectedRole 
        });
      }

      // If department changed (or needs to be assigned for Dept Admin)
      if (selectedRole === "DEPARTMENT_ADMIN" && selectedDepartment && selectedDepartment !== initialDepartment) {
        await assignDepartment.mutateAsync({
          id: employee.id,
          departmentId: selectedDepartment
        });
      } else if (selectedRole !== "DEPARTMENT_ADMIN" && selectedDepartment !== initialDepartment) {
        // Optional: If you want to sync department even if they aren't dept admin
        await assignDepartment.mutateAsync({
          id: employee.id,
          departmentId: selectedDepartment || null
        });
      }

      toast.success("Role managed successfully");
      onClose();
    } catch (error) {
      toast.error("Failed to update role or department");
    }
  };

  const isSaving = updateRole.isPending || assignDepartment.isPending;

  return (
    <Modal title="Manage Business Role" isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6 mt-4">
        <div>
          <p className="text-sm text-muted-foreground">
            Update the functional role and permissions for <strong>{employee?.user?.firstName} {employee?.user?.lastName}</strong>.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <SelectField
            label="Business Role"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            disabled={!isAdmin || isSaving}
            options={BUSINESS_ROLES}
          />
        </div>

        {selectedRole === "DEPARTMENT_ADMIN" && (
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-foreground">Target Department <span className="text-destructive">*</span></label>
            <p className="text-xs text-muted-foreground mb-1">
              Select the department this admin will manage.
            </p>
            <SelectField
              label="Target Department"
              placeholder="Select a department"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              disabled={!isAdmin || isSaving || isLoadingDepartments}
              options={departments.map((dept: any) => ({ label: dept.name, value: dept.id }))}
            />
          </div>
        )}

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={onClose} variant="secondary" disabled={isSaving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !isAdmin || (selectedRole === "DEPARTMENT_ADMIN" && !selectedDepartment)}
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
