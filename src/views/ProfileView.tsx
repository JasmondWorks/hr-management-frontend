"use client";

import { useAuth } from "@/features/auth";

function Row({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1 border-b border-border/60 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value || "—"}</span>
    </div>
  );
}

export function ProfileView() {
  const { user, profile, appRole } = useAuth();

  const firstName = profile?.firstName ?? "";
  const lastName = profile?.lastName ?? "";
  const fullName =
    `${firstName} ${lastName}`.trim() || user?.email?.split("@")[0] || "User";
  const initials =
    `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase() ||
    (user?.email?.[0] ?? "U").toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your account details.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-4 border-b border-border/60 pb-6">
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-lg font-semibold text-secondary-foreground">
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{fullName}</h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        <div className="mt-2">
          <Row label="First name" value={profile?.firstName} />
          <Row label="Last name" value={profile?.lastName} />
          <Row label="Email" value={user?.email} />
          <Row label="Phone" value={profile?.phone} />
          <Row label="Role" value={appRole} />
          <Row label="Business role" value={user?.businessRole ?? "—"} />
        </div>
      </div>
    </div>
  );
}

export default ProfileView;
