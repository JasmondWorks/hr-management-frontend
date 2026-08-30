import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "outline" | "filled";
}

export function Candidates({ className, variant = "outline", ...props }: IconProps) {
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
      <ellipse fill={variant === "filled" ? "currentColor" : "none"}
        cx="10"
        cy="17.5"
        rx="7"
        ry="3.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle fill={variant === "filled" ? "currentColor" : "none"}
        cx="10"
        cy="7"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.0447 10.2498C14.7227 10.7487 14.3286 11.1968 13.8773 11.5793C14.2318 11.6904 14.6089 11.7502 15 11.7502C17.0711 11.7502 18.75 10.0713 18.75 8.00024C18.75 6.04446 17.2528 4.43838 15.342 4.26562C15.6082 4.78459 15.801 5.34742 15.9067 5.94039C16.6978 6.28911 17.25 7.08019 17.25 8.00024C17.25 9.22794 16.2667 10.226 15.0447 10.2498Z"
        fill="currentColor"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.9995 17.5565C18.9895 18.1707 18.8146 18.7608 18.5008 19.3111C18.8692 19.2097 19.2143 19.0923 19.5311 18.9603C20.1282 18.7115 20.6604 18.3961 21.0548 18.0076C21.4519 17.6165 21.75 17.1066 21.75 16.5002C21.75 15.8938 21.4519 15.3839 21.0548 14.9928C20.6604 14.6043 20.1282 14.2889 19.5311 14.0401C18.5085 13.614 17.1906 13.3396 15.7494 13.2686C16.7516 13.7776 17.5701 14.4172 18.135 15.1445C18.4327 15.2277 18.7071 15.3218 18.9542 15.4247C19.4428 15.6283 19.7893 15.8517 20.0022 16.0614C20.2124 16.2685 20.25 16.4163 20.25 16.5002C20.25 16.5841 20.2124 16.7319 20.0022 16.939C19.796 17.1421 19.4643 17.3581 18.9995 17.5565Z"
        fill="currentColor"
      />
    </svg>
  );
}
