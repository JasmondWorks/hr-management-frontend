import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "outline" | "filled";
}

export function Logout({ className, variant = "outline", ...props }: IconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      <path fill={variant === "filled" ? "#F45B69" : "none"}
        d="M15 11.6666L15.9596 10.7071C16.3501 10.3165 16.3501 9.68338 15.9596 9.29285L15 8.33329"
        stroke="#F45B69"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path fill={variant === "filled" ? "#F45B69" : "none"}
        d="M15.834 10L10.834 10M3.33398 14.3886V6.05527M13.334 14.3886C13.334 15.3091 12.5878 16.0553 11.6673 16.0553H8.33398M13.334 6.05527C13.334 5.1348 12.5878 4.38861 11.6673 4.38861H8.33398M4.07615 16.5501L5.74282 17.6612C6.85041 18.3996 8.33398 17.6056 8.33398 16.2744V4.16947C8.33398 2.83831 6.85041 2.04432 5.74282 2.78272L4.07615 3.89383C3.61249 4.20294 3.33398 4.72333 3.33398 5.28058V15.1633C3.33398 15.7206 3.61249 16.2409 4.07615 16.5501Z"
        stroke="#F45B69"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
