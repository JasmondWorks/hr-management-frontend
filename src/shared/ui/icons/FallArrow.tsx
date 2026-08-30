import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "outline" | "filled";
}

export function FallArrow({ className, variant = "outline", ...props }: IconProps) {
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
        d="M7.01793 3.06763e-07L3.48207 1.52206e-07C1.93849 8.47342e-08 0.976749 1.67443 1.75451 3.00774L3.52244 6.03847C4.2942 7.36148 6.2058 7.36148 6.97756 6.03847L8.74548 3.00774C9.52325 1.67443 8.56151 3.74235e-07 7.01793 3.06763e-07Z"
        fill="#F45B69"
      />
    </svg>
  );
}
