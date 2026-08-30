"use client";

import * as React from "react";
import { Label } from "./shad-cn/label";
import { cn } from "@/shared/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./shad-cn/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./shad-cn/command";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps extends Omit<React.ComponentProps<"select">, "label" | "value" | "onChange"> {
  label: string;
  errorMessage?: string;
  options: (string | SelectOption)[];
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const SelectField = React.forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, errorMessage, options, placeholder, id, className, value, onChange, ...props }, ref) => {
    const fieldId = id ?? props.name;
    const [open, setOpen] = React.useState(false);
    
    const [internalValue, setInternalValue] = React.useState(value || "");

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const handleSelect = (currentValue: string) => {
      const newValue = currentValue === internalValue ? "" : currentValue;
      if (value === undefined) {
        setInternalValue(newValue);
      }
      
      if (onChange) {
        const event = {
          target: { value: newValue, name: props.name },
          currentTarget: { value: newValue, name: props.name }
        } as React.ChangeEvent<HTMLSelectElement>;
        onChange(event);
      }
      setOpen(false);
    };

    const selectedOption = options.find((opt) => {
      const optValue = typeof opt === "string" ? opt : opt.value;
      return optValue === internalValue;
    });
    
    const displayLabel = selectedOption
      ? (typeof selectedOption === "string" ? selectedOption : selectedOption.label)
      : placeholder || "Select an option";

    return (
      <div className="flex flex-col gap-1.5">
        {label && <Label htmlFor={fieldId}>{label}</Label>}
        
        <select 
          id={fieldId}
          ref={ref}
          value={internalValue}
          onChange={onChange}
          className="hidden"
          aria-hidden="true"
          {...props}
        >
          <option value="">{placeholder || "Select an option"}</option>
          {options.map((option) => {
            const val = typeof option === "string" ? option : option.value;
            const lbl = typeof option === "string" ? option : option.label;
            return <option key={val} value={val}>{lbl}</option>;
          })}
        </select>

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              role="combobox"
              aria-expanded={open}
              aria-invalid={!!errorMessage}
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errorMessage && "border-destructive focus:ring-destructive",
                className
              )}
              disabled={props.disabled}
            >
              <span className="truncate">{displayLabel}</span>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <Command>
              <CommandInput placeholder={`Search ${label?.toLowerCase() || "options"}...`} />
              <CommandList>
                <CommandEmpty>No {label?.toLowerCase() || "options"} found.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const optValue = typeof option === "string" ? option : option.value;
                    const optLabel = typeof option === "string" ? option : option.label;
                    return (
                      <CommandItem
                        key={optValue}
                        value={optLabel}
                        onSelect={(currentValue) => {
                          const originalOption = options.find(opt => {
                            const lbl = typeof opt === "string" ? opt : opt.label;
                            return lbl.toLowerCase() === currentValue;
                          });
                          if (originalOption) {
                            const finalValue = typeof originalOption === "string" ? originalOption : originalOption.value;
                            handleSelect(finalValue);
                          } else {
                            // Fallback just in case
                            handleSelect(optValue);
                          }
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            internalValue === optValue ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {optLabel}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {errorMessage && <p className="text-xs text-destructive">{errorMessage}</p>}
      </div>
    );
  }
);
SelectField.displayName = "SelectField";

export default SelectField;
