"use client";

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "./shad-cn/input";
import { Label } from "./shad-cn/label";
import { cn } from "@/shared/lib/utils";

export interface InputFieldProps
  extends Omit<React.ComponentProps<"input">, "label"> {
  label: string;
  errorMessage?: string;
}

/**
 * Labelled input abstraction over the shadcn Input/Label. Password fields get a
 * show/hide toggle automatically. Matches the design's floating orange label +
 * bordered field.
 */
export const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, errorMessage, type = "text", id, className, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (show ? "text" : "password") : type;
    const fieldId = id ?? props.name;

    return (
      <div className="flex flex-col gap-1.5">
        {label && <Label htmlFor={fieldId}>{label}</Label>}
        <div className="relative">
          <Input
            id={fieldId}
            ref={ref}
            type={inputType}
            aria-invalid={!!errorMessage}
            className={cn(
              isPassword && "pr-11",
              errorMessage && "border-destructive focus-visible:border-destructive",
              className,
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          )}
        </div>
        {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
      </div>
    );
  },
);
InputField.displayName = "InputField";

export default InputField;
