import React from "react";
import { Check, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProgressIndicator({ 
  steps = [], 
  currentStep = 1, 
  className = "",
  showLabels = true,
  size = "default" // "sm", "default", "lg"
}) {
  const sizeClasses = {
    sm: {
      container: "py-4",
      step: "w-8 h-8 text-xs",
      line: "h-0.5",
      label: "text-xs"
    },
    default: {
      container: "py-6",
      step: "w-10 h-10 text-sm",
      line: "h-1",
      label: "text-sm"
    },
    lg: {
      container: "py-8",
      step: "w-12 h-12 text-base",
      line: "h-1.5",
      label: "text-base"
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className={cn("w-full", classes.container, className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isUpcoming = stepNumber > currentStep;

          return (
            <div key={step.id || index} className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div className="relative flex items-center justify-center">
                <div
                  className={cn(
                    "flex items-center justify-center rounded-full font-semibold transition-all duration-300 border-2",
                    classes.step,
                    {
                      "bg-sage-600 text-white border-sage-600 shadow-md": isCompleted,
                      "bg-white dark:bg-warm-gray-800 text-sage-600 dark:text-sage-400 border-sage-600 dark:border-sage-400 shadow-lg ring-4 ring-sage-100 dark:ring-sage-900": isCurrent,
                      "bg-warm-gray-100 dark:bg-warm-gray-700 text-warm-gray-400 dark:text-warm-gray-500 border-warm-gray-300 dark:border-warm-gray-600": isUpcoming
                    }
                  )}
                  role="img"
                  aria-label={`Step ${stepNumber}: ${isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming'}`}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <span aria-hidden="true">{stepNumber}</span>
                  )}
                </div>

                {/* Connection Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-full top-1/2 transform -translate-y-1/2 transition-all duration-300",
                      classes.line,
                      {
                        "bg-sage-600": isCompleted,
                        "bg-warm-gray-300 dark:bg-warm-gray-600": !isCompleted
                      }
                    )}
                    style={{ 
                      width: `calc(100% - ${classes.step.includes('w-8') ? '2rem' : classes.step.includes('w-10') ? '2.5rem' : '3rem'})`,
                      marginLeft: classes.step.includes('w-8') ? '1rem' : classes.step.includes('w-10') ? '1.25rem' : '1.5rem'
                    }}
                    aria-hidden="true"
                  />
                )}
              </div>

              {/* Step Label */}
              {showLabels && (
                <div className="mt-4 text-center max-w-24">
                  <div
                    className={cn(
                      "font-medium transition-colors duration-300",
                      classes.label,
                      {
                        "text-sage-700 dark:text-sage-300": isCompleted || isCurrent,
                        "text-warm-gray-500 dark:text-warm-gray-400": isUpcoming
                      }
                    )}
                  >
                    {step.title}
                  </div>
                  {step.description && (
                    <div className="text-xs text-warm-gray-500 dark:text-warm-gray-400 mt-1 leading-tight">
                      {step.description}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}