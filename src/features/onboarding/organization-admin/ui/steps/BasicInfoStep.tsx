import React from "react";
import { InputField } from "@/shared/ui";
import { useFormContext } from "react-hook-form";
import type { OrganizationOnboardingFormValues } from "../../schema";

export function BasicInfoStep() {
  const { register, formState: { errors } } = useFormContext<OrganizationOnboardingFormValues>();

  return (
    <div className="space-y-4">
      <InputField
        label="Organization Name"
        {...register("name")}
        errorMessage={errors.name?.message}
      />
      <InputField
        label="Organization Email"
        type="email"
        {...register("email")}
        errorMessage={errors.email?.message}
      />
      <InputField
        label="Phone Number"
        type="tel"
        {...register("phone")}
        errorMessage={errors.phone?.message}
      />
    </div>
  );
}
