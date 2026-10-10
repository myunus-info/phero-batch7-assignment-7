import { z } from "zod";

export const updateUserStatusOrRoleSchema = z.object({
  role: z.enum(["ADMIN", "RECRUITER", "CANDIDATE"]),
  status: z.enum(["ACTIVE", "BLOCKED"]),
});

export type UpdateUserStatusOrRoleFormData = z.infer<
  typeof updateUserStatusOrRoleSchema
>;
