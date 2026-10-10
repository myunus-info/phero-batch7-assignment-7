"use client";

import { LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/assets/svg/Logo";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useGetMe, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types";

export default function Header() {
  const pathname = usePathname();

  const routes = [
    { name: "Home", url: "/" },
    { name: "Problems", url: "/problems" },
    { name: "Pricing", url: "/pricing" },
    { name: "About us", url: "/about" },
  ];

  const dashboardRoutes: Record<UserRole, string> = {
    ADMIN: "/dashboard/admin",
    RECRUITER: "/dashboard/recruiter",
    CANDIDATE: "/dashboard/candidate",
  };

  const { data, isLoading } = useGetMe();
  const { mutate: logout } = useLogout();

  const role = (data?.role ||
    (data as unknown as { data?: { role: UserRole } })?.data?.role) as
    | UserRole
    | undefined;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-auto" />
          <span className="font-mono text-xl font-bold tracking-tight text-foreground">
            Dev<span className="text-emerald-500">Judge</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-muted-foreground">
          {routes.map((route) => {
            const itemPath = route.url || "#";
            const itemName = route.name || "Item";

            const isActive =
              pathname === itemPath ||
              (itemPath !== "/" &&
                itemPath !== "/problems" &&
                itemPath !== "/pricing" &&
                itemPath !== "/about" &&
                itemPath !== "#" &&
                pathname.startsWith(itemPath));

            return (
              <Link
                key={route.url}
                href={route.url}
                className={cn(
                  "transition-colors hover:text-emerald-500",
                  isActive
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {itemName}
              </Link>
            );
          })}

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
          <ThemeToggle />

          {isLoading && (
            <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
          )}

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
              <Button
                onClick={handleLogout}
                variant="destructive"
                size="sm"
                className="gap-2"
              >
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
