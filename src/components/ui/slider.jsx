import React, { useMemo } from "react";

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Slider
 * - Wrapper su <input type="range">
 * - props: min, max, step, value, onChange
 * - opzionale: showValue (mostra il valore a destra)
 * - opzionale: marks (array di numeri per tacche)
 */
export function Slider({
  className,
  min = 0,
  max = 100,
  step = 1,
  value = 0,
  onChange,
  showValue = true,
  marks = [],
  ...props
}) {
  const clamped = Math.max(min, Math.min(max, Number(value) || 0));
  const percent = ((clamped - min) / (max - min)) * 100;

  const trackBg = useMemo(() => {
    // riempi la parte sinistra con colore primario
    return `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${percent}%, rgba(156,163,175,0.5) ${percent}%, rgba(156,163,175,0.5) 100%)`;
  }, [percent]);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {min}
        </div>
        {showValue ? (
          <div className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {clamped}
          </div>
        ) : <div />}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {max}
        </div>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={clamped}
        onChange={(e) => onChange?.(Number(e.target.value))}
        style={{ backgroundImage: trackBg }}
        className={cn(
          "h-2 w-full appearance-none rounded-full",
          "bg-gray-300 dark:bg-zinc-700",
          "outline-none"
        )}
        {...props}
      />

      {/* stile del thumb */}
      <style>{`
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          background: rgb(37,99,235);
          border: 2px solid white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          cursor: pointer;
          margin-top: -8px;
        }
        input[type="range"]::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          background: rgb(37,99,235);
          border: 2px solid white;
          box-shadow: 0 1px 2px rgba(0,0,0,0.15);
          cursor: pointer;
        }
        input[type="range"]::-ms-thumb {
          height: 18px;
          width: 18px;
          border-radius: 9999px;
          background: rgb(37,99,235);
          border: 2px solid white;
          cursor: pointer;
        }
      `}</style>

      {/* tacche facoltative */}
      {marks?.length ? (
        <div className="relative mt-2 h-4">
          {marks.map((m) => {
            const p = ((m - min) / (max - min)) * 100;
            return (
              <span
                key={m}
                className="absolute top-0 h-4 w-px bg-gray-400 dark:bg-zinc-600"
                style={{ left: `${p}%` }}
                title={String(m)}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
