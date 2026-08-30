"use client";

import React, { useState } from "react";
import {
  JobFilterForm,
  FilterValues,
} from "@/features/jobs/components/JobFilterForm";
import { JobCard } from "@/features/jobs/components/JobCard";
import { JobQuery } from "@/features/jobs/types";
import { BrandLogo } from "@/shared/ui/icons";
import Link from "next/link";
import { usePublicJobs } from "@/features/jobs/hooks/useJobs";
import useDebounce from "@/shared/hooks/use-debounce";
import { useAuth } from "@/features/auth";
import ProfileDropdown from "@/shared/ui/ProfileDropdown";

export default function PublicJobsPage() {
  const [filters, setFilters] = useState<JobQuery>({});
  const debouncedSearch = useDebounce({ query: filters?.search || "" });

  const { data, isLoading: isJobLoading } = usePublicJobs({
    limit: "50",
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(filters.workLocation && {
      workLocation: filters.workLocation,
    }),
  });

  const { user } = useAuth();

  const handleFilterChange = (values: FilterValues) => {
    const query: JobQuery = {};
    if (values.search) query.search = values.search;
    if (values.workLocation && values.workLocation !== "ALL") {
      query.workLocation = values.workLocation;
    }
    setFilters(query);
  };

  return (
    <div className="min-h-svh bg-background flex flex-col">
      {/* Top Navbar */}
      <header className="h-[80px] border-b border-border flex items-center justify-between px-6 md:px-12 bg-card">
        <Link href="/">
          <BrandLogo className="text-primary w-[140px]" variant="filled" />
        </Link>

        {user ? (
          <ProfileDropdown />
        ) : (
          <div className="flex gap-4 items-center">
            <Link
              href="/login"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground px-5 py-2 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Register
            </Link>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-12 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-extrabold text-foreground">
            Explore Opportunities
          </h1>
          <p className="text-muted-foreground text-lg">
            Find your next role and make an impact.
          </p>
        </div>

        <JobFilterForm onFilter={handleFilterChange} />

        <div className="mt-4">
          {isJobLoading ? (
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse bg-muted rounded-card h-[200px] w-full"
                />
              ))}
            </div>
          ) : data?.data && data.data.length > 0 ? (
            <div className="flex flex-col gap-6">
              {data.data.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-card border border-border">
              <h3 className="text-xl font-semibold text-foreground">
                No jobs found
              </h3>
              <p className="text-muted-foreground mt-2">
                Try adjusting your filters to find what you're looking for.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
