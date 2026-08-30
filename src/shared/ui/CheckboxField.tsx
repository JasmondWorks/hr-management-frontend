"use client";

import * as React from "react";
import { Label } from "./shad-cn/label";
import { cn } from "@/shared/lib/utils";

export interface CheckboxFieldProps
  extends Omit<React.ComponentProps<"input">, "type" | "label"> {
  label: string;
  description?: string;
  errorMessage?: string;
}

/**
 * Labelled checkbox matching the InputField pattern — forwards its ref so it
 * works with react-hook-form's `register`.
 */
export const CheckboxField = React.forwardRef<
  HTMLInputElement,
  CheckboxFieldProps
>(({ label, description, errorMessage, id, className, ...props }, ref) => {
  const fieldId = id ?? props.name;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-start gap-2.5">
        <input
          id={fieldId}
          ref={ref}
          type="checkbox"
          aria-invalid={!!errorMessage}
          className={cn(
            "mt-0.5 size-4 shrink-0 cursor-pointer rounded border-input accent-primary",
            className,
          )}
          {...props}
        />
        <div className="flex flex-col gap-0.5">
          <Label htmlFor={fieldId} className="cursor-pointer">
            {label}
          </Label>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
    </div>
  );
});
CheckboxField.displayName = "CheckboxField";

export default CheckboxField;
