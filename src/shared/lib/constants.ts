// Account type (backend RoleType).
export const ROLES = {
  CANDIDATE: "CANDIDATE",
  EMPLOYEE: "EMPLOYEE",
  ADMIN: "ADMIN",
} as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

// Functional role within an organization (backend BusinessRole).
export const BUSINESS_ROLES = {
  REGULAR: "REGULAR",
  DEPARTMENT_ADMIN: "DEPARTMENT_ADMIN",
  HR: "HR",
  ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
} as const;
export type BusinessRole = (typeof BUSINESS_ROLES)[keyof typeof BUSINESS_ROLES];

// Business roles that count as "admin" for UI gating.
export const ADMIN_BUSINESS_ROLES: BusinessRole[] = [
  BUSINESS_ROLES.ORGANIZATION_ADMIN,
  BUSINESS_ROLES.DEPARTMENT_ADMIN,
  BUSINESS_ROLES.HR,
];

export const ROUTES = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  onboarding: "/onboarding",
  noDepartment: "/no-department",
  acceptInvite: "/invite/accept",
} as const;

// Public routes an authenticated user should be redirected away from.
export const AUTH_ROUTES: string[] = [ROUTES.login, ROUTES.register];

// Public routes that do not require authentication.
// The invite accept page is deliberately public: the invitee has no account
// until they submit it.
export const PUBLIC_ROUTES: string[] = ["/", "/jobs", "/invite"];

// The httpOnly cookie the backend sets for the refresh token.
export const REFRESH_COOKIE = "refresh_token";

import type { ComponentType } from "react";
import type { AppRole } from "./roles";
import {
  DashboardIcon,
  Employees,
  Departments,
  Attendance,
  Payroll,
  Jobs,
  Candidates,
  Applicants,
  Leaves,
  Holidays,
  Projects,
  NotificationBell,
  Settings,
  User,
} from "@/shared/ui/icons";

export interface SidebarLink {
  name: string;
  href: string;
  icon: ComponentType<{
    className?: string;
    variant?: "filled" | "outline";
  }>;
}

// Sidebar navigation is keyed by the flattened AppRole (account role +
// businessRole), NOT the account role — so an EMPLOYEE whose businessRole is
// ORGANIZATION_ADMIN gets the admin nav, a REGULAR employee gets employee nav,
// HR and DEPARTMENT_ADMIN get their own, etc. Every href stays within that
// role's ROLE_ACCESS (see roles.ts) so links are never proxy-redirected.
export const SIDEBAR_LINKS: Record<AppRole, SidebarLink[]> = {
  CANDIDATE: [
    { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { name: "Jobs", href: "/jobs/candidate", icon: Jobs },
    { name: "My Applications", href: "/applications", icon: Applicants },
    { name: "Notifications", href: "/notifications", icon: NotificationBell },
    { name: "Profile", href: "/profile", icon: User },
  ],
  EMPLOYEE: [
    { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { name: "Attendance", href: "/attendance", icon: Attendance },
    { name: "Leaves", href: "/leaves", icon: Leaves },
    { name: "Payroll", href: "/payroll", icon: Payroll },
    { name: "Projects", href: "/projects", icon: Projects },
    { name: "Holidays", href: "/holidays", icon: Holidays },
    { name: "Profile", href: "/profile", icon: User },
  ],
  HR: [
    { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { name: "Employees", href: "/employees", icon: Employees },
    { name: "Candidates", href: "/candidates", icon: Candidates },
    { name: "Applications", href: "/applications", icon: Applicants },
    { name: "Attendance", href: "/attendance", icon: Attendance },
    { name: "Leaves", href: "/leaves", icon: Leaves },
    { name: "Payroll", href: "/payroll", icon: Payroll },
    { name: "Holidays", href: "/holidays", icon: Holidays },
    { name: "Projects", href: "/projects", icon: Projects },
    { name: "Profile", href: "/profile", icon: User },
  ],
  DEPARTMENT_ADMIN: [
    { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { name: "Departments", href: "/departments", icon: Departments },
    { name: "Jobs", href: "/jobs/admin", icon: Jobs },
    { name: "Employees", href: "/employees", icon: Employees },
    { name: "Projects", href: "/projects", icon: Projects },
    { name: "Attendance", href: "/attendance", icon: Attendance },
    { name: "Leaves", href: "/leaves", icon: Leaves },
    { name: "Holidays", href: "/holidays", icon: Holidays },
    { name: "Profile", href: "/profile", icon: User },
  ],
  ORGANIZATION_ADMIN: [
    { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { name: "Employees", href: "/employees", icon: Employees },
    { name: "Departments", href: "/departments", icon: Departments },
    { name: "Jobs", href: "/jobs/admin", icon: Jobs },
    { name: "Candidates", href: "/candidates", icon: Candidates },
    { name: "Applications", href: "/applications", icon: Applicants },
    { name: "Attendance", href: "/attendance", icon: Attendance },
    { name: "Payroll", href: "/payroll", icon: Payroll },
    { name: "Leaves", href: "/leaves", icon: Leaves },
    { name: "Holidays", href: "/holidays", icon: Holidays },
    { name: "Projects", href: "/projects", icon: Projects },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
  // Platform admin — full access.
  ADMIN: [
    { name: "Dashboard", href: "/dashboard", icon: DashboardIcon },
    { name: "Employees", href: "/employees", icon: Employees },
    { name: "Departments", href: "/departments", icon: Departments },
    { name: "Jobs", href: "/jobs/admin", icon: Jobs },
    { name: "Candidates", href: "/candidates", icon: Candidates },
    { name: "Applications", href: "/applications", icon: Applicants },
    { name: "Attendance", href: "/attendance", icon: Attendance },
    { name: "Payroll", href: "/payroll", icon: Payroll },
    { name: "Leaves", href: "/leaves", icon: Leaves },
    { name: "Holidays", href: "/holidays", icon: Holidays },
    { name: "Projects", href: "/projects", icon: Projects },
    { name: "Settings", href: "/settings", icon: Settings },
  ],
};

// Form Options
export const EMPLOYEE_TYPES = ["Full-Time", "Part-Time", "Contract", "Intern"];
export const WORKING_DAYS = ["Monday-Friday", "Shift-based", "Flexible"];
export const OFFICE_LOCATIONS = ["HQ", "Remote", "Branch A", "Branch B"];
export const GENDERS = ["Male", "Female", "Other"];
export const NATIONALITIES = ["USA", "Canada", "UK", "Australia", "Other"];
export const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];
export const STATES = ["California", "Texas", "New York", "Florida", "Other"];
export const CITIES = ["San Francisco", "Austin", "New York City", "Miami", "Other"];
