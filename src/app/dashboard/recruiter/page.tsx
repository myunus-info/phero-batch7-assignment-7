"use client";

import {
  ArrowRight,
  Clock,
  Coins,
  FileCheck2,
  Plus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { useGetAllAssessments, useGetMe } from "@/hooks";

export default function RecruiterDashboardPage() {
  const { data: user } = useGetMe();
  const { data: assessmentsData, isLoading } = useGetAllAssessments({
    limit: 5,
  });

  const assessments = assessmentsData?.data || [];
  const credits = user?.recruiterProfile?.credits || 0;

  return (
    <RoleGuard allowedRoles={["RECRUITER"]}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Recruiter Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {user?.name}. Monitor active technical assessments
              and invitations.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/dashboard/recruiter/assessments/create">
              <Button variant="emerald" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Assessment</span>
              </Button>
            </Link>
            <Link href="/dashboard/recruiter/billing">
              <Button variant="cyan" size="sm" className="gap-2">
                <Coins className="h-4 w-4" />
                <span>Buy Credits</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Credit Balance
              </span>
              <Coins className="h-4 w-4 text-cyan-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {credits} Credits
            </p>
            <p className="text-xs text-muted-foreground">
              1 credit = 1 candidate assessment invite
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Total Assessments
              </span>
              <FileCheck2 className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-bold text-foreground">
              {assessmentsData?.meta?.total || 0}
            </p>
            <p className="text-xs text-muted-foreground">
              Configured technical screens
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 space-y-2 shadow-sm transition-colors duration-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Company Workspace
              </span>
              <Users className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-bold text-foreground truncate">
              {user?.recruiterProfile?.companyName || "Organization"}
            </p>
            <p className="text-xs text-muted-foreground">
              Active hiring portal
            </p>
          </div>
        </div>

        {/* Recent Assessments Section */}
        <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm transition-colors duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              Active Assessments
            </h3>
            <Link
              href="/dashboard/recruiter/assessments"
              className="text-xs font-medium text-emerald-500 hover:underline flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Loading assessments...
            </p>
          ) : assessments.length === 0 ? (
            <div className="text-center py-8 space-y-3">
              <p className="text-sm text-muted-foreground">
                No assessments created yet.
              </p>
              <Link href="/dashboard/recruiter/assessments/create">
                <Button variant="emerald" size="sm">
                  Create Your First Assessment
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {assessments.map((a) => (
                <div
                  key={a.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-muted/30 gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/dashboard/recruiter/assessments/${a.id}`}
                        className="font-semibold text-foreground hover:text-emerald-500 transition-colors"
                      >
                        {a.title}
                      </Link>
                      <StatusBadge status={a.status} />
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{a.durationMinutes} min</span>
                      </span>
                      <span>
                        Passing Score:{" "}
                        {a.totalMarks && a.passingMarks
                          ? Math.round((a.passingMarks / a.totalMarks) * 100)
                          : a.passingMarks || 70}
                        %
                      </span>
                      <span>
                        {a._count?.problems ??
                          a.problems?.length ??
                          a.assessmentProblems?.length ??
                          0}{" "}
                        Problems
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/recruiter/assessments/${a.id}`}>
                      <Button variant="outline" size="sm" className="text-xs">
                        Submissions ({(() => {
                          const candidateList =
                            a.candidates || a.candidateAssessments || [];
                          const completed = candidateList.filter(
                            (c: { status?: string }) =>
                              c.status === "COMPLETED",
                          ).length;
                          return completed > 0
                            ? completed
                            : (a._count?.candidates ?? candidateList.length);
                        })()})
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
