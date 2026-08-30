"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/features/auth";
import { Button, ConfirmationModal } from "@/shared/ui";
import { ROUTES } from "@/shared/lib";
import { useState } from "react";

export function DashboardHeader() {
  const router = useRouter();
  const { user, appRole, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace(ROUTES.login);
    } finally {
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-sidebar px-6 py-4">
      <div className="flex items-center gap-2">
        <span className="text-lg font-extrabold tracking-tight text-primary">HR</span>
        <span className="text-lg font-extrabold tracking-tight text-foreground">
          SEARCH
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">{user?.email}</p>
          {appRole && (
            <p className="text-xs text-muted-foreground">
              {appRole.replace(/_/g, " ").toLowerCase()}
            </p>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsLogoutModalOpen(true)}>
          <LogOut />
          Logout
        </Button>
      </div>
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access the dashboard."
        confirmText="Log Out"
      />
    </header>
  );
}

export default DashboardHeader;
