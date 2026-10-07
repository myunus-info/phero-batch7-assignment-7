"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { UserManagementTable } from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">User Accounts & Roles</h1>
          <p className="text-sm text-slate-400">
            Search, assign roles, and manage access permissions for all DevJudge accounts.
          </p>
        </div>

        <UserManagementTable />
      </div>
    </RoleGuard>
  );
}
