import React, { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Select
 * - Wrapper stilizzato del <select> nativo
 * - passare "options" come array di { value, label, disabled? }
 * - supporta error/success tramite variant
 */
const base =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-3 pr-8 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100";

const variants = {
  default: "",
  error: "border-red-500 focus-visible:ring-red-600 dark:border-red-600",
  success:
    "border-green-500 focus-visible:ring-green-600 dark:border-green-600",
};

export const Select = forwardRef(
  (
    {
      className,
      variant = "default",
      options = [],
      placeholder,
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative w-full", className)}>
        <select
          ref={ref}
          className={cn(base, variants[variant], "appearance-none")}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled hidden>
              {placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option
              key={String(opt.value)}
              value={opt.value}
              disabled={opt.disabled}
            >
              {opt.label ?? opt.value}
            </option>
          ))}
        </select>

        {/* caret */}
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="pointer-events-none absolute right-2 top-1/2 h-5 w-5 -translate-y-1/2 opacity-70"
          fill="currentColor"
        >
          <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.19l3.71-2.96a.75.75 0 0 1 .94 1.16l-4.24 3.39a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" />
        </svg>
      </div>
    );
  }
);

Select.displayName = "Select";
