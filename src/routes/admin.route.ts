import { SidebarItems } from "@/types";
import { LayoutDashboard, Users, History } from "lucide-react";

export const adminRoutes: SidebarItems = [
  {
    title: "Platform Overview",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard,
      },
      {
        title: "User Management",
        url: "/admin/users",
        icon: Users,
      },
      {
        title: "Audit Logs",
        url: "/admin/audit-logs",
        icon: History,
      },
    ],
  },
];
