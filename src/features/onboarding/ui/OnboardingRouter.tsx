"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { APP_ROLES } from "@/shared/lib/roles";
import { ROUTES } from "@/shared/lib/constants";
import { OrganizationAdminOnboarding } from "../organization-admin/ui/OrganizationAdminOnboarding";
import { EmployeeOnboarding } from "../employee/ui/EmployeeOnboarding";

const Spinner = () => (
  <div className="flex w-full items-center justify-center py-24">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
  </div>
);

/**
 * Picks the onboarding flow for the signed-in user. There are two, and they have
 * nothing in common: an organization admin is setting up a company, an employee
 * is filling in their own details against a company that already exists.
 */
export function OnboardingRouter() {
  const router = useRouter();
  const { appRole, isLoading } = useAuth();

  const isOrganizationAdmin = appRole === APP_ROLES.ORGANIZATION_ADMIN;
  const isEmployee =
    appRole === APP_ROLES.EMPLOYEE ||
    appRole === APP_ROLES.DEPARTMENT_ADMIN ||
    appRole === APP_ROLES.HR;

  // Anyone with no onboarding flow of their own (candidates, platform staff)
  // has no business here.
  const hasNoFlow = !isLoading && !isOrganizationAdmin && !isEmployee;

  useEffect(() => {
    if (hasNoFlow) {
      router.replace(ROUTES.dashboard);
    }
  }, [hasNoFlow, router]);

  if (isLoading || hasNoFlow) return <Spinner />;

  if (isOrganizationAdmin) return <OrganizationAdminOnboarding />;

  return <EmployeeOnboarding />;
}
