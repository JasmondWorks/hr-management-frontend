import React from "react";
import AppLayout from "@/entities/dashboard/layouts/AppLayout";

export default function InAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppLayout>{children}</AppLayout>;
}
