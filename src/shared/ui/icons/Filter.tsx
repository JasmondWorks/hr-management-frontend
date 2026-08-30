import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "outline" | "filled";
}

export function Filter({ className, variant = "outline", ...props }: IconProps) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M3 6H10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M3 12H12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M19 12H21"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M14 6L21 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M13 18H20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M3 18H6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle fill={variant === "filled" ? "currentColor" : "none"} cx="8" cy="18" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle fill={variant === "filled" ? "currentColor" : "none"} cx="17" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle fill={variant === "filled" ? "currentColor" : "none"} cx="12" cy="6" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
