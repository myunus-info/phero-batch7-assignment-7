"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useGetMe } from "@/hooks/auth.hook";
import { roleSidebarRoutes } from "@/routes";
import Logo from "@/assets/svg/Logo";
import { RoleBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  Code2,
  FileCheck2,
  CreditCard,
  History,
  Award,
  Layers,
  Settings,
  Shield,
  FileText,
  LucideIcon,
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Code2,
  FileCheck2,
  CreditCard,
  History,
  Award,
  Layers,
  Settings,
  Shield,
  FileText,
};

export function DashboardSidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const { data: user } = useGetMe();

  if (!user) return null;

  const sidebarGroups = roleSidebarRoutes[user.role] || [];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-800 bg-slate-950/95">
      {/* Brand */}
      <div className="flex h-16 items-center px-6 border-b border-slate-800">
        <Link href="/" onClick={onCloseMobile} className="flex items-center space-x-2">
          <Logo className="h-7 w-auto" />
          <span className="font-mono text-lg font-bold tracking-tight text-white">
            Dev<span className="text-emerald-400">Judge</span>
          </span>
        </Link>
      </div>

      {/* Role tag */}
      <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Workspace</span>
          <RoleBadge role={user.role} />
        </div>
        <p className="mt-1 text-sm font-medium text-slate-200 truncate">{user.name}</p>
        <p className="text-xs text-slate-500 truncate">{user.email}</p>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sidebarGroups.map((group, idx) => {
          const groupTitle = group.label || group.title;
          return (
            <div key={idx} className="space-y-1">
              {groupTitle && (
                <h4 className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-500">{groupTitle}</h4>
              )}
              <div className="space-y-1 pt-1">
                {group.items.map((item, itemIdx) => {
                  const itemPath = item.url || "#";
                  const itemName = item.title || "Item";
                  const Icon = (typeof item.icon === "string" ? iconMap[item.icon] : item.icon) || FileText;

                  const isActive =
                    pathname === itemPath ||
                    (itemPath !== "/dashboard/admin" &&
                      itemPath !== "/dashboard/recruiter" &&
                      itemPath !== "/dashboard/candidate" &&
                      itemPath !== "#" &&
                      pathname.startsWith(itemPath));

                  return (
                    <Link
                      key={itemPath || itemIdx}
                      href={itemPath}
                      onClick={onCloseMobile}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                        isActive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "text-slate-400 hover:text-slate-200 hover:bg-slate-900",
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className={cn("h-4 w-4", isActive ? "text-emerald-400" : "text-slate-400")} />
                        <span>{itemName}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
