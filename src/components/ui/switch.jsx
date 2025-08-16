import React, { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Switch
 * - checked, onChange
 * - disabled
 * - accessibile (role="switch", aria-checked)
 */
export const Switch = forwardRef(
  ({ className, checked = false, onChange, disabled = false, label, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={!!checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => !disabled && onChange?.(!checked)}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border transition-colors",
          checked
            ? "border-blue-600 bg-blue-600"
            : "border-gray-300 bg-gray-200 dark:border-zinc-700 dark:bg-zinc-800",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-5 w-5 translate-x-0 rounded-full bg-white shadow ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-1"
          )}
        />
      </button>
    );
  }
);

Switch.displayName = "Switch";
