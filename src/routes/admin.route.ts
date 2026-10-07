import { SidebarItems } from "@/types";
import { LayoutDashboard, Users, History, Code } from "lucide-react";

export const adminRoutes: SidebarItems = [
  {
    title: "Platform Overview",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard/admin",
        icon: LayoutDashboard,
      },
      {
        title: "User Management",
        url: "/dashboard/admin/users",
        icon: Users,
      },
      {
        title: "Coding Problems",
        url: "/dashboard/admin/problems",
        icon: Code,
      },
      {
        title: "Audit Logs",
        url: "/dashboard/admin/audit-logs",
        icon: History,
      },
    ],
  },
];
