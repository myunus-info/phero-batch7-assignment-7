"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import useUrlParams from "@/hooks/url-params.hook";
import { useDebounce, useGetAllAssessments, useDeleteAssessment } from "@/hooks";
import { InviteCandidateModal } from "@/components/forms/InviteCandidateModal";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-dialog";
import { Plus, UserPlus, Trash2, Search, ExternalLink, Edit3 } from "lucide-react";
import { formatDate } from "@/lib/utils";

function RecruiterAssessmentsContent() {
  const { getParam, setParams } = useUrlParams();

  const searchParam = getParam("search", "");
  const pageParam = Number(getParam("page", "1")) || 1;

  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [inviteModalData, setInviteModalData] = useState<{
    id: string;
    title: string;
  } | null>(null);

  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      setParams({ search: debouncedSearch }, true);
    }
  }, [debouncedSearch, searchParam, setParams]);

  const { data: assessmentsData, isLoading } = useGetAllAssessments({
    page: pageParam,
    limit: 10,
    searchTerm: searchParam || undefined,
  });

  const deleteMutation = useDeleteAssessment();
  const [assessmentToDelete, setAssessmentToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const assessments = assessmentsData?.data || [];
  const meta = assessmentsData?.meta || { total: 0, page: 1, limit: 10 };

  return (
    <RoleGuard allowedRoles={["RECRUITER"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Assessment Campaigns</h1>
            <p className="text-sm text-muted-foreground">
              Manage custom assessments, review candidate results, and dispatch invitations.
            </p>
          </div>

          <Link href="/dashboard/recruiter/assessments/create">
            <Button variant="emerald" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              <span>New Assessment</span>
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            className="pl-9"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Assessment Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Cutoff</TableHead>
              <TableHead>Candidates</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Loading assessments...
                </TableCell>
              </TableRow>
            ) : assessments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No assessments found. Create your first assessment campaign!
                </TableCell>
              </TableRow>
            ) : (
              assessments.map(a => (
                <TableRow key={a.id}>
                  <TableCell>
                    <Link
                      href={`/dashboard/recruiter/assessments/${a.id}`}
                      className="font-semibold text-foreground hover:text-emerald-500 transition-colors"
                    >
                      {a.title}
                    </Link>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{a.description}</p>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={a.status} />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground">{a.durationMinutes} min</TableCell>
                  <TableCell className="font-mono text-xs text-foreground">{a.passingMarks}%</TableCell>
                  <TableCell className="font-mono text-xs text-cyan-600 dark:text-cyan-400">
                    {a._count?.candidates || 0} invited
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{formatDate(a.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setInviteModalData({ id: a.id, title: a.title })}
                        className="h-8 gap-1 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                        title="Invite candidate"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Invite</span>
                      </Button>
                      <Link href={`/dashboard/recruiter/assessments/${a.id}/edit`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          title="Edit assessment"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/recruiter/assessments/${a.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                          title="View submissions"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setAssessmentToDelete({
                            id: a.id,
                            title: a.title,
                          })
                        }
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-500"
                        title="Delete assessment"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination page={pageParam} total={meta.total} limit={10} onPageChange={p => setParams({ page: p })} />

        {/* Invite Candidate Modal */}
        {inviteModalData && (
          <InviteCandidateModal
            open={Boolean(inviteModalData)}
            onOpenChange={open => !open && setInviteModalData(null)}
            assessmentId={inviteModalData.id}
            assessmentTitle={inviteModalData.title}
          />
        )}

        <DeleteConfirmationModal
          open={!!assessmentToDelete}
          onOpenChange={open => {
            if (!open) setAssessmentToDelete(null);
          }}
          itemType="assessment"
          itemName={assessmentToDelete?.title}
          isLoading={deleteMutation.isPending}
          onConfirm={() => {
            if (assessmentToDelete) {
              deleteMutation.mutate(assessmentToDelete.id, {
                onSuccess: () => {
                  setAssessmentToDelete(null);
                },
              });
            }
          }}
        />
      </div>
    </RoleGuard>
  );
}

export function RecruiterAssessmentsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-muted-foreground">Loading assessments...</div>}>
      <RecruiterAssessmentsContent />
    </Suspense>
  );
}

export default RecruiterAssessmentsPage;
