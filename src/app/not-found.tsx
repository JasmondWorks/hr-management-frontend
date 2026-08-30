import React from "react";
import Link from "next/link";
import { BrandLogo } from "@/shared/ui/icons";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <BrandLogo className="w-40 text-primary mb-8" variant="filled" />
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Oops! The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
      </p>
      <Link
        href="/"
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-xl transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
