import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={cn("space-y-4 w-full", className)} {...props} />;
}

export function Field({ className, ...props }: React.ComponentProps<"div"> & { "data-invalid"?: boolean }) {
  return <div className={cn("space-y-1.5 w-full", className)} {...props} />;
}

export function FieldLabel({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof Label> & { required?: boolean }) {
  return (
    <Label className={cn("text-sm font-medium text-slate-200", className)} {...props}>
      {children}
      {required && <span className="ml-1 text-emerald-400">*</span>}
    </Label>
  );
}

export function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={cn("text-xs text-slate-400", className)} {...props} />;
}

export function FieldError({ errors, className }: { errors?: unknown[]; className?: string }) {
  if (!errors?.length) return null;
  const err = errors[0];
  const message =
    typeof err === "object" && err !== null && "message" in err
      ? String((err as { message: unknown }).message)
      : String(err);

  return <p className={cn("text-xs font-medium text-red-400 mt-1", className)}>{message}</p>;
}

interface FormFieldProps {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, description, required, className, children }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium text-slate-200">
            {label}
            {required && <span className="ml-1 text-emerald-400">*</span>}
          </Label>
        </div>
      )}
      {children}
      {description && !error && <p className="text-xs text-slate-400">{description}</p>}
      {error && <p className="text-xs font-medium text-red-400">{error}</p>}
    </div>
  );
}
