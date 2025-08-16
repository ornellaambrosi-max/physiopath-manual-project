import React from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Progress
 * - value: numero 0–100
 * - aria-friendly e responsive
 */
export function Progress({ value = 0, className, label, ...props }) {
  const clamped = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className={cn("w-full", className)} {...props}>
      {label ? (
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-300">{label}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{clamped}%</span>
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className={cn(
          "relative h-3 w-full overflow-hidden rounded-full bg-gray-200",
          "dark:bg-zinc-800"
        )}
      >
        <div
          className={cn(
            "h-full rounded-full bg-blue-600 transition-[width] duration-300 ease-out"
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
