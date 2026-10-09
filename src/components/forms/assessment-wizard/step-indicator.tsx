"use client";

import { Check } from "lucide-react";

export interface StepIndicatorProps {
  currentStep: 1 | 2 | 3;
  onStepClick?: (step: 1 | 2 | 3) => void;
}

const STEPS = [
  { num: 1 as const, label: "Assessment Basics" },
  { num: 2 as const, label: "Select Problems" },
  { num: 3 as const, label: "Review & Publish" },
];

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between border-b border-border pb-4">
      {STEPS.map(s => {
        const isCurrent = currentStep === s.num;
        const isCompleted = currentStep > s.num;
        const canClick = isCompleted && onStepClick;

        return (
          <div
            key={s.num}
            onClick={() => canClick && onStepClick(s.num)}
            className={`flex items-center space-x-2 select-none ${
              canClick ? "cursor-pointer hover:opacity-80 transition-opacity" : ""
            }`}
          >
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                isCurrent
                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/20"
                  : isCompleted
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {isCompleted ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span
              className={`text-sm font-medium ${
                isCurrent
                  ? "text-foreground font-semibold"
                  : isCompleted
                    ? "text-foreground/80"
                    : "text-muted-foreground"
              }`}
            >
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default StepIndicator;
