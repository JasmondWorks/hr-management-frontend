import * as React from "react";

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  variant?: "outline" | "filled";
}

export function Projects({ className, variant = "outline", ...props }: IconProps) {
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
      <path fill={variant === "filled" ? "currentColor" : "none"}
        d="M5.83333 18.3332C7.38957 18.3332 8.69672 17.2667 9.06381 15.8247C9.17736 15.3787 9.53976 14.9998 10 14.9998H15.8333M5.83333 18.3332C3.99238 18.3332 2.5 16.8408 2.5 14.9998V4.1665C2.5 2.78579 3.61929 1.6665 5 1.6665H13.3333C14.714 1.6665 15.8333 2.78579 15.8333 4.1665V14.9998M5.83333 18.3332H15.8333C17.3896 18.3332 18.6967 17.2667 19.0638 15.8247C19.1774 15.3787 18.7936 14.9998 18.3333 14.9998H15.8333M12.5 5.83317H5.83333M9.16667 9.99984H5.83333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
