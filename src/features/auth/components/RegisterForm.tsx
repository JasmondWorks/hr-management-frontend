"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, InputField } from "@/shared/ui";
import { cn } from "@/shared/lib/utils";
import { getApiErrorMessage, ROUTES } from "@/shared/lib";
import { registerOrganizationAdmin, registerCandidate } from "../auth.service";
import type { RegisterRole } from "../types";
import { registerSchema, type RegisterFormValues } from "../schema";

const ROLE_OPTIONS: { value: RegisterRole; label: string }[] = [
  { value: "organization-admin", label: "Organization Admin" },
  { value: "candidate", label: "Candidate" },
];

function InnerRegisterForm({ role }: { role: RegisterRole }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      role,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      password: "",
    },
  });

  async function onSubmit(data: RegisterFormValues) {
    setError(null);
    setLoading(true);
    try {
      if (data.role === "organization-admin") {
        await registerOrganizationAdmin(data);
      } else {
        await registerCandidate(data);
      }
      router.replace(`${ROUTES.login}?registered=1`);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {error && (
        <div
          role="alert"
          className="rounded-field border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
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
        label="Email Address (Admin)"
        type="email"
        autoComplete="email"
        {...register("email")}
        errorMessage={errors.email?.message}
      />

      <InputField
        label="Phone"
        {...register("phone")}
        errorMessage={errors.phone?.message}
      />

      <InputField
        label="Password"
        type="password"
        autoComplete="new-password"
        {...register("password")}
        errorMessage={errors.password?.message}
      />

      <Button type="submit" size="lg" loading={loading} className="w-full">
        {role === "organization-admin"
          ? "Create Organization Account"
          : "Create Candidate Account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.login}
          className="font-medium text-primary hover:underline"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [role, setRole] = useState<RegisterRole>("organization-admin");

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {role === "organization-admin"
            ? "Register your Organization"
            : "Join as a Candidate"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {role === "organization-admin"
            ? "Set up a new workspace to manage your HR processes and team."
            : "Create your profile to explore and apply for job opportunities."}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-field bg-muted p-1">
        {ROLE_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setRole(opt.value)}
            className={cn(
              "rounded-[calc(var(--radius-field)-2px)] px-3 py-2 text-sm font-medium transition-colors",
              role === opt.value
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {role === "organization-admin" ? (
        <InnerRegisterForm key="org" role="organization-admin" />
      ) : (
        <InnerRegisterForm key="cand" role="candidate" />
      )}
    </div>
  );
}

export default RegisterForm;
