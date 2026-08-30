import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "outline" | "filled";
}

export function RiseArrow({ className, variant = "outline", ...props }: IconProps) {
  return (
    <svg
      width="11"
      height="9"
      viewBox="0 0 11 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path
        d="M3.48207 9L7.01793 9C8.56151 9 9.52325 7.32557 8.74548 5.99226L6.97756 2.96153C6.2058 1.63852 4.2942 1.63852 3.52244 2.96153L1.75452 5.99226C0.97675 7.32557 1.93849 9 3.48207 9Z"
        fill="#30BE82"
      />
    </svg>
  );
}
