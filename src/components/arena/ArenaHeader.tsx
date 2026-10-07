"use client";

import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { Clock, Send, AlertTriangle } from "lucide-react";
import { useCountdown } from "@/hooks/countdown.hook";

interface ArenaHeaderProps {
  assessmentTitle: string;
  totalProblems: number;
  completedProblems: number;
  durationMinutes: number;
  onFinish: () => void;
  onAutoSubmit?: () => void;
  isSubmitting?: boolean;
}

export function ArenaHeader({
  assessmentTitle,
  totalProblems,
  completedProblems,
  durationMinutes,
  onFinish,
  onAutoSubmit,
  isSubmitting,
}: ArenaHeaderProps) {
  // Total seconds calculated from durationMinutes
  const totalSeconds = durationMinutes * 60;
  const { formattedTime, isExpired, secondsLeft } = useCountdown({
    initialSeconds: totalSeconds,
    onExpire: onAutoSubmit,
  });

  const isLowTime = secondsLeft <= 300 && secondsLeft > 0; // Less than 5 min

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950 px-4 sm:px-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Logo className="h-6 w-auto" />
          <span className="font-mono text-base font-bold text-white">
            Dev<span className="text-emerald-400">Judge</span>
          </span>
        </div>

        <div className="hidden h-5 w-px bg-slate-800 sm:block" />

        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-slate-200 truncate max-w-xs md:max-w-md">{assessmentTitle}</h2>
          <p className="text-xs text-slate-400">
            Progress: {completedProblems} of {totalProblems} problems completed
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Countdown Timer */}
        <div
          className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg border font-mono text-sm font-bold transition-colors ${
            isExpired
              ? "bg-red-500/10 border-red-500/30 text-red-400"
              : isLowTime
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 animate-pulse"
                : "bg-slate-900 border-slate-800 text-slate-200"
          }`}
        >
          {isLowTime ? (
            <AlertTriangle className="h-4 w-4 text-amber-400" />
          ) : (
            <Clock className="h-4 w-4 text-slate-400" />
          )}
          <span>{isExpired ? "Time's up!" : formattedTime}</span>
        </div>

        {/* Finish Assessment Button */}
        <Button variant="emerald" size="sm" onClick={onFinish} isLoading={isSubmitting} className="gap-2 font-medium">
          <Send className="h-4 w-4" />
          <span>Finish & Submit</span>
        </Button>
      </div>
    </header>
  );
}
