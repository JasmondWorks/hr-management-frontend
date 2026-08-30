import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "outline" | "filled";
}

export function RightArrow({ className, variant = "outline", ...props }: IconProps) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M10.5 12L13.5 9L10.5 6M13.5 9L4.5 9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
