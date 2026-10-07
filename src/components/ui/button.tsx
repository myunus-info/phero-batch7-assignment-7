import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "emerald" | "cyan";
  size?: "default" | "sm" | "lg" | "icon" | "xs";
  isLoading?: boolean;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:translate-y-px",
  emerald: "bg-emerald-600 text-white hover:bg-emerald-500 shadow-sm shadow-emerald-950/20 active:translate-y-px",
  cyan: "bg-cyan-600 text-white hover:bg-cyan-500 shadow-sm shadow-cyan-950/20 active:translate-y-px",
  destructive: "bg-red-600 text-white hover:bg-red-500 shadow-sm active:translate-y-px",
  outline: "border border-border bg-card text-foreground hover:bg-muted shadow-sm",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:translate-y-px",
  ghost: "text-muted-foreground hover:bg-muted hover:text-foreground",
  link: "text-emerald-500 underline-offset-4 hover:underline p-0 h-auto",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  default: "h-9 px-4 py-2",
  xs: "h-7 px-2.5 text-xs rounded-md",
  sm: "h-8 px-3 text-xs rounded-md",
  lg: "h-11 px-6 text-base rounded-xl",
  icon: "size-9",
};

export const buttonVariants = ({
  variant = "default",
  size = "default",
  className,
}: {
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
} = {}) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer";

  return cn(baseStyles, variantStyles[variant ?? "default"], sizeStyles[size ?? "default"], className);
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", isLoading = false, disabled, children, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { Button };
