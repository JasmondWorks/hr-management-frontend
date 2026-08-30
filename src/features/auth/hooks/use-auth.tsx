"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { refreshAccessToken } from "@/shared/lib/axios";
import { setAccessToken } from "@/shared/lib/token-store";
import {
  decodeToken,
  deriveAppRole,
  isAdminAppRole,
  type Role,
  type BusinessRole,
  type AppRole,
} from "@/shared/lib";
import type { AuthUser, User } from "@/entities/user";
import * as authService from "../auth.service";
import { storeRefreshToken, clearRefreshToken } from "../session.actions";
import type { LoginRequest } from "../types";
import { getUser } from "@/entities/user/user.service";

interface AuthContextValue {
  /** Identity + roles derived from the access token. Present when authenticated. */
  user: AuthUser | null;
  /** Full profile, available after login (null after a bare reload). */
  profile: User | null;
  role: Role | null;
  businessRole: BusinessRole | null;
  /** Flattened role for view selection / route access. */
  appRole: AppRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  hasRole: (...roles: Role[]) => boolean;
  hasBusinessRole: (...roles: BusinessRole[]) => boolean;
  hasAppRole: (...roles: AppRole[]) => boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  reload: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function authUserFromToken(token: string): AuthUser | null {
  const claims = decodeToken(token);
  if (!claims) return null;
  return {
    id: claims.userId,
    email: claims.email,
    role: claims.role,
    businessRole: claims.businessRole,
    organizationId: claims.organizationId,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Establish a session from the refresh cookie (on mount and on reload).
  const reload = useCallback(async () => {
    const token = await refreshAccessToken();
    const user = token ? authUserFromToken(token) : null;
    if (!token) {
      setProfile(null);
      setUser(null);
      return;
    }

    // The token alone establishes the session — identity and roles come from
    // its claims. The profile is extra detail, so a failure to load it must not
    // cost the user their session (or, worse, wedge the provider in its loading
    // state and hang every page behind a spinner).
    let profile: User | null = null;
    try {
      profile = user ? ((await getUser(user.id)).data ?? null) : null;
    } catch {
      profile = null;
    }

    setProfile(profile);
    setUser(user);
  }, []);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        await reload();
      } finally {
        // Always clear the loading flag: the provider renders a full-screen
        // spinner instead of its children while it is set.
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [reload]);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      // Drop anything cached for a previous session before the new identity can
      // read it. Login and logout are client-side navigations, so without this the
      // QueryClient survives the switch and the incoming user briefly renders the
      // previous organization's data.
      queryClient.clear();

      const res = await authService.login(credentials);
      const { user: loggedIn, accessToken, refreshToken } = res.data;
      // Hand the refresh token to the server action -> httpOnly cookie.
      await storeRefreshToken(refreshToken);
      setAccessToken(accessToken);
      setProfile(loggedIn);
      setUser({
        id: loggedIn.id,
        email: loggedIn.email,
        role: loggedIn.role,
        businessRole: loggedIn.businessRole,
        organizationId: loggedIn.organizationId,
      });
    },
    [queryClient],
  );

  const logout = useCallback(async () => {
    try {
      await clearRefreshToken();
    } finally {
      setAccessToken(null);
      setUser(null);
      setProfile(null);
      // Cancel in-flight requests carrying the old token, then drop all cached
      // tenant data so it cannot outlive the session.
      await queryClient.cancelQueries();
      queryClient.clear();
    }
  }, [queryClient]);

  const value = useMemo<AuthContextValue>(() => {
    const role = user?.role ?? null;
    const businessRole = user?.businessRole ?? null;
    const appRole = deriveAppRole(role, businessRole);
    return {
      user,
      profile,
      role,
      businessRole,
      appRole,
      isAuthenticated: user !== null,
      isLoading,
      isAdmin: isAdminAppRole(appRole),
      hasRole: (...roles) => (role ? roles.includes(role) : false),
      hasBusinessRole: (...roles) =>
        businessRole ? roles.includes(businessRole) : false,
      hasAppRole: (...roles) => (appRole ? roles.includes(appRole) : false),
      login,
      logout,
      reload,
    };
  }, [user, profile, isLoading, login, logout, reload]);

  return (
    <AuthContext.Provider value={value}>
      {isLoading ? (
        <div className="flex h-screen w-full items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
