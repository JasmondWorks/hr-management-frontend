"use client";

import React from "react";
import { Modal } from "@/shared/ui/Modal";
import { InputField, Button, CountryStateCitySelector, SelectField } from "@/shared/ui";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editProfileSchema, type EditProfileFormValues } from "@/features/employee/schema";
import toast from "react-hot-toast";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeData?: any; // To be typed properly later
}

export function EditProfileModal({ isOpen, onClose, employeeData }: EditProfileModalProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    mode: "onChange",
    defaultValues: {
      firstName: employeeData?.firstName || "",
      lastName: employeeData?.lastName || "",
      phone: employeeData?.phone || "",
      dob: employeeData?.dob || "",
      maritalStatus: employeeData?.maritalStatus || "",
      gender: employeeData?.gender || "",
      country: employeeData?.country || "",
      address: employeeData?.address || "",
      city: employeeData?.city || "",
      state: employeeData?.state || "",
      zip: employeeData?.zip || "",
    },
  });

  const onSubmit = (data: EditProfileFormValues) => {
    console.log("Profile Data:", data);
    toast.success("Profile saved (Backend integration pending)");
    onClose();
  };

  return (
    <Modal title="Edit Profile" isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Read Only Fields */}
        <div className="md:col-span-2 flex flex-col gap-1 mb-2">
          <span className="text-sm text-muted-foreground">Email Address</span>
          <span className="text-sm text-foreground bg-accent/50 px-3 py-2 rounded-lg cursor-not-allowed border border-border">
            {employeeData?.email || "dina.c@gmail.com"}
          </span>
        </div>

        {/* Editable Fields */}
        <div className="flex flex-col gap-1">
          <InputField label="First Name" placeholder="First Name" {...register("firstName")} />
          {errors.firstName && <span className="text-xs text-destructive">{errors.firstName.message}</span>}
        </div>
        
        <div className="flex flex-col gap-1">
          <InputField label="Last Name" placeholder="Last Name" {...register("lastName")} />
          {errors.lastName && <span className="text-xs text-destructive">{errors.lastName.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <InputField label="Mobile Number" placeholder="Mobile Number" {...register("phone")} />
          {errors.phone && <span className="text-xs text-destructive">{errors.phone.message}</span>}
        </div>

        <div className="flex flex-col gap-1">
          <InputField label="Date of Birth" placeholder="Date of Birth" type="date" {...register("dob")} />
          {errors.dob && <span className="text-xs text-destructive">{errors.dob.message}</span>}
        </div>
        
        <SelectField
          label="Marital Status"
          placeholder="Marital Status"
          options={["Single", "Married", "Divorced"]}
          {...register("maritalStatus")}
          value={watch("maritalStatus")}
          errorMessage={errors.maritalStatus?.message}
        />

        <SelectField
          label="Gender"
          placeholder="Gender"
          options={["Male", "Female", "Other"]}
          {...register("gender")}
          value={watch("gender")}
          errorMessage={errors.gender?.message}
        />

        <CountryStateCitySelector register={register} watch={watch} setValue={setValue} errors={errors} />

        <div className="md:col-span-2 flex flex-col gap-1">
          <InputField label="Address" placeholder="Address" {...register("address")} />
          {errors.address && <span className="text-xs text-destructive">{errors.address.message}</span>}
        </div>
        <SelectField
          label="ZIP Code"
          placeholder="ZIP Code"
          options={["00666"]}
          {...register("zip")}
          value={watch("zip")}
          errorMessage={errors.zip?.message}
        />

        <div className="md:col-span-2 flex justify-end gap-3 mt-6">
          <Button type="button" onClick={onClose} variant="secondary">Cancel</Button>
          <Button type="submit" variant="default">Save Changes</Button>
        </div>
      </form>
    </Modal>
  );
}
