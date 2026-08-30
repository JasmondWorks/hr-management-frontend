"use client";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, InputField } from "@/shared/ui";
import { useCreateDepartment } from "@/features/department";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { departmentSchema, type DepartmentFormValues } from "../schema";

interface AddDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddDepartmentModal({ isOpen, onClose }: AddDepartmentModalProps) {
  const create = useCreateDepartment();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DepartmentFormValues>({
    resolver: zodResolver(departmentSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      description: "",
      location: "",
    },
  });

  const onSubmit = (data: DepartmentFormValues) => {
    create.mutate(
      { 
        name: data.name, 
        description: data.description || undefined, 
        location: data.location || undefined 
      },
      {
        onSuccess: () => {
          toast.success("Department created");
          reset();
          onClose();
        },
        onError: (error) => toast.error(getApiErrorMessage(error, "Failed to create department")),
      }
    );
  };

  return (
    <Modal title="Add New Department" isOpen={isOpen} onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <InputField
          label="Department Name"
          placeholder="e.g. Engineering"
          {...register("name")}
          errorMessage={errors.name?.message}
        />
        <InputField
          label="Description"
          placeholder="e.g. Software development"
          {...register("description")}
          errorMessage={errors.description?.message}
        />
        <InputField
          label="Location"
          placeholder="e.g. Building A"
          {...register("location")}
          errorMessage={errors.location?.message}
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={create.isPending}>
            {create.isPending ? "Adding…" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
