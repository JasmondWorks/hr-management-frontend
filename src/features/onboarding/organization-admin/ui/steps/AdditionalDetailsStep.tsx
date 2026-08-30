import React from "react";
import { InputField } from "@/shared/ui";
import { useFormContext } from "react-hook-form";
import type { OrganizationOnboardingFormValues } from "../../schema";

export function AdditionalDetailsStep() {
  const { register, formState: { errors } } = useFormContext<OrganizationOnboardingFormValues>();

  return (
    <div className="space-y-4">
      <InputField
        label="Website"
        type="url"
        placeholder="https://example.com"
        {...register("website")}
        errorMessage={errors.website?.message}
      />
      <InputField
        label="Logo URL"
        type="url"
        placeholder="https://example.com/logo.png"
        {...register("logo")}
        errorMessage={errors.logo?.message}
      />
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder="A brief description of your organization"
          {...register("description")}
        />
        {errors.description && (
          <p className="text-xs text-destructive">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
