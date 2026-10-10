"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/providers/themeProvider";

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, toggleTheme, isMounted } = useTheme();

  // Fallback placeholder during SSR to prevent layout shift
  if (!isMounted) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className={`h-9 w-9 p-0 text-muted-foreground ${className || ""}`}
        aria-label="Toggle theme"
      >
        <span className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      className={`relative h-9 w-9 p-0 text-muted-foreground hover:text-foreground rounded-lg transition-colors ${className || ""}`}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="h-4 w-4 text-indigo-500 transition-transform duration-200 hover:-rotate-12" />
      )}
      <span className="sr-only">
        {isDark ? "Switch to light mode" : "Switch to dark mode"}
      </span>
    </Button>
  );
}

export default ThemeToggle;
