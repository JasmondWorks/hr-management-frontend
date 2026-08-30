"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Filter } from "lucide-react";
import { SelectField } from "@/shared/ui/SelectField";

// The validation schema using Zod
const filterSchema = z.object({
  search: z.string().optional(),
  workLocation: z.enum(["ALL", "REMOTE", "HYBRID", "ON_SITE"]).optional(),
});

export type FilterValues = z.infer<typeof filterSchema>;

interface JobFilterFormProps {
  onFilterChange: (values: FilterValues) => void;
}

export function JobFilterForm({
  onFilter,
}: {
  onFilter: (values: FilterValues) => void;
}) {
  const { register, handleSubmit, watch } = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      search: "",
      workLocation: "ALL",
    },
  });

  // Automatically submit on change, or you can use a button
  const onSubmit = (data: FilterValues) => {
    onFilter(data);
  };

  // We can also trigger the filter purely on submit
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-card border border-border p-4 rounded-card flex flex-col md:flex-row gap-4 items-center shadow-sm"
    >
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          {...register("search")}
          type="text"
          placeholder="Search for job title or keywords..."
          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-field text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
        />
      </div>

      <div className="relative w-full md:w-auto min-w-[200px]">
        <SelectField
          label=""
          placeholder="All Locations"
          options={[
            { label: "All Locations", value: "ALL" },
            { label: "Remote", value: "REMOTE" },
            { label: "Hybrid", value: "HYBRID" },
            { label: "On-site", value: "ON_SITE" },
          ]}
          {...register("workLocation")}
          value={watch("workLocation")}
        />
      </div>

      <button
        type="submit"
        className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-field text-sm font-semibold transition-colors"
      >
        Search
      </button>
    </form>
  );
}
