"use client";

import { Building2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Card } from "@/shared/ui/shad-cn/card";
import { Button, LogoutButton } from "@/shared/ui";
import { useAuth } from "@/features/auth";
import { refreshAccessToken } from "@/shared/lib/axios";
import { ROUTES } from "@/shared/lib/constants";

/**
 * Shown to an employee who has completed onboarding but has not been placed in
 * a department. They are a real account with nothing yet to act on, so the rest
 * of the app is held back rather than shown half-working.
 */
export function NoDepartmentNotice() {
  const { profile } = useAuth();
  const [isChecking, setIsChecking] = useState(false);

  // The assignment happens in an admin's browser, not theirs, so nothing pushes
  // it here. Re-minting the token is what picks it up.
  const checkAgain = async () => {
    setIsChecking(true);
    await refreshAccessToken();
    window.location.href = ROUTES.dashboard;
  };

  return (
    <>
      <div className="fixed top-6 right-6 z-50">
        <LogoutButton className="bg-card border border-border rounded-full px-4 py-2 text-sm shadow-sm" />
      </div>

      <div className="mx-auto flex w-full max-w-lg flex-col justify-center px-4 py-16">
        <Card className="p-8 text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="size-6 text-primary" />
          </div>

          <h1 className="text-xl font-semibold text-foreground">
            You&apos;re not in a department yet
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {profile?.firstName ? `Thanks, ${profile.firstName}. ` : ""}
            Your profile is complete. Your organization admin still needs to
            place you in a department before you can start work here — you
            can&apos;t book leave, log attendance or join projects until then.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            You&apos;ll get an email once you&apos;ve been assigned. Nothing else
            is needed from you.
          </p>

          <Button
            type="button"
            variant="outline"
            className="mt-6"
            onClick={checkAgain}
            disabled={isChecking}
          >
            <RefreshCw className={`mr-2 size-4 ${isChecking ? "animate-spin" : ""}`} />
            {isChecking ? "Checking..." : "Check again"}
          </Button>
        </Card>
      </div>
    </>
  );
}
