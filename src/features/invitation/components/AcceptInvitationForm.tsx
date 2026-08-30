"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, MailWarning } from "lucide-react";
import { Card } from "@/shared/ui/shad-cn/card";
import { Button, InputField } from "@/shared/ui";
import { setAccessToken } from "@/shared/lib/token-store";
import { storeRefreshToken } from "@/features/auth/session.actions";
import { ROUTES } from "@/shared/lib/constants";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { invitationService } from "../api/invitation.service";
import {
  acceptInvitationSchema,
  type AcceptInvitationFormValues,
} from "../schema";

const Shell = ({ children }: { children: React.ReactNode }) => (
  <div className="mx-auto w-full max-w-md px-4 py-16">
    <Card className="p-6 sm:p-8">{children}</Card>
  </div>
);

/**
 * The public landing page for an emailed invite link. The invitee has no account
 * yet, so this runs unauthenticated: verify the token, then exchange it for an
 * account and a session in one step.
 */
export function AcceptInvitationForm({ token }: { token: string }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["invitation-preview", token],
    queryFn: () => invitationService.verifyInvitation(token),
    enabled: Boolean(token),
    // A dead link will not become alive on a retry, and each attempt is a
    // round-trip the invitee waits through.
    retry: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AcceptInvitationFormValues>({
    resolver: zodResolver(acceptInvitationSchema),
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: AcceptInvitationFormValues) => {
    setIsSubmitting(true);
    try {
      const res = await invitationService.acceptInvitation({
        token,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        phone: values.phone,
      });

      // Accepting logs them straight in: hand the refresh token to the server
      // action (httpOnly cookie) and keep the access token in memory, exactly as
      // the login flow does.
      await storeRefreshToken(res.data.refreshToken);
      setAccessToken(res.data.accessToken);

      toast.success("Account created");
      // Hard navigation so every provider re-reads the new session.
      window.location.href = "/onboarding";
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Could not accept this invitation"));
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Shell>
        <InvalidState
          title="Missing invitation link"
          message="This URL has no invitation token. Use the link from your email."
        />
      </Shell>
    );
  }

  if (isLoading) {
    return (
      <Shell>
        <div className="flex items-center justify-center py-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </Shell>
    );
  }

  if (error || !data) {
    const status = (error as AxiosError)?.response?.status;
    // 410 means the invitation existed but is spent — expired, already used, or
    // revoked. The backend's message says which, and each needs a different
    // next step from the reader.
    const message =
      status === 410
        ? getApiErrorMessage(error, "This invitation link is no longer valid.")
        : "We could not find this invitation. Check the link from your email.";

    return (
      <Shell>
        <InvalidState title="This link can't be used" message={message} />
      </Shell>
    );
  }

  const preview = data.data;

  return (
    <Shell>
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="size-5 text-primary" />
        </div>
        <h1 className="text-xl font-semibold text-foreground">
          Join {preview.organizationName}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          You were invited as <strong>{preview.email}</strong>
          {preview.departmentName && (
            <>
              {" "}
              in <strong>{preview.departmentName}</strong>
            </>
          )}
          {preview.officeBranchName && (
            <>
              {" "}
              at <strong>{preview.officeBranchName}</strong>
            </>
          )}
          .
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <InputField
            label="First Name"
            {...register("firstName")}
            errorMessage={errors.firstName?.message}
          />
          <InputField
            label="Last Name"
            {...register("lastName")}
            errorMessage={errors.lastName?.message}
          />
        </div>

        <InputField
          label="Phone Number"
          {...register("phone")}
          errorMessage={errors.phone?.message}
        />

        <InputField
          label="Password"
          type="password"
          {...register("password")}
          errorMessage={errors.password?.message}
        />

        <InputField
          label="Confirm Password"
          type="password"
          {...register("confirmPassword")}
          errorMessage={errors.confirmPassword?.message}
        />

        <Button type="submit" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? "Creating your account..." : "Accept & continue"}
        </Button>
      </form>
    </Shell>
  );
}

function InvalidState({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-3 flex size-11 items-center justify-center rounded-full bg-destructive/10">
        <MailWarning className="size-5 text-destructive" />
      </div>
      <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">{message}</p>
      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href={ROUTES.login} className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
