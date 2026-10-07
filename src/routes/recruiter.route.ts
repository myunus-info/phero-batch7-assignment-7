import { SidebarItems } from "@/types";
import { LayoutDashboard, FileCode2, ClipboardList, CreditCard, Building2 } from "lucide-react";

export const recruiterRoutes: SidebarItems = [
  {
    title: "Recruitment",
    items: [
      {
        title: "Overview",
        url: "/dashboard/recruiter",
        icon: LayoutDashboard,
      },
      {
        title: "Problem Studio",
        url: "/dashboard/recruiter/problems",
        icon: FileCode2,
      },
      {
        title: "Assessments",
        url: "/dashboard/recruiter/assessments",
        icon: ClipboardList,
      },
      {
        title: "Company Profile",
        url: "/dashboard/recruiter/profile",
        icon: Building2,
      },
      {
        title: "Credits & Billing",
        url: "/dashboard/recruiter/billing",
        icon: CreditCard,
      },
    ],
  },
];
