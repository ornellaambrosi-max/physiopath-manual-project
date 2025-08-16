import React, { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-100 dark:placeholder:text-gray-500";

const variants = {
  default: "",
  error:
    "border-red-500 focus-visible:ring-red-600 dark:border-red-600",
  success:
    "border-green-500 focus-visible:ring-green-600 dark:border-green-600",
};

export const Input = forwardRef(
  (
    {
      className,
      variant = "default",
      leftIcon,
      rightIcon,
      type = "text",
      ...props
    },
    ref
  ) => {
    return (
      <div className={cn("relative w-full", className)}>
        {leftIcon ? (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {leftIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          type={type}
          className={cn(
            base,
            variants[variant],
            leftIcon && "pl-10",
            rightIcon && "pr-10"
          )}
          {...props}
        />

        {rightIcon ? (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightIcon}
          </span>
        ) : null}
      </div>
    );
  }
);

Input.displayName = "Input";
