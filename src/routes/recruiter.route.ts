import { SidebarItems } from "@/types";
import { LayoutDashboard, FileCode2, ClipboardList, CreditCard, BriefcaseBusiness } from "lucide-react";

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
        title: "Credits & Billing",
        url: "/dashboard/recruiter/billing",
        icon: CreditCard,
      },
      {
        title: "Company Profile",
        url: "/dashboard/recruiter/profile",
        icon: BriefcaseBusiness,
      },
    ],
  },
];
