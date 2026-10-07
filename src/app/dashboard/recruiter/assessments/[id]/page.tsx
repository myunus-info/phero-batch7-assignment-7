"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetAssessmentById, useDeleteAssessment } from "@/hooks";
import { InviteCandidateModal } from "@/components/forms/InviteCandidateModal";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-dialog";
import { StatusBadge, CandidateStatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, UserPlus, Clock, Award, CheckCircle2, XCircle, Edit3, Trash2 } from "lucide-react";

export default function AssessmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const { data: assessmentData, isLoading } = useGetAssessmentById(resolvedParams.id);
  const deleteMutation = useDeleteAssessment();
  const assessment = assessmentData?.data;

  const handleDelete = () => {
    if (!assessment) return;
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!assessment) return;
    deleteMutation.mutate(assessment.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        router.push("/dashboard/recruiter/assessments");
      },
    });
  };

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["RECRUITER"]}>
        <div className="py-16 text-center text-muted-foreground">Loading assessment details...</div>
      </RoleGuard>
    );
  }

  if (!assessment) {
    return (
      <RoleGuard allowedRoles={["RECRUITER"]}>
        <div className="py-16 text-center">
          <h2 className="text-xl font-bold text-foreground">Assessment not found</h2>
          <Link href="/dashboard/recruiter/assessments">
            <Button variant="outline" className="mt-4">
              Back to Assessments
            </Button>
          </Link>
        </div>
      </RoleGuard>
    );
  }

  const candidateAssessments = assessment.candidates || assessment.candidateAssessments || [];
  const passingScore = assessment.passingMarks ?? assessment.passingScore ?? 60;
  const totalMarks = assessment.totalMarks ?? 100;

  const completedCandidates = candidateAssessments.filter(c => c.status === "COMPLETED");
  const passedCandidates = completedCandidates.filter(
    c => c.isPassed ?? (c.totalScore ?? c.score ?? 0) >= passingScore,
  );

  return (
    <RoleGuard allowedRoles={["RECRUITER"]}>
      <div className="space-y-8">
        <div>
          <Link
            href="/dashboard/recruiter/assessments"
            className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Assessments</span>
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">{assessment.title}</h1>
                <StatusBadge status={assessment.status} />
              </div>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">{assessment.description}</p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <Link href={`/dashboard/recruiter/assessments/${assessment.id}/edit`}>
                <Button variant="outline" size="sm" className="gap-2">
                  <Edit3 className="h-4 w-4" />
                  <span>Edit Assessment</span>
                </Button>
              </Link>
              <Button variant="cyan" size="sm" onClick={() => setInviteModalOpen(true)} className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span>Invite Candidate</span>
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-1">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Duration</span>
            <p className="text-xl font-bold text-foreground flex items-center space-x-1">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span>{assessment.durationMinutes} min</span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-1">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Passing Cutoff</span>
            <p className="text-xl font-bold text-foreground flex items-center space-x-1">
              <Award className="h-4 w-4 text-cyan-500" />
              <span>{passingScore} pts</span>
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-1">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Invited Candidates</span>
            <p className="text-xl font-bold text-foreground">{candidateAssessments.length}</p>
          </div>

          <div className="rounded-xl border border-border bg-card shadow-sm p-4 space-y-1">
            <span className="text-xs font-semibold uppercase text-muted-foreground">Passed Candidates</span>
            <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
              {passedCandidates.length} / {completedCandidates.length}
            </p>
          </div>
        </div>

        {/* Candidate Submissions Table */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Candidate Invitations & Results</h3>

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
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No candidates have been invited yet. Click &ldquo;Invite Candidate&rdquo; above.
                  </TableCell>
                </TableRow>
              ) : (
                candidateAssessments.map(ca => {
                  const candidateScore = ca.totalScore ?? ca.score;
                  const isPassed =
                    ca.isPassed ??
                    (candidateScore !== undefined && candidateScore !== null && candidateScore >= passingScore);
                  const candidateName = ca.candidate?.name || ca.candidateEmail || "Invited Candidate";
                  const candidateEmail = ca.candidateEmail || ca.candidate?.email || "—";
                  const completedDate = ca.submittedAt || ca.completedAt;

                  return (
                    <TableRow key={ca.id}>
                      <TableCell>
                        <p className="font-semibold text-foreground">{candidateName}</p>
                        <p className="text-xs text-muted-foreground">{candidateEmail}</p>
                      </TableCell>
                      <TableCell>
                        <CandidateStatusBadge status={ca.status} />
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {candidateScore !== undefined && candidateScore !== null ? (
                          <div>
                            <span className="font-bold text-foreground">
                              {candidateScore} / {totalMarks} pts
                            </span>
                            <span className="text-muted-foreground text-[11px] block">
                              {Math.round((candidateScore / totalMarks) * 100)}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {ca.status === "COMPLETED" ? (
                          isPassed ? (
                            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Passed</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center space-x-1 text-xs font-semibold text-red-600 dark:text-red-400">
                              <XCircle className="h-3.5 w-3.5" />
                              <span>Failed</span>
                            </span>
                          )
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            {ca.status === "IN_PROGRESS" ? "In Progress" : "Invited"}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {ca.startedAt ? formatDate(ca.startedAt) : "Not started"}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {completedDate ? formatDate(completedDate) : "—"}
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

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          itemType="assessment"
          itemName={assessment?.title}
          isLoading={deleteMutation.isPending}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </RoleGuard>
  );
}
