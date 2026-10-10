import type { IPaginationParams } from "./api.type";
import type { UserRole, UserStatus } from "./auth.type";

export interface IDashboardStats {
  totalUsers?: number;
  candidateCount?: number;
  recruiterCount?: number;
  totalAssessments?: number;
  completedAttempts?: number;
  totalRevenueInCents?: number;
  overallPassRate?: number | string;
  overview?: {
    totalUsers: number;
    totalCandidates: number;
    totalRecruiters: number;
    totalProblems: number;
    totalAssessments: number;
    totalAttempts: number;
    totalPassedAttempts: number;
    passRate: string;
  };
  revenue?: {
    totalRevenueUSD: number;
    successfulTransactions: number;
  };
}

export interface IAuditLog {
  id: string;
  userId?: string | null;
  action: string;
  entityType?: string;
  entityId?: string | null;
  details?: Record<string, unknown> | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
  } | null;
}

export interface IAdminUserFilters extends IPaginationParams {
  searchTerm?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface IAdminAuditLogFilters extends IPaginationParams {
  action?: string;
  entityType?: string;
}

export interface IUpdateUserStatusOrRolePayload {
  status?: UserStatus;
  role?: UserRole;
}
