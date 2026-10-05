import { SidebarItems, UserRole } from "@/types";
import { adminRoutes } from "./admin.route";
import { recruiterRoutes } from "./recruiter.route";
import { candidateRoutes } from "./candidate.route";

export * from "./candidate.route";
export * from "./recruiter.route";
export * from "./admin.route";

export const roleSidebarRoutes: Record<UserRole, SidebarItems> = {
  ADMIN: adminRoutes,
  RECRUITER: recruiterRoutes,
  CANDIDATE: candidateRoutes,
};
