"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Button as ShadButton,
  type ButtonProps as ShadButtonProps,
} from "./shad-cn/button";
import { cn } from "@/shared/lib/utils";

export interface ButtonProps extends ShadButtonProps {
  loading?: boolean;
}

/**
 * App-wide button abstraction over the shadcn primitive. Adds a `loading` state
 * (spinner + disabled). Import this from `@/shared/ui/Button` in features/views.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ loading = false, disabled, children, className, ...props }, ref) => (
    <ShadButton
      ref={ref}
      disabled={disabled || loading}
      className={cn(className)}
      {...props}
    >
      {loading && <Loader2 className="animate-spin" />}
      {children}
    </ShadButton>
  ),
);
Button.displayName = "Button";

export default Button;
