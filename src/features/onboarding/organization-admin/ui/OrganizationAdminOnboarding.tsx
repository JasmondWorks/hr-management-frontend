"use client";

import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/shared/ui/shad-cn/card";
import { Button } from "@/shared/ui/shad-cn/button";
import { OrganizationPayload } from "@/entities/organization/organization.types";
import { useCreateOrganization } from "@/features/organization/api/useCreateOrganization";
import { useMyOrganization } from "@/features/organization/api/useMyOrganization";
import { useAuth } from "@/features/auth";
import { ROUTES } from "@/shared/lib/constants";
import { refreshAccessToken } from "@/shared/lib/axios";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { LogoutButton } from "@/shared/ui";
import { useMarkOnboardingComplete } from "../../hooks/useOnboarding";
import toast from "react-hot-toast";
import { BasicInfoStep } from "./steps/BasicInfoStep";
import { AddressStep } from "./steps/AddressStep";
import { AdditionalDetailsStep } from "./steps/AdditionalDetailsStep";
import { OfficeBranchesStep } from "./steps/OfficeBranchesStep";
import { InviteEmployeesStep } from "./steps/InviteEmployeesStep";
import {
  organizationOnboardingSchema,
  type OrganizationOnboardingFormValues,
} from "../schema";
import { useCreateInvitationsBulk } from "@/features/invitation";

const STEPS = [
  "Basic Information",
  "Address",
  "Additional Details",
  "Office Branches",
  "Invite Team",
];

// The organization is created at the end of this step. Everything after it
// operates on the live organization rather than on wizard state.
const CREATE_STEP = 2;

const basicInfoFields = ["name", "email", "phone"] as const;
const addressFields = [
  "address",
  "country",
  "state",
  "city",
  "zipCode",
] as const;

export function OrganizationAdminOnboarding() {
  const { user } = useAuth();
  const { data: myOrg, isLoading: orgLoading } = useMyOrganization();
  const markComplete = useMarkOnboardingComplete();

  const [currentStep, setCurrentStep] = useState<number | null>(null);

  // The organization may already exist from an earlier visit — the admin got as
  // far as creating it and then reloaded, or was invited straight into an
  // organization someone else set up. Either way the first three steps are done.
  const hasOrganization = Boolean(user?.organizationId) || Boolean(myOrg?.data);

  const { mutate: createOrganization, isPending } = useCreateOrganization({
    onSettled: "stay",
  });

  const methods = useForm<OrganizationOnboardingFormValues>({
    resolver: zodResolver(organizationOnboardingSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      country: "",
      state: "",
      city: "",
      zipCode: "",
      website: "",
      logo: "",
      description: "",
    },
  });

  const { handleSubmit, trigger } = methods;

  // Resume at the right step once we know whether the organization exists.
  // Previously this redirected to the dashboard, which is exactly what made a
  // mid-wizard refresh skip the office-branch and invitation steps for good.
  useEffect(() => {
    if (currentStep !== null || orgLoading) return;
    setCurrentStep(hasOrganization ? CREATE_STEP + 1 : 0);
  }, [currentStep, hasOrganization, orgLoading]);

  const handleNext = async () => {
    if (currentStep === null) return;

    if (currentStep === 0) {
      if (await trigger(basicInfoFields)) setCurrentStep(1);
      return;
    }

    if (currentStep === 1) {
      if (await trigger(addressFields)) setCurrentStep(2);
      return;
    }

    // Leaving the details step is what creates the organization; the remaining
    // steps need its id, so they cannot run before this succeeds.
    if (currentStep === CREATE_STEP) {
      if (!(await trigger())) return;
      createOrganization(methods.getValues() as OrganizationPayload, {
        onSuccess: () => setCurrentStep(CREATE_STEP + 1),
      });
      return;
    }

    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    // Going back into the organization form after it has been created would let
    // the user edit fields that are no longer what the wizard submits.
    if (currentStep !== null && currentStep > 0 && currentStep <= CREATE_STEP) {
      setCurrentStep(currentStep - 1);
    }
  };

  const bulkInvite = useCreateInvitationsBulk();

  // Only here is onboarding actually finished — which is what makes a refresh at
  // any earlier point land the admin back in the wizard rather than past it.
  const finish = async () => {
    try {
      const invitations = methods.getValues().invitations || [];
      
      // If there are staged invitations, send them first
      if (invitations.length > 0) {
        await bulkInvite.mutateAsync(
          invitations.map((inv: any) => ({
            email: inv.email,
            departmentId: inv.departmentId,
            officeBranchId: inv.officeBranchId,
            businessRole: inv.businessRole,
          }))
        );
      }

      markComplete.mutate(undefined, {
        onSuccess: async () => {
          // Mint a token carrying isOnboarded before navigating, or the gate
          // sends us straight back.
          await refreshAccessToken();
          window.location.href = ROUTES.dashboard;
        },
        onError: (error) =>
          toast.error(getApiErrorMessage(error, "Could not finish setup")),
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to send invitations"));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep />;
      case 1:
        return <AddressStep />;
      case 2:
        return <AdditionalDetailsStep />;
      case 3:
        return <OfficeBranchesStep />;
      case 4:
        return <InviteEmployeesStep />;
      default:
        return null;
    }
  };

  // Hold the spinner until we know which step to resume at, so the first three
  // steps never flash for someone who already has an organization.
  if (currentStep === null) {
    return (
      <div className="flex w-full items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const isPostCreationStep = currentStep > CREATE_STEP;
  const isLastStep = currentStep === STEPS.length - 1;
  const isFinishing = markComplete.isPending;

  return (
    <>
      <div className="fixed top-6 right-6 z-50">
        <LogoutButton className="bg-card border border-border rounded-full px-4 py-2 text-sm shadow-sm" />
      </div>
      <div className="w-full max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome to HR Search
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Let&apos;s get your organization set up so you can start managing
            your team.
          </p>
        </div>

        <Card className="p-6 sm:p-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2 gap-1">
              {STEPS.map((step, index) => (
                <div
                  key={step}
                  className={`text-[11px] sm:text-xs font-medium text-center ${
                    index <= currentStep
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  {step}
                </div>
              ))}
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-secondary">
              <div
                style={{
                  width: `${((currentStep + 1) / STEPS.length) * 100}%`,
                }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary transition-all duration-300"
              />
            </div>
          </div>

          <FormProvider {...methods}>
            {/* The post-creation steps run their own mutations, so submitting
                the organization form there would be meaningless. */}
            <form onSubmit={handleSubmit(handleNext)}>
              <div className="min-h-[250px]">{renderStep()}</div>

              <div className="mt-8 flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0 || isPending || isPostCreationStep}
                >
                  Back
                </Button>

                {isPostCreationStep ? (
                  <div className="flex gap-2">
                    {!isLastStep && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep + 1)}
                      >
                        Skip for now
                      </Button>
                    )}
                    <Button
                      type="button"
                      disabled={isFinishing}
                      onClick={
                        isLastStep ? finish : () => setCurrentStep(currentStep + 1)
                      }
                    >
                      {isLastStep
                        ? isFinishing
                          ? "Finishing..."
                          : "Finish setup"
                        : "Next"}
                    </Button>
                  </div>
                ) : (
                  <Button
                    key="next"
                    type="button"
                    onClick={handleNext}
                    disabled={isPending}
                  >
                    {currentStep === CREATE_STEP
                      ? isPending
                        ? "Creating..."
                        : "Create Organization"
                      : "Next"}
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </Card>
      </div>
    </>
  );
}
