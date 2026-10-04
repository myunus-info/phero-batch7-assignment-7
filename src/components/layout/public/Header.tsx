"use client";

import Link from "next/link";
import { useGetMe, useLogout } from "@/hooks/auth.hook";
import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, User } from "lucide-react";

export function PublicHeader() {
  const { data: user, isLoading } = useGetMe();
  const logoutMutation = useLogout();

  const getDashboardHref = () => {
    if (!user) return "/login";
    switch (user.role) {
      case "ADMIN":
        return "/admin";
      case "RECRUITER":
        return "/recruiter";
      case "CANDIDATE":
        return "/candidate";
      default:
        return "/dashboard";
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-auto" />
          <span className="font-mono text-xl font-bold tracking-tight text-white">
            Dev<span className="text-emerald-400">Judge</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <Link href="/problems" className="transition-colors hover:text-emerald-400">
            Problems
          </Link>
          <Link href="/pricing" className="transition-colors hover:text-emerald-400">
            Pricing
          </Link>
          <Link href="/about" className="transition-colors hover:text-emerald-400">
            About
          </Link>
        </nav>

        <div className="flex items-center space-x-3">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-md bg-slate-800" />
          ) : user ? (
            <div className="flex items-center space-x-3">
              <Link href={getDashboardHref()}>
                <Button variant="outline" size="sm" className="gap-2">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
                className="text-slate-400 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="emerald" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
