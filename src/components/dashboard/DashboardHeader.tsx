"use client";

import { Coins, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import { getInitials } from "@/lib/utils";

interface DashboardHeaderProps {
  onOpenMobileMenu: () => void;
}

export function DashboardHeader({ onOpenMobileMenu }: DashboardHeaderProps) {
  const { data: user } = useGetMe();
  const logoutMutation = useLogout();

  const profileUrl =
    user?.role === "CANDIDATE"
      ? "/dashboard/candidate/profile"
      : user?.role === "RECRUITER"
        ? "/dashboard/recruiter/profile"
        : undefined;

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-4 sm:px-6 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Recruiter Credits Badge */}
        {user?.role === "RECRUITER" && user.recruiterProfile && (
          <Link href="/dashboard/recruiter/billing">
            <div className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/20 transition-colors cursor-pointer text-xs font-semibold">
              <Coins className="h-3.5 w-3.5" />
              <span>{user.recruiterProfile.credits} Credits</span>
              <span className="text-[10px] text-cyan-700 dark:text-cyan-300 underline ml-1">
                + Add
              </span>
            </div>
          </Link>
        )}

        {/* Theme Toggle */}
        <ThemeToggle />

        {/* User Avatar & Profile Link */}
        {profileUrl ? (
          <Link
            href={profileUrl}
            className="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-border hover:opacity-85 transition-opacity"
            title="Profile Settings"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border text-xs font-bold text-foreground">
              {getInitials(user?.name || "U")}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-foreground truncate max-w-30">
                {user?.name}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize">
                {user?.role.toLowerCase()}
              </p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-border">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted border border-border text-xs font-bold text-foreground">
              {getInitials(user?.name || "U")}
            </div>

            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-foreground truncate max-w-30">
                {user?.name}
              </p>
              <p className="text-[10px] text-muted-foreground capitalize">
                {user?.role.toLowerCase()}
              </p>
            </div>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          title="Log out"
          className="text-muted-foreground hover:text-red-500 p-2 h-8 w-8"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
