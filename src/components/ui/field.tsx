import type * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "./label";

export function FieldGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return <div className={cn("space-y-4 w-full", className)} {...props} />;
}

export function Field({
  className,
  ...props
}: React.ComponentProps<"div"> & { "data-invalid"?: boolean }) {
  return <div className={cn("space-y-1.5 w-full", className)} {...props} />;
}

export function FieldLabel({
  className,
  required,
  children,
  ...props
}: React.ComponentProps<typeof Label> & { required?: boolean }) {
  return (
    <Label
      className={cn("text-sm font-medium text-foreground", className)}
      {...props}
    >
      {children}
      {required && <span className="ml-1 text-emerald-500">*</span>}
    </Label>
  );
}

export function FieldDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p className={cn("text-xs text-muted-foreground", className)} {...props} />
  );
}

export function FieldError({
  errors,
  className,
}: {
  errors?: unknown[];
  className?: string;
}) {
  if (!errors?.length) return null;
  const err = errors[0];
  const message =
    typeof err === "object" && err !== null && "message" in err
      ? String((err as { message: unknown }).message)
      : String(err);

  return (
    <p className={cn("text-xs font-medium text-red-500 mt-1", className)}>
      {message}
    </p>
  );
}

export function FormField({
  label,
  description,
  error,
  required,
  children,
  className,
}: {
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="ml-1 text-emerald-500">*</span>}
        </Label>
      )}
      {children}
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
}
