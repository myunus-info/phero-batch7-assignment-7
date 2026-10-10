"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-background text-foreground transition-colors duration-200">
      <div className="p-4 rounded-full bg-red-500/10 text-red-500 mb-4 border border-red-500/20">
        <AlertTriangle className="h-8 w-8" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {error.message ||
          "An unexpected error occurred while processing your request."}
      </p>

      <Button variant="emerald" onClick={() => reset()} className="gap-2">
        <RotateCcw className="h-4 w-4" />
        <span>Try Again</span>
      </Button>
    </div>
  );
}
