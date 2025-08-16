import React, { forwardRef } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  default:
    "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-600",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-400 dark:bg-zinc-800 dark:text-gray-100 dark:hover:bg-zinc-700",
  outline:
    "border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900 dark:border-zinc-700 dark:text-gray-100 dark:hover:bg-zinc-800",
  ghost:
    "bg-transparent hover:bg-gray-100 text-gray-900 dark:hover:bg-zinc-800 dark:text-gray-100",
  link:
    "bg-transparent text-blue-600 underline-offset-4 hover:underline",
  destructive:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600",
};

const sizes = {
  sm: "h-8 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-6",
  icon: "h-10 w-10",
};

export const Button = forwardRef(
  ({ className, variant = "default", size = "md", asChild, ...props }, ref) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
