"use client";

import React, { useEffect } from "react";
import { BrandLogo } from "@/shared/ui/icons";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4 text-center">
      <BrandLogo className="w-40 text-primary mb-8" variant="filled" />
      <h1 className="text-4xl font-bold mb-4">Something went wrong!</h1>
      <p className="text-muted-foreground max-w-md mb-8">
        We've encountered an unexpected error. Please try again or contact support if the issue persists.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-3 rounded-xl transition-colors"
        >
          Try again
        </button>
        <button
          onClick={() => window.location.href = '/'}
          className="border border-border hover:bg-muted text-foreground font-medium px-8 py-3 rounded-xl transition-colors"
        >
          Go Home
        </button>
      </div>
    </div>
  );
}
