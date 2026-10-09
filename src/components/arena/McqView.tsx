"use client";

import { IMcqOption } from "@/types";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface McqViewProps {
  options: IMcqOption[];
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  isSubmitted?: boolean;
}

export function McqView({
  options,
  selectedOptionId,
  onSelectOption,
  onSubmit,
  isSubmitting = false,
  isSubmitted = false,
}: McqViewProps) {
  return (
    <div className="flex h-full flex-col justify-between p-6 bg-card">
      <div className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Select the correct answer:
        </h3>

        <div className="space-y-3">
          {options.map((option, idx) => {
            const isSelected = selectedOptionId === option.id;
            return (
              <button
                key={option.id || idx}
                type="button"
                disabled={isSubmitted}
                onClick={() => !isSubmitted && onSelectOption(option.id || String(idx))}
                className={cn(
                  "flex w-full items-center justify-between p-4 rounded-xl border text-left transition-all",
                  isSubmitted && "cursor-not-allowed opacity-90",
                  isSelected
                    ? "border-emerald-500 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300"
                    : "border-border bg-card hover:bg-muted text-foreground",
                )}
              >
                <div className="flex items-center space-x-4">
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-mono font-bold ${
                      isSelected ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-medium">{option.text}</span>
                </div>

                {isSelected && <CheckCircle2 className="h-5 w-5 text-emerald-500" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="pt-6 border-t border-border flex justify-end">
        <Button
          variant={isSubmitted ? "secondary" : "emerald"}
          onClick={onSubmit}
          disabled={!selectedOptionId || isSubmitting || isSubmitted}
          isLoading={isSubmitting}
          className={cn(
            "gap-2",
            isSubmitted &&
              "cursor-not-allowed pointer-events-auto disabled:cursor-not-allowed disabled:pointer-events-auto opacity-70 border border-border text-muted-foreground shadow-none",
          )}
          title={isSubmitted ? "Answer already submitted for this question" : undefined}
        >
          {isSubmitted ? (
            <>
              <Check className="h-4 w-4 text-emerald-500" />
              <span>Answer Submitted</span>
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              <span>Save & Submit MCQ</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
