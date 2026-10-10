import { cn } from "@/lib/utils";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-6 w-6 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <output
      className={cn(
        "inline-block animate-spin rounded-full border-t-emerald-500 border-r-transparent border-b-emerald-500 border-l-transparent",
        sizeClasses[size],
        className,
      )}
    >
      <span className="sr-only">Loading...</span>
    </output>
  );
}
