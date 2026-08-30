"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BrandLogo } from "@/shared/ui/icons";
import { ThemeToggle } from "@/shared/ui/ThemeToggle";
import {
  ArrowRight,
  Briefcase,
  Building2,
  CheckCircle2,
  Search,
  Users,
} from "lucide-react";

type RoleTab = "candidate" | "employer";

const CONTENT: Record<
  RoleTab,
  {
    headline: string;
    accent: string;
    subhead: string;
    primary: { label: string; href: string };
    features: { icon: React.ReactNode; title: string; description: string }[];
  }
> = {
  candidate: {
    headline: "The modern way to",
    accent: "find your next role.",
    subhead:
      "Discover roles at top organizations, apply once with a saved profile, and track every application in one place.",
    primary: { label: "Explore open jobs", href: "/jobs" },
    features: [
      {
        icon: <Search className="size-4" />,
        title: "Find open roles",
        description: "Browse active openings from fast-growing organizations.",
      },
      {
        icon: <Users className="size-4" />,
        title: "Apply in one click",
        description: "Register once, then apply to multiple roles instantly.",
      },
      {
        icon: <CheckCircle2 className="size-4" />,
        title: "Track & get hired",
        description:
          "Follow your application status in real time to the offer.",
      },
    ],
  },
  employer: {
    headline: "The modern way to",
    accent: "build your team.",
    subhead:
      "Set up your workspace, post roles publicly, and manage your people — hiring, attendance, and payroll in one platform.",
    primary: { label: "Create organization", href: "/register?role=admin" },
    features: [
      {
        icon: <Building2 className="size-4" />,
        title: "Set up your org",
        description: "Register as admin and spin up your HR workspace.",
      },
      {
        icon: <Briefcase className="size-4" />,
        title: "Post & recruit",
        description: "Create departments, publish jobs, and attract talent.",
      },
      {
        icon: <Users className="size-4" />,
        title: "Manage your people",
        description: "Promote hires to employees and run payroll with ease.",
      },
    ],
  },
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<RoleTab>("candidate");
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const c = CONTENT[activeTab];

  return (
    <div className="relative flex min-h-svh flex-col overflow-hidden bg-background font-sans selection:bg-primary/25">
      {/* Calm ambient background — one soft orb + faint grid, low emphasis. */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-50 flex h-16 items-center justify-between border-b border-border/60 bg-background/70 px-6 backdrop-blur-md md:px-10">
        <Link href="/">
          <BrandLogo className="w-24 text-primary" variant="filled" />
        </Link>
        <nav className="flex items-center gap-5">
          <ThemeToggle />
          <Link
            href="/login"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Get started
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 flex flex-1 flex-col items-center px-6 pt-16 pb-20 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
          <span className="size-1.5 rounded-full bg-primary" />
          The future of work
        </span>

        <h1 className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
          {c.headline} <span className="text-primary">{c.accent}</span>
        </h1>

        <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
          {c.subhead}
        </p>

        {/* Role switch — quiet, secondary control */}
        <div className="mt-8 inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/60 p-1 backdrop-blur-sm">
          {(["candidate", "employer"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab === "candidate" ? (
                <Briefcase className="size-3.5" />
              ) : (
                <Building2 className="size-3.5" />
              )}
              {tab === "candidate" ? "I'm a candidate" : "I'm an employer"}
            </button>
          ))}
        </div>

        {/* Primary + secondary CTA */}
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            href={c.primary.href}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {c.primary.label}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
        </div>

        {/* Immersive product preview.
            To use a real image instead of this mockup, replace <ProductPreview />
            with:
              <Image src="/images/product-preview.png" alt="HR Search dashboard"
                     width={1000} height={620} priority
                     className="rounded-xl border border-border shadow-2xl" />
            (add the file to /public/images — see suggested stock images). */}
        <div className="mt-16 w-full max-w-4xl">
          <ProductPreview />
        </div>

        {/* Feature row — deemphasised supporting content */}
        <div
          key={activeTab}
          className="mt-16 grid w-full max-w-4xl gap-4 text-left sm:grid-cols-3"
        >
          {c.features.map((f) => (
            <div
              key={f.title}
              className="rounded-card border border-border/70 bg-card/50 p-5 backdrop-blur-sm transition-colors hover:border-border"
            >
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                {f.icon}
              </div>
              <h3 className="mt-3 text-sm font-medium text-foreground">
                {f.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </main>

      <footer className="relative z-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} HR Search
      </footer>
    </div>
  );
}

/** Lightweight, on-brand dashboard mockup so the hero is immersive with no
 *  external asset. Swap for a real screenshot when ready (see note above). */
function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border/70 px-4 py-3">
        <span className="size-2.5 rounded-full bg-destructive/70" />
        <span className="size-2.5 rounded-full bg-warning/70" />
        <span className="size-2.5 rounded-full bg-success/70" />
      </div>
      <div className="flex">
        {/* mini sidebar */}
        <div className="hidden w-40 flex-col gap-2 border-r border-border/70 p-4 sm:flex">
          <div className="h-7 rounded-md bg-primary/15" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-4 w-3/4 rounded bg-muted" />
          ))}
        </div>
        {/* content */}
        <div className="flex-1 p-5">
          <div className="grid grid-cols-3 gap-3">
            {["Employees", "Applicants", "Projects"].map((label) => (
              <div
                key={label}
                className="rounded-lg border border-border/70 p-3"
              >
                <div className="text-[10px] text-muted-foreground">{label}</div>
                <div className="mt-1 h-5 w-10 rounded bg-foreground/80" />
              </div>
            ))}
          </div>
          <div className="mt-3 flex h-32 items-end gap-2 rounded-lg border border-border/70 p-3">
            {[45, 70, 55, 85, 60, 92, 50].map((h, i) => (
              <div
                key={i}
                className="flex-1 rounded-t bg-primary/70"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
