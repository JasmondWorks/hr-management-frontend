"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth";
import { useTheme } from "next-themes";
import { SIDEBAR_LINKS, ROLES } from "@/shared/lib/constants";
import { Menu, X } from "lucide-react";
import {
  BrandLogo,
  Sun,
  Moon,
  Search,
  NotificationBell,
  ChevronDown,
} from "@/shared/ui/icons";
import { HeaderProvider, useHeader } from "@/shared/ui/HeaderContext";
import DashboardTitleBar from "@/shared/ui/DashboardTitleBar";

export const MobileMenuContext = React.createContext<{
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
} | null>(null);

export function useMobileMenu() {
  const context = React.useContext(MobileMenuContext);
  if (!context) {
    throw new Error("useMobileMenu must be used within an AppLayout");
  }
  return context;
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { appRole } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // To avoid hydration mismatch
  React.useEffect(() => setMounted(true), []);

  // Fallback to Employee if role isn't loaded yet
  const role = appRole || ROLES.EMPLOYEE;
  const links =
    SIDEBAR_LINKS[role as keyof typeof SIDEBAR_LINKS] ||
    SIDEBAR_LINKS[ROLES.EMPLOYEE];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const renderSidebarContent = () => (
    <>
      {/* Header (fixed) */}
      <div className="h-[100px] shrink-0 flex items-center justify-between px-8">
        <BrandLogo className="text-primary w-[140px]" variant="filled" />
        <button
          className="md:hidden text-muted-foreground hover:text-foreground"
          onClick={closeMobileMenu}
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Links (fills remaining space and scrolls) */}
      <nav className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-2 px-6 py-4">
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          const Icon = link.icon;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMobileMenu}
              className={`flex items-center gap-4 px-4 py-3 rounded-card transition-colors ${
                isActive
                  ? "bg-accent text-primary"
                  : "text-sidebar-foreground hover:bg-accent/50 hover:text-primary"
              }`}
            >
              <Icon
                className="w-5 h-5 shrink-0"
                variant={isActive ? "filled" : "outline"}
              />
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Theme Toggle (fixed, docked to the bottom) */}
      <div className="shrink-0 p-6">
        {mounted && (
          <div className="flex bg-background rounded-full p-1 border border-border">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-colors ${theme === "light" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Sun
                className="w-4 h-4"
                variant={theme === "light" ? "filled" : "outline"}
              />
              <span className="text-sm font-medium">Light</span>
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-colors ${theme === "dark" ? "bg-primary text-primary-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Moon
                className="w-4 h-4"
                variant={theme === "dark" ? "filled" : "outline"}
              />
              <span className="text-sm font-medium">Dark</span>
            </button>
          </div>
        )}
      </div>
    </>
  );

  // Screens that hold a user before they can use the app: there is nothing to
  // navigate to yet, so the chrome would only offer dead ends.
  const isGatedScreen =
    pathname === "/onboarding" || pathname === "/no-department";

  return (
    <MobileMenuContext.Provider
      value={{ isMobileMenuOpen, setIsMobileMenuOpen }}
    >
      <div className="flex h-svh w-full bg-background text-foreground overflow-hidden">
        {/* Desktop Sidebar */}
        {!isGatedScreen && (
          <aside className="hidden md:flex w-[280px] bg-sidebar shrink-0 flex-col justify-between border-r border-border">
            {renderSidebarContent()}
          </aside>
        )}

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && !isGatedScreen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={closeMobileMenu}
          />
        )}

        {/* Mobile Sidebar */}
        {!isGatedScreen && (
          <aside
            className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-sidebar flex flex-col justify-between border-r border-border transform transition-transform duration-300 ease-in-out md:hidden ${
              isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            {renderSidebarContent()}
          </aside>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-auto bg-muted/20 p-4 md:p-8 gap-6">
          <HeaderProvider>
            {/* Persistent Header */}
            <PersistentHeader />
            {/* Page Content */}
            <div className="flex-1 flex flex-col">{children}</div>
          </HeaderProvider>
        </main>
      </div>
    </MobileMenuContext.Provider>
  );
}

function PersistentHeader() {
  const pathname = usePathname();
  const { headerState } = useHeader();

  if (pathname === "/onboarding" || pathname === "/no-department") {
    return null;
  }

  return (
    <DashboardTitleBar
      pageHeader={headerState.pageHeader}
      subHeader={headerState.subHeader}
      searchValue={headerState.searchValue}
      onSearchChange={headerState.onSearchChange}
    />
  );
}
