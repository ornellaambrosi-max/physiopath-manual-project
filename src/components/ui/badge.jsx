import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const variants = {
  default: "bg-blue-600 text-white",
  secondary: "bg-gray-200 text-gray-900 dark:bg-zinc-800 dark:text-gray-100",
  outline:
    "border border-gray-300 text-gray-900 dark:border-zinc-700 dark:text-gray-100",
  success: "bg-green-600 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-cyan-600 text-white",
  destructive: "bg-red-600 text-white",
};

export function Badge({ className, variant = "default", children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
