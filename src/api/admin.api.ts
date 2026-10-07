import apiClient from "@/lib/apiClient";
import {
  IAdminAuditLogFilters,
  IAdminUserFilters,
  IApiResponse,
  IAuditLog,
  IDashboardStats,
  IUpdateUserStatusOrRolePayload,
  IUserProfile,
} from "@/types";

export function getDashboardStats() {
  return apiClient<IApiResponse<IDashboardStats>>("/admin/dashboard-stats");
}

export function getAllUsers(params?: IAdminUserFilters) {
  return apiClient<IApiResponse<IUserProfile[]>>("/admin/users", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function updateUserStatusOrRole(id: string, payload: IUpdateUserStatusOrRolePayload) {
  return apiClient<IApiResponse<IUserProfile>>(`/admin/users/${id}/status`, {
    method: "PATCH",
    body: payload,
  });
}

export function getAuditLogs(params?: IAdminAuditLogFilters) {
  return apiClient<IApiResponse<IAuditLog[]>>("/admin/audit-logs", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
