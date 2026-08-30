import { ChevronDown, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { LogoutButton } from "./LogoutButton";
import { useAuth } from "@/features/auth";
import { ROLES } from "../lib/constants";
import { formatBackendConstant } from "../lib/utils";
import { useRouter } from "next/navigation";

export default function ProfileDropdown() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const { appRole, profile } = useAuth();
  const role = appRole || ROLES.EMPLOYEE;
  const router = useRouter();

  const handleGoToProfile = () => {
    router.push("/profile");
    setIsProfileOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={profileRef}>
      <button
        onClick={() => setIsProfileOpen(!isProfileOpen)}
        className="flex items-center gap-2 md:gap-3 p-1 md:p-1.5 md:pr-4 rounded-full bg-sidebar border border-border hover:bg-accent/50 transition-colors cursor-pointer"
      >
        <img
          src="https://i.pravatar.cc/150?u=lucifer"
          alt="Profile"
          className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover"
        />
        <div className="text-left hidden lg:block">
          <p className="text-sm font-semibold leading-none">
            {profile?.firstName}
          </p>
          <p className="text-xs text-muted-foreground mt-1 capitalize">
            {formatBackendConstant(role)}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-muted-foreground ml-1 hidden md:block transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        className={`absolute right-0 mt-2 w-48 rounded-xl border border-border bg-card shadow-lg overflow-hidden py-1 z-50 animate-in fade-in zoom-in-95 duration-200 ${
          !isProfileOpen ? "hidden" : ""
        }`}
      >
        <button
          onClick={handleGoToProfile}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-accent transition-colors cursor-pointer"
        >
          <User className="w-4 h-4 text-muted-foreground" />
          My Profile
        </button>
        <LogoutButton className="w-full px-4 py-3 text-sm cursor-pointer" />
      </div>
    </div>
  );
}
