"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Clock, Send, AlertTriangle } from "lucide-react";
import { useCountdown } from "@/hooks";

interface ArenaHeaderProps {
  assessmentTitle: string;
  totalProblems: number;
  completedProblems: number;
  durationMinutes: number;
  startedAt?: string | null;
  onFinish: () => void;
  onAutoSubmit?: () => void;
  isSubmitting?: boolean;
}

export function ArenaHeader({
  assessmentTitle,
  totalProblems,
  completedProblems,
  durationMinutes,
  startedAt,
  onFinish,
  onAutoSubmit,
  isSubmitting,
}: ArenaHeaderProps) {
  // Total seconds calculated from durationMinutes
  const totalSeconds = durationMinutes * 60;
  const { formattedTime, isExpired, secondsLeft } = useCountdown({
    initialSeconds: totalSeconds,
    startedAt,
    onExpire: onAutoSubmit,
  });

  const isLowTime = secondsLeft <= 300 && secondsLeft > 0; // Less than 5 min

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-border bg-background px-4 sm:px-6 transition-colors duration-200">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Logo className="h-6 w-auto" />
          <span className="font-mono text-base font-bold text-foreground">
            Dev<span className="text-emerald-500">Judge</span>
          </span>
        </div>

        <div className="hidden h-5 w-px bg-border sm:block" />

        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-foreground truncate max-w-xs md:max-w-md">{assessmentTitle}</h2>
          <p className="text-xs text-muted-foreground">
            Progress: {completedProblems} of {totalProblems} problems completed
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Countdown Timer */}
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold transition-colors ${
            isExpired
              ? "bg-red-500/10 border-red-500/30 text-red-500"
              : isLowTime
                ? "bg-amber-500/10 border-amber-500/30 text-amber-500 animate-pulse"
                : "bg-card border-border text-foreground"
          }`}
        >
          {isLowTime ? (
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          ) : (
            <Clock className="h-4 w-4 text-muted-foreground" />
          )}
          <span>{isExpired ? "Time's up!" : formattedTime}</span>
        </div>

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Finish Assessment Button */}
        <Button variant="emerald" size="sm" onClick={onFinish} isLoading={isSubmitting} className="gap-2 font-medium">
          <Send className="h-4 w-4" />
          <span>Finish & Submit</span>
        </Button>
      </div>
    </header>
  );
}
