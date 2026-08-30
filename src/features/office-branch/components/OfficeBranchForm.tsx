"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  InputField,
  CheckboxField,
  CountryStateCitySelector,
} from "@/shared/ui";
import { officeBranchSchema, type OfficeBranchFormValues } from "../schema";
import type { OfficeBranch, OfficeBranchPayload } from "../api/office-branch.service";

interface OfficeBranchFormProps {
  branch?: OfficeBranch;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: (payload: OfficeBranchPayload) => void;
  onCancel?: () => void;
}

/**
 * The branch add/edit form itself, without any surrounding chrome — so it can be
 * used inside a modal on the settings page and inline in the onboarding wizard.
 */
export function OfficeBranchForm({
  branch,
  isSubmitting,
  submitLabel = "Save branch",
  onSubmit,
  onCancel,
}: OfficeBranchFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OfficeBranchFormValues>({
    resolver: zodResolver(officeBranchSchema),
    mode: "onChange",
    defaultValues: {
      name: branch?.name ?? "",
      address: branch?.address ?? "",
      country: branch?.country ?? "",
      state: branch?.state ?? "",
      city: branch?.city ?? "",
      zipCode: branch?.zipCode ?? "",
      phone: branch?.phone ?? "",
      email: branch?.email ?? "",
      isHeadquarters: branch?.isHeadquarters ?? false,
    },
  });

  const submit = (values: OfficeBranchFormValues) => {
    onSubmit({
      name: values.name,
      address: values.address,
      country: values.country,
      state: values.state,
      city: values.city,
      // Empty optional inputs are sent as "" by the DOM; the API expects them
      // absent rather than blank (and rejects "" for email).
      zipCode: values.zipCode || undefined,
      phone: values.phone || undefined,
      email: values.email || undefined,
      isHeadquarters: values.isHeadquarters ?? false,
    });
    reset(values);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(submit)}>
      <InputField
        label="Branch Name"
        placeholder="e.g. Lagos Headquarters"
        {...register("name")}
        errorMessage={errors.name?.message}
      />
      <InputField
        label="Address"
        placeholder="e.g. 1 Marina Road"
        {...register("address")}
        errorMessage={errors.address?.message}
      />

      <CountryStateCitySelector
        register={register}
        watch={watch}
        setValue={setValue}
        errors={errors}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <InputField
          label="ZIP Code"
          placeholder="e.g. 100001"
          {...register("zipCode")}
          errorMessage={errors.zipCode?.message}
        />
        <InputField
          label="Phone"
          placeholder="e.g. 08012345678"
          {...register("phone")}
          errorMessage={errors.phone?.message}
        />
      </div>

      <InputField
        label="Branch Email"
        placeholder="e.g. lagos@acme.com"
        {...register("email")}
        errorMessage={errors.email?.message}
      />

      <CheckboxField
        label="This is the headquarters"
        description="Only one branch can be the headquarters — setting this unsets any other."
        {...register("isHeadquarters")}
        errorMessage={errors.isHeadquarters?.message}
      />

      <div className="flex justify-end gap-2 pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
