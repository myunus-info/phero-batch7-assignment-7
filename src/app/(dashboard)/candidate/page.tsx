"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetMyCandidateAssessments } from "@/hooks";
import { useGetMe } from "@/hooks/auth.hook";
import { CandidateStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Code2, Clock, Play, CheckCircle2 } from "lucide-react";

export default function CandidateDashboardPage() {
  const { data: user } = useGetMe();
  const { data: assessmentsData, isLoading } = useGetMyCandidateAssessments();

  const candidateAssessments = assessmentsData?.data || [];

  return (
    <RoleGuard allowedRoles={["CANDIDATE"]}>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Candidate Test Portal</h1>
          <p className="text-sm text-slate-400">
            Welcome back, {user?.name}. Complete technical assessments assigned by hiring teams.
          </p>
        </div>

        {/* Assigned Assessments Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white">Your Assessments</h2>

          {isLoading ? (
            <p className="text-sm text-slate-500 py-8 text-center">Loading your assessments...</p>
          ) : candidateAssessments.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-8 text-center space-y-3">
              <Code2 className="h-8 w-8 text-slate-500 mx-auto" />
              <h3 className="text-base font-semibold text-white">No Assigned Assessments</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have no active technical tests. When a recruiter invites your email ({user?.email}), your test will
                appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidateAssessments.map(ca => {
                const assessment = ca.assessment;
                const isCompleted = ca.status === "COMPLETED";
                const isExpired = ca.status === "EXPIRED";

                return (
                  <div
                    key={ca.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/50 p-6 space-y-4"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold uppercase text-slate-400">
                          {assessment?.title || "Assessment"}
                        </span>
                        <CandidateStatusBadge status={ca.status} />
                      </div>

                      <h3 className="text-lg font-bold text-white">{assessment?.title}</h3>

                      <p className="text-xs text-slate-400 line-clamp-2">{assessment?.description}</p>

                      <div className="flex items-center space-x-4 pt-2 text-xs font-mono text-slate-400">
                        <span className="flex items-center space-x-1">
                          <Clock className="h-3.5 w-3.5 text-slate-500" />
                          <span>{assessment?.durationMinutes} min</span>
                        </span>
                        <span>Pass Mark: {assessment?.passingScore}%</span>
                        {ca.score !== undefined && ca.score !== null && (
                          <span className="font-bold text-emerald-400">Score: {ca.score}%</span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                      {isCompleted ? (
                        <Link href={`/candidate/assessments/${ca.assessmentId}/result`}>
                          <Button variant="outline" size="sm" className="gap-2 text-xs">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>View Scorecard</span>
                          </Button>
                        </Link>
                      ) : isExpired ? (
                        <span className="text-xs text-red-400 font-mono">Expired</span>
                      ) : (
                        <Link href={`/arena/${ca.assessmentId}`}>
                          <Button variant="emerald" size="sm" className="gap-2 text-xs">
                            <Play className="h-3.5 w-3.5 fill-current" />
                            <span>{ca.status === "IN_PROGRESS" ? "Resume Assessment" : "Start Assessment"}</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </RoleGuard>
  );
}
