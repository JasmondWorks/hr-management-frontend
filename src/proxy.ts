import { NextResponse, type NextRequest } from "next/server";
import {
  REFRESH_COOKIE,
  AUTH_ROUTES,
  ROUTES,
  PUBLIC_ROUTES,
} from "@/shared/lib/constants";
import { decodeToken } from "@/shared/lib/jwt";
import { deriveAppRole, isRouteAllowed } from "@/shared/lib/roles";

// Next.js 16 renamed `middleware` to `proxy`. Route protection is "optimistic":
// it gates on the presence of the refresh-token cookie and derives the app role
// from the token's (unverified) claims for redirects. Real authorization is
// always enforced by the backend on each API call.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;

  const isAuthRoute = AUTH_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  const isPublicRoute = PUBLIC_ROUTES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  // Not authenticated: allow auth pages and public pages, redirect everything else to login.
  if (!refreshToken) {
    if (isAuthRoute || isPublicRoute) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  // Authenticated: keep users off the auth pages.
  if (isAuthRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.dashboard;
    return NextResponse.redirect(url);
  }

  // Enforce the role access map (also handles "/" -> dashboard).
  const claims = decodeToken(refreshToken as string);
  const appRole = deriveAppRole(
    claims?.role ?? null,
    claims?.businessRole ?? null,
  );

  // A cookie we cannot derive a role from is not a session. Send the user to
  // login and drop it — falling through would redirect to the dashboard, which
  // is itself disallowed for a null role, looping indefinitely.
  if (!appRole) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.login;
    url.searchParams.set("next", pathname);
    const response = NextResponse.redirect(url);
    response.cookies.delete(REFRESH_COOKIE);
    return response;
  }

  // One flag, one rule. `isOnboarded` is set only when a user's whole flow is
  // finished — the full wizard for an organization admin (organization, office
  // branches, invitations), the personal-details form for an employee.
  //
  // It deliberately does NOT key off "has an organization": that made a page
  // refresh mid-wizard look complete and dumped the admin on the dashboard with
  // the branch and invitation steps never seen. Candidates and platform staff
  // have no flow, so they are never held here.
  const hasOnboardingFlow =
    appRole === "ORGANIZATION_ADMIN" ||
    appRole === "EMPLOYEE" ||
    appRole === "DEPARTMENT_ADMIN" ||
    appRole === "HR";

  const needsOnboarding = hasOnboardingFlow && !claims?.isOnboarded;

  const isOnboardingRoute = pathname === ROUTES.onboarding;

  if (needsOnboarding && !isOnboardingRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.onboarding;
    return NextResponse.redirect(url);
  }

  if (needsOnboarding && isOnboardingRoute) {
    return NextResponse.next();
  }

  if (isOnboardingRoute) {
    // Nothing left to onboard.
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.dashboard;
    return NextResponse.redirect(url);
  }

  // Onboarded, but not yet placed in a department. They have an account and no
  // structure to act within — no team, no designation — so hold them on an
  // explanatory screen rather than a dashboard of empty widgets and buttons the
  // backend will reject. Admins and HR are exempt: they run the organization and
  // are the ones doing the assigning.
  const needsDepartment =
    appRole === "EMPLOYEE" && !claims?.departmentId;

  const isNoDepartmentRoute = pathname === ROUTES.noDepartment;

  if (needsDepartment && !isNoDepartmentRoute) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.noDepartment;
    return NextResponse.redirect(url);
  }

  if (isNoDepartmentRoute) {
    if (needsDepartment) return NextResponse.next();
    // They have a department now — this screen no longer applies.
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.dashboard;
    return NextResponse.redirect(url);
  }

  if (!isRouteAllowed(appRole, pathname)) {
    // Guard against redirecting the dashboard onto itself.
    if (pathname === ROUTES.dashboard) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.dashboard;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // Run on everything except API routes, Next internals, and static assets.
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
