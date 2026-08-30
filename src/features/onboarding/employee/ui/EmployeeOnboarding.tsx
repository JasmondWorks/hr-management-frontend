"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/shared/ui/shad-cn/card";
import {
  Button,
  InputField,
  SelectField,
  CountryStateCitySelector,
  LogoutButton,
} from "@/shared/ui";
import { ROUTES } from "@/shared/lib/constants";
import { refreshAccessToken } from "@/shared/lib/axios";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import {
  useOnboardingContext,
  useCompleteOnboarding,
} from "../../hooks/useOnboarding";
import {
  employeeOnboardingSchema,
  type EmployeeOnboardingFormValues,
} from "../schema";
import { PrefilledContextCard } from "./PrefilledContextCard";

const GENDER_OPTIONS = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
  { label: "Other", value: "OTHER" },
];

const MARITAL_OPTIONS = [
  { label: "Single", value: "SINGLE" },
  { label: "Married", value: "MARRIED" },
  { label: "Divorced", value: "DIVORCED" },
  { label: "Widowed", value: "WIDOWED" },
];

/**
 * The employee's own onboarding. Everything the organization already knows is
 * prefilled and read-only; the employee only supplies what is personal to them.
 */
export function EmployeeOnboarding() {
  const { data, isLoading } = useOnboardingContext();
  const complete = useCompleteOnboarding();

  const context = data?.data;
  const isDone = Boolean(context?.isOnboarded);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EmployeeOnboardingFormValues>({
    resolver: zodResolver(employeeOnboardingSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      dateOfBirth: "",
      gender: "",
      maritalStatus: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelationship: "",
    },
  });

  // Seed the form once the context arrives — the name and phone they gave when
  // accepting the invitation are already known, so they only confirm them.
  useEffect(() => {
    if (!context) return;
    reset({
      firstName: context.user.firstName ?? "",
      lastName: context.user.lastName ?? "",
      phone: context.user.phone ?? "",
      dateOfBirth: context.profile?.dateOfBirth?.slice(0, 10) ?? "",
      gender: context.profile?.gender ?? "",
      maritalStatus: context.profile?.maritalStatus ?? "",
      address: context.profile?.address ?? "",
      country: context.profile?.country ?? "",
      state: context.profile?.state ?? "",
      city: context.profile?.city ?? "",
      zipCode: context.profile?.zipCode ?? "",
      emergencyContactName: context.profile?.emergencyContactName ?? "",
      emergencyContactPhone: context.profile?.emergencyContactPhone ?? "",
      emergencyContactRelationship:
        context.profile?.emergencyContactRelationship ?? "",
    });
  }, [context, reset]);

  // Someone who has already finished has no reason to be here. Refresh first:
  // the routing gate reads isOnboarded from the refresh cookie's claims, which
  // are only rewritten by a token refresh. Navigating on a stale cookie would
  // bounce us straight back here.
  useEffect(() => {
    if (!isDone) return;
    void (async () => {
      await refreshAccessToken();
      window.location.href = ROUTES.dashboard;
    })();
  }, [isDone]);

  const onSubmit = (values: EmployeeOnboardingFormValues) => {
    // Empty optional inputs arrive as ""; the API expects them absent.
    const clean = <T extends string>(v: T | "" | undefined) =>
      v === "" || v === undefined ? undefined : v;

    complete.mutate(
      {
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
        dateOfBirth: clean(values.dateOfBirth),
        gender: clean(values.gender),
        maritalStatus: clean(values.maritalStatus),
        address: clean(values.address),
        country: clean(values.country),
        state: clean(values.state),
        city: clean(values.city),
        zipCode: clean(values.zipCode),
        emergencyContactName: clean(values.emergencyContactName),
        emergencyContactPhone: clean(values.emergencyContactPhone),
        emergencyContactRelationship: clean(values.emergencyContactRelationship),
      },
      {
        onSuccess: async () => {
          toast.success("Welcome aboard!");
          // Mint a token carrying the new isOnboarded claim before navigating,
          // or the gate sends us right back.
          await refreshAccessToken();
          window.location.href = ROUTES.dashboard;
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Failed to save your details")),
      },
    );
  };

  if (isLoading || isDone) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-6 right-6 z-50">
        <LogoutButton className="bg-card border border-border rounded-full px-4 py-2 text-sm shadow-sm" />
      </div>

      <div className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {context?.organization?.name
              ? `Welcome to ${context.organization.name}`
              : "Complete your profile"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Just a few details about you, and you&apos;re done.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {context && <PrefilledContextCard context={context} />}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="First Name"
                {...register("firstName")}
                errorMessage={errors.firstName?.message}
              />
              <InputField
                label="Last Name"
                {...register("lastName")}
                errorMessage={errors.lastName?.message}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <InputField
                label="Phone Number"
                {...register("phone")}
                errorMessage={errors.phone?.message}
              />
              <InputField
                label="Date of Birth"
                type="date"
                {...register("dateOfBirth")}
                errorMessage={errors.dateOfBirth?.message}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField
                label="Gender"
                placeholder="Select Gender"
                options={GENDER_OPTIONS}
                {...register("gender")}
                value={watch("gender")}
                errorMessage={errors.gender?.message}
              />
              <SelectField
                label="Marital Status"
                placeholder="Select Marital Status"
                options={MARITAL_OPTIONS}
                {...register("maritalStatus")}
                value={watch("maritalStatus")}
                errorMessage={errors.maritalStatus?.message}
              />
            </div>

            <InputField
              label="Home Address"
              {...register("address")}
              errorMessage={errors.address?.message}
            />

            <CountryStateCitySelector
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />

            <InputField
              label="ZIP Code"
              {...register("zipCode")}
              errorMessage={errors.zipCode?.message}
            />

            <div className="mt-2 border-t border-border pt-4">
              <p className="mb-3 text-sm font-medium text-foreground">
                Emergency contact
              </p>
              <div className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <InputField
                    label="Full Name"
                    {...register("emergencyContactName")}
                    errorMessage={errors.emergencyContactName?.message}
                  />
                  <InputField
                    label="Phone Number"
                    {...register("emergencyContactPhone")}
                    errorMessage={errors.emergencyContactPhone?.message}
                  />
                </div>
                <InputField
                  label="Relationship"
                  placeholder="e.g. Sibling"
                  {...register("emergencyContactRelationship")}
                  errorMessage={errors.emergencyContactRelationship?.message}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button type="submit" disabled={complete.isPending}>
                {complete.isPending ? "Saving..." : "Finish"}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
