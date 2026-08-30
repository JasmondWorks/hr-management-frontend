import React from "react";
import { Input } from "../shad-cn/input";
import { Search } from "lucide-react";

export default function TableHeader({
  title,
  description,
  searchValue,
  onSearchChange,
}: {
  title: string;
  description: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-5">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      <div className="relative w-75">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search"
          className="pl-9 bg-card border-border h-10"
        />
      </div>
    </div>
  );
}
