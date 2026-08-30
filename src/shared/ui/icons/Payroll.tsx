import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "outline" | "filled";
}

export function Payroll({ className, variant = "outline", ...props }: IconProps) {
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
      <circle fill={variant === "filled" ? "currentColor" : "none"} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M14 10C14 8.89543 13.1046 8 12 8C10.8954 8 10 8.89543 10 10C10 11.1046 10.8954 12 12 12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M12 6.5V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M12 16V17.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
