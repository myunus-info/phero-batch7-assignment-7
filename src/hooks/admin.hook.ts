"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllUsers,
  getAuditLogs,
  getDashboardStats,
  updateUserStatusOrRole,
} from "@/api/admin.api";
import type {
  IAdminAuditLogFilters,
  IAdminUserFilters,
  IUpdateUserStatusOrRolePayload,
} from "@/types";

export function useGetDashboardStats() {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: getDashboardStats,
    refetchInterval: 30000, // Refresh every 30s
  });
}

export function useGetAllUsers(filters?: IAdminUserFilters) {
  return useQuery({
    queryKey: ["admin-users", filters],
    queryFn: () => getAllUsers(filters),
  });
}

export function useUpdateUserStatusOrRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      userId,
      payload,
    }: {
      id?: string;
      userId?: string;
      payload: IUpdateUserStatusOrRolePayload;
    }) => {
      const targetId = id || userId;
      if (!targetId) {
        throw new Error("User ID is required");
      }
      return updateUserStatusOrRole(targetId, payload);
    },
    onSuccess: (res) => {
      toast.success(res?.message || "User updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message || err?.message || "Failed to update user",
      );
    },
  });
}

export function useGetAuditLogs(filters?: IAdminAuditLogFilters) {
  return useQuery({
    queryKey: ["admin-audit-logs", filters],
    queryFn: () => getAuditLogs(filters),
  });
}
