import { Suspense } from "react";
import { AcceptInvitationForm } from "@/features/invitation";

export default async function AcceptInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <Suspense>
      <AcceptInvitationForm token={token ?? ""} />
    </Suspense>
  );
}
