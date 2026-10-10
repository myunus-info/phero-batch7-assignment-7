import type { SidebarItems, UserRole } from "@/types";
import { adminRoutes } from "./admin.route";
import { candidateRoutes } from "./candidate.route";
import { recruiterRoutes } from "./recruiter.route";

export * from "./admin.route";
export * from "./candidate.route";
export * from "./recruiter.route";

export const roleSidebarRoutes: Record<UserRole, SidebarItems> = {
  ADMIN: adminRoutes,
  RECRUITER: recruiterRoutes,
  CANDIDATE: candidateRoutes,
};
