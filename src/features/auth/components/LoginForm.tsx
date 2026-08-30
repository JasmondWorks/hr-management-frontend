"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, InputField } from "@/shared/ui";
import { getApiErrorMessage, ROUTES } from "@/shared/lib";
import { useAuth } from "../hooks/use-auth";
import { loginSchema, type LoginFormValues } from "../schema";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setError(null);
    setLoading(true);
    try {
      await login(data);
      router.replace(ROUTES.dashboard);
    } catch (err) {
      setError(getApiErrorMessage(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
        <p className="mt-1 text-sm text-muted-foreground">Please login here</p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-field border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </div>
      )}

      <InputField
        label="Email Address"
        type="email"
        autoComplete="email"
        placeholder="Enter your email"
        {...register("email")}
        errorMessage={errors.email?.message}
      />

      <InputField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Enter your password"
        {...register("password")}
        errorMessage={errors.password?.message}
      />

      <Button type="submit" size="lg" loading={loading} className="w-full">
        Login
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.register} className="font-medium text-primary hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}

export default LoginForm;
