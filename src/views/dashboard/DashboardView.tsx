"use client";

import { useAuth } from "@/features/auth";
import { APP_ROLES } from "@/shared/lib";
import CandidateDashboard from "./CandidateDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";

import { DashboardGreeting } from "./DashboardGreeting";
import { useSetHeader } from "@/shared/ui/HeaderContext";

/**
 * Shared /dashboard view. Selects the role-specific dashboard from the app-wide
 * `appRole`. HR / department-admin / org-admin / platform-admin all get the
 * admin dashboard.
 */
export function DashboardView() {
  const { appRole } = useAuth();

  let subtitle = "Good Morning";
  if (appRole === APP_ROLES.CANDIDATE) {
    subtitle = "Track your job applications";
  } else if (appRole === APP_ROLES.EMPLOYEE) {
    subtitle = "Here's your day at a glance";
  }

  useSetHeader({
    pageHeader: <DashboardGreeting subtitle={subtitle} />,
  });

  switch (appRole) {
    case APP_ROLES.CANDIDATE:
      return <CandidateDashboard />;
    case APP_ROLES.EMPLOYEE:
      return <EmployeeDashboard />;
    default:
      return <AdminDashboard />;
  }
}

export default DashboardView;
