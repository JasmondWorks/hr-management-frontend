"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { ROUTES } from "@/shared/lib/constants";
import { ConfirmationModal } from "@/shared/ui/ConfirmationModal";
import { Button } from "@/shared/ui/shad-cn/button";
import { cn } from "@/shared/lib/utils";

interface LogoutButtonProps {
  className?: string;
  variant?: "ghost" | "default" | "outline";
  iconOnly?: boolean;
}

export function LogoutButton({
  className,
  variant = "ghost",
  iconOnly = false,
}: LogoutButtonProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.replace(ROUTES.login);
      // We don't close the modal here because we want it to stay in a loading state
      // until the page unmounts via navigation.
    } catch (err) {
      console.error("Logout failed:", err);
      setIsLoggingOut(false);
      toast.error("Failed to log out");
    }
  };

  return (
    <>
      <button
        onClick={() => setIsLogoutModalOpen(true)}
        className={cn(
          "flex items-center gap-3 transition-colors",
          variant === "ghost" ? "text-red-500 hover:bg-red-500/10" : "",
          className,
        )}
      >
        <LogOut className="w-4 h-4" />
        {!iconOnly && "Logout"}
      </button>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        isLoading={isLoggingOut}
        title="Confirm Logout"
        message="Are you sure you want to log out? You will need to sign in again to access the dashboard."
        confirmText="Log Out"
      />
    </>
  );
}
