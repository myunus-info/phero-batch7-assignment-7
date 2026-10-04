"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useGetMe, useLogout } from "@/hooks";
import { UserRole } from "@/types";
import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut } from "lucide-react";

export default function Header() {
  const publicRoutes = [
    { name: "Home", url: "/" },
    { name: "Problems", url: "/problems" },
    { name: "Pricing", url: "/pricing" },
    { name: "About us", url: "/about" },
  ];

  const dashboardRoutes: Record<UserRole, string> = {
    ADMIN: "/admin",
    RECRUITER: "/recruiter",
    CANDIDATE: "/candidate",
  };

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();
  const queryClient = useQueryClient();

  const role = (data?.role || (data as unknown as { data?: { role: UserRole } })?.data?.role) as UserRole | undefined;

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        toast.success("Logged out successfully");
        queryClient.removeQueries({ queryKey: ["me"] });
      },
      onError: () => {
        toast.error("Logout failed. Something went wrong.");
      },
    });
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
          {publicRoutes.map((route) => (
            <Link key={route.url} href={route.url} className="transition-colors hover:text-emerald-400">
              {route.name}
            </Link>
          ))}

          {role && (
            <Link
              href={dashboardRoutes[role]}
              className="transition-colors hover:text-emerald-400 font-semibold text-emerald-400"
            >
              Dashboard
            </Link>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          {isLoading && <div className="h-9 w-20 animate-pulse rounded-md bg-slate-800" />}

          {!isLoading && !data && (
            <div className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="emerald" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {!isLoading && data && (
            <div className="flex items-center space-x-3">
              {role && (
                <Link href={dashboardRoutes[role]}>
                  <Button variant="outline" size="sm" className="gap-2">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <Button onClick={handleLogout} variant="destructive" size="sm" className="gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export { Header as PublicHeader };
