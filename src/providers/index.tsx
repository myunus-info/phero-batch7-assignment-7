"use client";

import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import GoolgeAuthProvider from "./googleAuthProvider";
import QueryProvider from "./queryProvider";
import { ThemeProvider, useTheme } from "./themeProvider";

function ThemedToaster() {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      richColors
      theme={resolvedTheme}
      closeButton
    />
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark">
      <GoolgeAuthProvider>
        <QueryProvider>
          <TooltipProvider>
            {children}
            <ThemedToaster />
          </TooltipProvider>
        </QueryProvider>
      </GoolgeAuthProvider>
    </ThemeProvider>
  );
}
