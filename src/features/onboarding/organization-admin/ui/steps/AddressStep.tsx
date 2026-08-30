import React from "react";
import { InputField, CountryStateCitySelector } from "@/shared/ui";
import { useFormContext } from "react-hook-form";
import type { OrganizationOnboardingFormValues } from "../../schema";

export function AddressStep() {
  const { register, watch, setValue, formState: { errors } } = useFormContext<OrganizationOnboardingFormValues>();

  return (
    <div className="space-y-4">
      <InputField
        label="Street Address"
        {...register("address")}
        errorMessage={errors.address?.message}
      />
      <div className="grid grid-cols-2 gap-4">
        <CountryStateCitySelector
          register={register}
          watch={watch}
          setValue={setValue}
          errors={errors}
        />
        <InputField
          label="ZIP / Postal Code"
          {...register("zipCode")}
          errorMessage={errors.zipCode?.message}
        />
      </div>
    </div>
  );
}
