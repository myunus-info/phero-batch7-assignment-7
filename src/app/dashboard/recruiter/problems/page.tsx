"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import useUrlParams from "@/hooks/url-params.hook";
import useDebounce from "@/hooks/debounce.hook";
import { useGetAllProblems, useDeleteProblem } from "@/hooks/problem.hook";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { DifficultyLevel, ProblemType } from "@/types/problem.type";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-dialog";
import { Plus, Search, Trash2, Edit3, Eye, FileCode2 } from "lucide-react";

function RecruiterProblemsContent() {
  const { getParam, setParams } = useUrlParams();

  const searchParam = getParam("search", "");
  const difficultyParam = getParam("difficulty", "");
  const typeParam = getParam("type", "");
  const pageParam = Number(getParam("page", "1")) || 1;

  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== searchParam) {
      setParams({ search: debouncedSearch }, true);
    }
  }, [debouncedSearch, searchParam, setParams]);

  const { data: problemsData, isLoading } = useGetAllProblems({
    page: pageParam,
    limit: 10,
    searchTerm: searchParam || undefined,
    difficulty: (difficultyParam as DifficultyLevel) || undefined,
    problemType: (typeParam as ProblemType) || undefined,
  });

  const deleteMutation = useDeleteProblem();
  const [problemToDelete, setProblemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const problems = problemsData?.data || [];
  const meta = problemsData?.meta || { total: 0, page: 1, limit: 10 };

  return (
    <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <FileCode2 className="h-6 w-6 text-emerald-400" />
              <span>Problem Studio</span>
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Create, curate, and customize coding challenges and MCQs for your candidate assessments.
            </p>
          </div>

          <Link href="/dashboard/recruiter/problems/create">
            <Button variant="emerald" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Create Problem</span>
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Search problems by title, keywords..."
              className="pl-9 bg-slate-900/60 border-slate-800"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>

          <Select value={difficultyParam} onValueChange={value => setParams({ difficulty: value }, true)}>
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </Select>

          <Select value={typeParam} onValueChange={value => setParams({ type: value }, true)}>
            <option value="">All Types</option>
            <option value="CODING">Coding (Executable)</option>
            <option value="MCQ">Multiple Choice</option>
          </Select>
        </div>

        {/* Problems Table */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="text-slate-400">Problem Title</TableHead>
                <TableHead className="text-slate-400">Type</TableHead>
                <TableHead className="text-slate-400">Difficulty</TableHead>
                <TableHead className="text-slate-400">Points</TableHead>
                <TableHead className="text-slate-400">Time Limit</TableHead>
                <TableHead className="text-right text-slate-400">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-slate-800/60">
                    <TableCell colSpan={6} className="h-14 animate-pulse bg-slate-900/30" />
                  </TableRow>
                ))
              ) : problems.length === 0 ? (
                <TableRow className="border-slate-800">
                  <TableCell colSpan={6} className="h-40 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <FileCode2 className="h-8 w-8 text-slate-600" />
                      <p className="font-medium text-slate-300">No problems found</p>
                      <p className="text-xs text-slate-500">
                        Try adjusting your filters or create a new problem to start testing candidates.
                      </p>
                      <Link href="/dashboard/recruiter/problems/create" className="pt-2">
                        <Button variant="emerald" size="sm" className="gap-2">
                          <Plus className="h-4 w-4" />
                          <span>Create Your First Problem</span>
                        </Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                problems.map(problem => (
                  <TableRow key={problem.id} className="border-slate-800/60 hover:bg-slate-800/40 transition-colors">
                    <TableCell className="font-medium text-white max-w-xs truncate">
                      <div>
                        <Link
                          href={`/dashboard/recruiter/problems/${problem.id}`}
                          className="hover:text-emerald-400 transition-colors font-semibold"
                        >
                          {problem.title}
                        </Link>
                        <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{problem.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <ProblemTypeBadge type={problem.problemType || problem.type || "CODING"} />
                    </TableCell>
                    <TableCell>
                      <DifficultyBadge difficulty={problem.difficulty} />
                    </TableCell>
                    <TableCell className="font-mono text-xs text-emerald-400 font-semibold">
                      {problem.points} pts
                    </TableCell>
                    <TableCell className="font-mono text-xs text-slate-400">
                      {problem.timeLimitSeconds
                        ? `${Math.round(problem.timeLimitSeconds / 60)} min`
                        : problem.timeLimit
                          ? `${problem.timeLimit} min`
                          : "300s"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link href={`/dashboard/recruiter/problems/${problem.id}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                            title="View Problem Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Link href={`/dashboard/recruiter/problems/${problem.id}/edit`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-slate-400 hover:text-cyan-400"
                            title="Edit Problem"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-red-400"
                          onClick={() =>
                            setProblemToDelete({
                              id: problem.id,
                              title: problem.title,
                            })
                          }
                          disabled={deleteMutation.isPending}
                          title="Delete Problem"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {meta.total > 0 && (
            <TablePagination
              page={meta.page}
              limit={meta.limit}
              total={meta.total}
              onPageChange={p => setParams({ page: p })}
            />
          )}
        </div>

        <DeleteConfirmationModal
          open={!!problemToDelete}
          onOpenChange={open => {
            if (!open) setProblemToDelete(null);
          }}
          itemType="problem"
          itemName={problemToDelete?.title}
          isLoading={deleteMutation.isPending}
          onConfirm={() => {
            if (problemToDelete) {
              deleteMutation.mutate(problemToDelete.id, {
                onSuccess: () => {
                  setProblemToDelete(null);
                },
              });
            }
          }}
        />
      </div>
    </RoleGuard>
  );
}

export default function RecruiterProblemsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="h-10 w-48 bg-slate-800 rounded" />
          <div className="h-10 w-full bg-slate-900 rounded-xl" />
          <div className="h-64 w-full bg-slate-900/60 rounded-xl" />
        </div>
      }
    >
      <RecruiterProblemsContent />
    </Suspense>
  );
}
