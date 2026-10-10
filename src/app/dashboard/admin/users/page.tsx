"use client";

import { UserManagementTable } from "@/components/admin/UserTable";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminUsersPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            User Accounts & Roles
          </h1>
          <p className="text-sm text-muted-foreground">
            Search, assign roles, and manage access permissions for all DevJudge
            accounts.
          </p>
        </div>

        <UserManagementTable />
      </div>
    </RoleGuard>
  );
}
