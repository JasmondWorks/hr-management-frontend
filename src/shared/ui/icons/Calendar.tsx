import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "outline" | "filled";
}

export function Calendar({ className, variant = "outline", ...props }: IconProps) {
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
      <path fill={variant === "filled" ? "#E25319" : "none"}
        d="M3 7.5C3 5.29086 4.79086 3.5 7 3.5H17C19.2091 3.5 21 5.29086 21 7.5V18C21 20.2091 19.2091 22 17 22H7C4.79086 22 3 20.2091 3 18V7.5Z"
        stroke="#E25319"
        strokeWidth="1.5"
      />
      <path fill={variant === "filled" ? "#E25319" : "none"}
        d="M3 9H21"
        stroke="#E25319"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path fill={variant === "filled" ? "#E25319" : "none"}
        d="M8 2L8 5"
        stroke="#E25319"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill={variant === "filled" ? "#E25319" : "none"}
        d="M16 2V5"
        stroke="#E25319"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="15" r="1" fill="#E25319" />
      <circle cx="16" cy="15" r="1" fill="#E25319" />
      <circle cx="8" cy="15" r="1" fill="#E25319" />
    </svg>
  );
}
