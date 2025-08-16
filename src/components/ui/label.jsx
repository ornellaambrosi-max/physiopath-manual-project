import React, { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Label
 * - Usa htmlFor per collegarsi a input/select/textarea
 * - Supporta stato "required" e "hint"
 */
export const Label = forwardRef(
  ({ className, children, htmlFor, required = false, hint, ...props }, ref) => {
    return (
      <label
        ref={ref}
        htmlFor={htmlFor}
        className={cn(
          "mb-1 inline-flex items-baseline gap-1 text-sm font-medium text-gray-800",
          "dark:text-gray-100",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {required ? (
          <span className="text-red-600" aria-hidden="true">
            *
          </span>
        ) : null}
        {hint ? (
          <span className="ml-1 text-xs font-normal text-gray-500 dark:text-gray-400">
            {hint}
          </span>
        ) : null}
      </label>
    );
  }
);

Label.displayName = "Label";
