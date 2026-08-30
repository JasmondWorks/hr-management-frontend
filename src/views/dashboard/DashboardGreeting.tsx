"use client";

import { useAuth } from "@/features/auth";

export function DashboardGreeting({ subtitle }: { subtitle?: string }) {
  const { profile } = useAuth();
  console.log(profile);
  const name = profile?.firstName ?? "there";
  return (
    <div>
      <h1 className="text-2xl font-bold text-foreground">Hello {name}</h1>
      {subtitle && (
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}

export default DashboardGreeting;
