import { TooltipProvider } from "@/components/ui/tooltip";
import GoolgeAuthProvider from "./googleAuthProvider";
import QueryProvider from "./queryProvider";
import { Toaster } from "sonner";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoolgeAuthProvider>
      <QueryProvider>
        <TooltipProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            theme="dark"
            closeButton
            toastOptions={{
              style: {
                background: "#0f172a",
                borderColor: "#334155",
                color: "#f8fafc",
              },
            }}
          />
        </TooltipProvider>
      </QueryProvider>
    </GoolgeAuthProvider>
  );
}
