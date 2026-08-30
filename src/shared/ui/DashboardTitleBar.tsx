"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth";
import { Menu, User, LogOut } from "lucide-react";
import { Search, NotificationBell, ChevronDown } from "@/shared/ui/icons";
import { ROLES } from "@/shared/lib/constants";
import { useMobileMenu } from "@/entities/dashboard/layouts/AppLayout";
import { LogoutButton } from "@/shared/ui";
import ProfileDropdown from "./ProfileDropdown";

export interface DashboardTitleBarProps {
  pageHeader: React.ReactNode;
  subHeader?: React.ReactNode;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export default function DashboardTitleBar({
  pageHeader,
  subHeader,
  searchValue,
  onSearchChange,
}: DashboardTitleBarProps) {
  const { appRole } = useAuth();
  const { setIsMobileMenuOpen } = useMobileMenu();
  const [internalSearch, setInternalSearch] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = React.useRef<HTMLDivElement>(null);
  const role = appRole || ROLES.EMPLOYEE;

  const isControlled = searchValue !== undefined;
  const currentSearch = isControlled ? searchValue : internalSearch;

  const handleSearchChange = (value: string) => {
    if (!isControlled) {
      setInternalSearch(value);
    }
    onSearchChange?.(value);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Element;
      // If clicking inside a dialog/modal (like the logout confirmation), do not close the dropdown
      if (target.closest('[role="dialog"]')) {
        return;
      }
      if (profileRef.current && !profileRef.current.contains(target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="shrink-0 flex gap-3 items-center justify-between z-10 pb-3 border-b border-border">
      <div className="flex items-center gap-4">
        {/* Hamburger Menu for Mobile */}
        <button
          className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
          onClick={() => setIsMobileMenuOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden md:block">
          <h1 className="text-2xl font-semibold">{pageHeader}</h1>
          {subHeader && (
            <div className="text-muted-foreground text-sm mt-1">
              {subHeader}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6 w-full">
        {/* Search - Hide on mobile */}
        {/* <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            value={currentSearch}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 md:py-3 rounded-full bg-sidebar border border-border text-sm w-[200px] lg:w-[300px] focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div> */}
        {/* Notification */}
        <button className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-sidebar border border-border text-muted-foreground hover:text-foreground transition-colors ml-auto">
          <NotificationBell className="w-5 h-5" />
        </button>
        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
