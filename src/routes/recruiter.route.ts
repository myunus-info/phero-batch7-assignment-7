import { SidebarItems } from "@/types";
import { LayoutDashboard, FileCode2, ClipboardList, CreditCard } from "lucide-react";

export const recruiterRoutes: SidebarItems = [
  {
    title: "Recruitment",
    items: [
      {
        title: "Overview",
        url: "/recruiter",
        icon: LayoutDashboard,
      },
      {
        title: "Problem Studio",
        url: "/recruiter/problems",
        icon: FileCode2,
      },
      {
        title: "Assessments",
        url: "/recruiter/assessments",
        icon: ClipboardList,
      },
      {
        title: "Credits & Billing",
        url: "/recruiter/billing",
        icon: CreditCard,
      },
    ],
  },
];
