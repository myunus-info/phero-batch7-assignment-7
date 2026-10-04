import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "success" | "warning" | "cyan";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default: "bg-slate-800 text-slate-200 border-slate-700",
    secondary: "bg-slate-700 text-slate-100 border-transparent",
    outline: "text-slate-300 border-slate-700",
    destructive: "bg-red-950/60 text-red-300 border-red-800/60",
    success: "bg-emerald-950/60 text-emerald-300 border-emerald-800/60",
    warning: "bg-amber-950/60 text-amber-300 border-amber-800/60",
    cyan: "bg-cyan-950/60 text-cyan-300 border-cyan-800/60",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors focus:outline-none select-none",
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
