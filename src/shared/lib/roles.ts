import { ROLES, BUSINESS_ROLES, type Role, type BusinessRole } from "./constants";

/**
 * The single flattened role the UI reasons about, derived from the account
 * `role` + organizational `businessRole`. Use this for view selection and route
 * access rather than checking `role`/`businessRole` separately everywhere.
 */
export const APP_ROLES = {
  CANDIDATE: "CANDIDATE",
  EMPLOYEE: "EMPLOYEE",
  DEPARTMENT_ADMIN: "DEPARTMENT_ADMIN",
  HR: "HR",
  ORGANIZATION_ADMIN: "ORGANIZATION_ADMIN",
  ADMIN: "ADMIN",
} as const;
export type AppRole = (typeof APP_ROLES)[keyof typeof APP_ROLES];

export function deriveAppRole(
  role: Role | null | undefined,
  businessRole: BusinessRole | null | undefined,
): AppRole | null {
  if (!role) return null;
  if (role === ROLES.CANDIDATE) return APP_ROLES.CANDIDATE;
  if (role === ROLES.ADMIN) return APP_ROLES.ADMIN;

  // role === EMPLOYEE: the business role decides the flavor.
  switch (businessRole) {
    case BUSINESS_ROLES.ORGANIZATION_ADMIN:
      return APP_ROLES.ORGANIZATION_ADMIN;
    case BUSINESS_ROLES.DEPARTMENT_ADMIN:
      return APP_ROLES.DEPARTMENT_ADMIN;
    case BUSINESS_ROLES.HR:
      return APP_ROLES.HR;
    default:
      return APP_ROLES.EMPLOYEE;
  }
}

export const ADMIN_APP_ROLES: AppRole[] = [
  APP_ROLES.ORGANIZATION_ADMIN,
  APP_ROLES.DEPARTMENT_ADMIN,
  APP_ROLES.HR,
  APP_ROLES.ADMIN,
];

export function isAdminAppRole(appRole: AppRole | null): boolean {
  return appRole !== null && ADMIN_APP_ROLES.includes(appRole);
}

// "*" grants access to every protected route.
const WILDCARD = "*";

/**
 * Allowed route prefixes per app role, consumed by proxy.ts for route
 * protection. Real authorization is still enforced by the backend — this only
 * shapes navigation/redirects.
 */
export const ROLE_ACCESS: Record<AppRole, string[]> = {
  CANDIDATE: ["/dashboard", "/jobs", "/applications", "/notifications", "/profile"],
  EMPLOYEE: [
    "/dashboard",
    "/attendance",
    "/leaves",
    "/payroll",
    "/projects",
    "/holidays",
    "/notifications",
    "/profile",
  ],
  HR: [
    "/dashboard",
    "/employees",
    "/attendance",
    "/leaves",
    "/payroll",
    "/candidates",
    "/applications",
    "/holidays",
    "/projects",
    "/notifications",
    "/profile",
  ],
  DEPARTMENT_ADMIN: [
    "/dashboard",
    "/departments",
    "/jobs",
    "/projects",
    "/employees",
    "/attendance",
    "/leaves",
    "/holidays",
    "/notifications",
    "/profile",
  ],
  ORGANIZATION_ADMIN: [WILDCARD],
  ADMIN: [WILDCARD],
};

export function isRouteAllowed(
  appRole: AppRole | null,
  pathname: string,
): boolean {
  if (!appRole) return false;
  const allowed = ROLE_ACCESS[appRole];
  if (allowed.includes(WILDCARD)) return true;
  return allowed.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
