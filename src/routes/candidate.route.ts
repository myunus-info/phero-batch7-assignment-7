import { SidebarItems } from "@/types";
import { LayoutDashboard, UserCheck } from "lucide-react";

export const candidateRoutes: SidebarItems = [
  {
    title: "Candidate Space",
    items: [
      {
        title: "My Assessments",
        url: "/candidate",
        icon: LayoutDashboard,
      },
      {
        title: "Profile & Skills",
        url: "/candidate/profile",
        icon: UserCheck,
      },
    ],
  },
];
