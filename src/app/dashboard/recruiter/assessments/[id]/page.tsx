"use client";

import { use, useState } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetAssessmentById } from "@/hooks/assessment.hook";
import { InviteCandidateModal } from "@/components/forms/InviteCandidateModal";
import { StatusBadge, CandidateStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, UserPlus, Clock, Award, CheckCircle2, XCircle } from "lucide-react";

export default function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const { data: assessmentData, isLoading } = useGetAssessmentById(resolvedParams.id);
  const assessment = assessmentData?.data;

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["RECRUITER"]}>
        <div className="py-16 text-center text-slate-500">Loading assessment details...</div>
      </RoleGuard>
    );
  }

  if (!assessment) {
    return (
      <RoleGuard allowedRoles={["RECRUITER"]}>
        <div className="py-16 text-center">
          <h2 className="text-xl font-bold text-white">Assessment not found</h2>
          <Link href="/recruiter/assessments">
            <Button variant="outline" className="mt-4">
              Back to Assessments
            </Button>
          </Link>
        </div>
      </RoleGuard>
    );
  }

  const candidateAssessments = assessment.candidateAssessments || [];
  const completedCandidates = candidateAssessments.filter(c => c.status === "COMPLETED");
  const passedCandidates = completedCandidates.filter(
    c => c.score !== undefined && c.score !== null && c.score >= assessment.passingScore,
  );

  return (
    <RoleGuard allowedRoles={["RECRUITER"]}>
      <div className="space-y-8">
        <div>
          <Link
            href="/recruiter/assessments"
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Assessments</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold tracking-tight text-white">{assessment.title}</h1>
                <StatusBadge status={assessment.status} />
              </div>
              <p className="text-sm text-slate-400 mt-1 max-w-2xl">{assessment.description}</p>
            </div>

            <Button variant="cyan" size="sm" onClick={() => setInviteModalOpen(true)} className="gap-2 shrink-0">
              <UserPlus className="h-4 w-4" />
              <span>Invite Candidate</span>
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
            <span className="text-xs font-semibold uppercase text-slate-400">Duration</span>
            <p className="text-xl font-bold text-white flex items-center space-x-1">
              <Clock className="h-4 w-4 text-emerald-400" />
              <span>{assessment.durationMinutes} min</span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
            <span className="text-xs font-semibold uppercase text-slate-400">Passing Cutoff</span>
            <p className="text-xl font-bold text-white flex items-center space-x-1">
              <Award className="h-4 w-4 text-cyan-400" />
              <span>{assessment.passingScore}%</span>
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
            <span className="text-xs font-semibold uppercase text-slate-400">Invited Candidates</span>
            <p className="text-xl font-bold text-white">{candidateAssessments.length}</p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 space-y-1">
            <span className="text-xs font-semibold uppercase text-slate-400">Passed Candidates</span>
            <p className="text-xl font-bold text-emerald-400">
              {passedCandidates.length} / {completedCandidates.length}
            </p>
          </div>
        </div>

        {/* Candidate Submissions Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Candidate Invitations & Results</h3>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Started At</TableHead>
                <TableHead>Completed At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {candidateAssessments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                    No candidates have been invited yet. Click &ldquo;Invite Candidate&rdquo; above.
                  </TableCell>
                </TableRow>
              ) : (
                candidateAssessments.map(ca => {
                  const isPassed = ca.score !== undefined && ca.score !== null && ca.score >= assessment.passingScore;

                  return (
                    <TableRow key={ca.id}>
                      <TableCell>
                        <p className="font-semibold text-white">
                          {ca.candidate?.name || ca.candidate?.email || "Invited Candidate"}
                        </p>
                        <p className="text-xs text-slate-400">{ca.candidate?.email}</p>
                      </TableCell>
                      <TableCell>
                        <CandidateStatusBadge status={ca.status} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {ca.score !== undefined && ca.score !== null ? (
                          <span className="font-bold text-white">{ca.score}%</span>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {ca.status === "COMPLETED" ? (
                          isPassed ? (
                            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Passed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-red-400">
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Failed</span>
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-slate-500">In Progress</span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">
                        {ca.startedAt ? formatDate(ca.startedAt) : "Not started"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-slate-400">
                        {ca.completedAt ? formatDate(ca.completedAt) : "—"}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>

        {/* Invite Candidate Modal */}
        <InviteCandidateModal
          open={inviteModalOpen}
          onOpenChange={setInviteModalOpen}
          assessmentId={assessment.id}
          assessmentTitle={assessment.title}
        />
      </div>
    </RoleGuard>
  );
}
