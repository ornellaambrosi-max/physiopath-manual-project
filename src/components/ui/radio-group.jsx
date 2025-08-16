import React, { createContext, useContext, useId } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

const RadioGroupCtx = createContext(null);

/**
 * RadioGroup
 * - value, onChange
 * - name (auto con useId)
 * - direction: "column" | "row"
 */
export function RadioGroup({
  value,
  onChange,
  name,
  direction = "column",
  className,
  children,
  ...props
}) {
  const auto = useId();
  return (
    <RadioGroupCtx.Provider value={{ value, onChange, name: name ?? auto }}>
      <div
        role="radiogroup"
        className={cn(
          "flex gap-3",
          direction === "row" ? "flex-row items-center" : "flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </RadioGroupCtx.Provider>
  );
}

/**
 * RadioGroupItem
 * - value, label, description?
 */
export function RadioGroupItem({
  value,
  label,
  description,
  disabled = false,
  className,
  children, // contenuto custom opzionale
}) {
  const ctx = useContext(RadioGroupCtx);
  if (!ctx) {
    console.warn("RadioGroupItem must be used within <RadioGroup>");
    return null;
  }
  const id = useId();
  const checked = ctx.value === value;

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-md border p-3",
        checked
          ? "border-blue-600 bg-blue-50/60 dark:bg-blue-900/20"
          : "border-gray-300 dark:border-zinc-700",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <input
        id={id}
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={() => !disabled && ctx.onChange?.(value)}
        className="mt-1 h-4 w-4 accent-blue-600"
      />

      <div className="flex-1">
        {label ? (
          <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </div>
        ) : null}
        {description ? (
          <div className="text-xs text-gray-600 dark:text-gray-300">
            {description}
          </div>
        ) : null}
        {children}
      </div>
    </label>
  );
}
