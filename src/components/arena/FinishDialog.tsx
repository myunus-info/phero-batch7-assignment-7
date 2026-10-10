"use client";

import confetti from "canvas-confetti";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FinishDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmFinish: () => void;
  isSubmitting?: boolean;
  answeredCount: number;
  totalCount: number;
}

export function FinishDialog({
  open,
  onOpenChange,
  onConfirmFinish,
  isSubmitting,
  answeredCount,
  totalCount,
}: FinishDialogProps) {
  const hasUnanswered = answeredCount < totalCount;

  const handleFinish = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore in SSR
    }
    onConfirmFinish();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogHeader>
        <div className="flex items-center space-x-2">
          {hasUnanswered ? (
            <AlertTriangle className="h-5 w-5 text-amber-400" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
          )}
          <DialogTitle>Finish Assessment?</DialogTitle>
        </div>
        <DialogDescription>
          {hasUnanswered ? (
            <span className="text-amber-600 dark:text-amber-300">
              You have completed {answeredCount} out of {totalCount} problems.
              Submitting now means any unanswered questions will receive 0
              points.
            </span>
          ) : (
            <span>
              You have completed all {totalCount} problems. Are you ready to
              submit your assessment and compute your final score?
            </span>
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="rounded-lg border border-border bg-muted/40 p-3 my-2 text-xs font-mono text-muted-foreground">
        Once submitted, your solutions cannot be altered. Your score and
        performance report will be generated immediately.
      </div>

      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={isSubmitting}
        >
          Return to Assessment
        </Button>
        <Button
          variant="emerald"
          onClick={handleFinish}
          isLoading={isSubmitting}
        >
          Yes, Submit Now
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
