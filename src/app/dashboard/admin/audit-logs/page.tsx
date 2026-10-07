"use client";

import { useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetAuditLogs } from "@/hooks/admin.hook";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { formatDate } from "@/lib/utils";
import { ShieldAlert } from "lucide-react";

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(1);
  const { data: logsData, isLoading } = useGetAuditLogs({
    page,
    limit: 15,
  });

  const logs = logsData?.data || [];
  const meta = logsData?.meta || { total: 0, page: 1, limit: 15 };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
            <ShieldAlert className="h-6 w-6 text-red-500" />
            <span>System Audit Logs</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Immutable record of security events, administrative role updates, and transactions.
          </p>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  Loading audit logs...
                </TableCell>
              </TableRow>
            ) : logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No audit logs recorded yet.
                </TableCell>
              </TableRow>
            ) : (
              logs.map(log => (
                <TableRow key={log.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{formatDate(log.createdAt)}</TableCell>
                  <TableCell className="text-xs font-semibold text-foreground">
                    {log.user ? `${log.user.name} (${log.user.email})` : "System / Anonymous"}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-0.5 rounded bg-muted text-foreground border border-border font-mono text-xs font-medium">
                      {log.action}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-foreground/90 max-w-xs truncate">
                    {typeof log.details === "object" ? JSON.stringify(log.details) : String(log.details || "-")}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {log.ipAddress || "127.0.0.1"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination page={page} total={meta.total} limit={15} onPageChange={setPage} />
      </div>
    </RoleGuard>
  );
}
