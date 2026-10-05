"use client";

import { useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#090d16]">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:shrink-0">
        <DashboardSidebar />
      </div>

      {/* Mobile Sidebar in Sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen} side="left">
        <div className="h-full -m-6">
          <DashboardSidebar onCloseMobile={() => setMobileOpen(false)} />
        </div>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader onOpenMobileMenu={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
