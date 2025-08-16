import React, { useState } from "react";
import { HelpCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Tooltip({ 
  content, 
  children, 
  position = "top", 
  trigger = "hover", 
  variant = "default",
  className = "",
  maxWidth = "sm"
}) {
  const [isVisible, setIsVisible] = useState(false);

  const variants = {
    default: "bg-warm-gray-800 dark:bg-warm-gray-200 text-white dark:text-warm-gray-800 border-warm-gray-700 dark:border-warm-gray-300",
    info: "bg-ocean-600 text-white border-ocean-500",
    warning: "bg-amber-500 text-white border-amber-400",
    error: "bg-red-600 text-white border-red-500"
  };

  const positions = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 mr-2",
    right: "left-full top-1/2 transform -translate-y-1/2 ml-2"
  };

  const arrowPositions = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent",
    bottom: "bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent",
    left: "left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent",
    right: "right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent"
  };

  const maxWidths = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg"
  };

  const handleShow = () => {
    if (trigger === 'hover' || trigger === 'focus') {
      setIsVisible(true);
    }
  };

  const handleHide = () => {
    if (trigger === 'hover' || trigger === 'focus') {
      setIsVisible(false);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsVisible(!isVisible);
    }
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
        onClick={handleClick}
        className="cursor-help"
        role="button"
        tabIndex={0}
        aria-describedby={isVisible ? "tooltip" : undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleClick();
          }
        }}
      >
        {children}
      </div>

      {isVisible && (
        <div
          id="tooltip"
          role="tooltip"
          className={cn(
            "absolute z-50 px-3 py-2 text-sm font-medium rounded-lg border shadow-lg transition-opacity duration-200",
            variants[variant],
            positions[position],
            maxWidths[maxWidth],
            className
          )}
        >
          {content}
          
          {/* Arrow */}
          <div
            className={cn(
              "absolute w-0 h-0 border-4",
              arrowPositions[position],
              variant === 'default' && "border-warm-gray-800 dark:border-warm-gray-200",
              variant === 'info' && "border-ocean-600",
              variant === 'warning' && "border-amber-500",
              variant === 'error' && "border-red-600"
            )}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}

// Convenience component for help icons with tooltips
export function HelpTooltip({ content, variant = "default", className = "" }) {
  return (
    <Tooltip content={content} variant={variant} className={className}>
      <HelpCircle className="w-4 h-4 text-warm-gray-400 hover:text-warm-gray-600 dark:text-warm-gray-500 dark:hover:text-warm-gray-300 transition-colors" />
    </Tooltip>
  );
}

// Convenience component for info icons with tooltips
export function InfoTooltip({ content, className = "" }) {
  return (
    <Tooltip content={content} variant="info" className={className}>
      <Info className="w-4 h-4 text-ocean-500 hover:text-ocean-600 transition-colors" />
    </Tooltip>
  );
}

// Convenience component for warning icons with tooltips
export function WarningTooltip({ content, className = "" }) {
  return (
    <Tooltip content={content} variant="warning" className={className}>
      <AlertTriangle className="w-4 h-4 text-amber-500 hover:text-amber-600 transition-colors" />
    </Tooltip>
  );
}

import React, { useState, useRef, useEffect } from "react";

/**
 * Tooltip semplice, accessibile:
 * <Tooltip content="Testo"> <button>Hover me</button> </Tooltip>
 */
export default function Tooltip({ content, children, placement = "top", className }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <span
      className={["relative inline-block", className].filter(Boolean).join(" ")}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      ref={ref}
    >
      {children}

      {open ? (
        <span
          role="tooltip"
          className="absolute z-20 whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-xs text-white shadow"
          style={getPositionStyle(ref.current, placement)}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}

function getPositionStyle(anchor, placement) {
  // fallback semplice; lascia che il browser posizioni in modo relativo
  const base = { transform: "translate(-50%, -6px)" };
  switch (placement) {
    case "bottom":
      return { left: "50%", top: "100%", transform: "translate(-50%, 6px)" };
    case "left":
      return { right: "100%", top: "50%", transform: "translate(-6px, -50%)" };
    case "right":
      return { left: "100%", top: "50%", transform: "translate(6px, -50%)" };
    case "top":
    default:
      return { left: "50%", bottom: "100%", ...base };
  }
}
