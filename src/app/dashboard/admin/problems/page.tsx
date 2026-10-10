"use client";

import { Edit3, ExternalLink, Plus, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-dialog";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  DifficultyBadge,
  ProblemTypeBadge,
} from "@/components/ui/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { useDebounce, useDeleteProblem, useGetAllProblems } from "@/hooks";
import useUrlParams from "@/hooks/url-params.hook";
import type { DifficultyLevel, ProblemType } from "@/types";

function AdminProblemsContent() {
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
    type: (typeParam as ProblemType) || undefined,
  });

  const deleteMutation = useDeleteProblem();
  const [problemToDelete, setProblemToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  const problems = problemsData?.data || [];
  const meta = problemsData?.meta || { total: 0, page: 1, limit: 10 };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Problem Management
            </h1>
            <p className="text-sm text-muted-foreground">
              Create, update, and manage problems available in candidate
              assessments.
            </p>
          </div>

          <Link href="/dashboard/admin/problems/create">
            <Button variant="emerald" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              <span>Create New Problem</span>
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search problems..."
              className="pl-9"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <Select
            value={difficultyParam}
            onChange={(e) => setParams({ difficulty: e.target.value }, true)}
          >
            <option value="">All Difficulties</option>
            <option value="EASY">Easy</option>
            <option value="MEDIUM">Medium</option>
            <option value="HARD">Hard</option>
          </Select>

          <Select
            value={typeParam}
            onChange={(e) => setParams({ type: e.target.value }, true)}
          >
            <option value="">All Problem Types</option>
            <option value="CODING">Coding (Judge0)</option>
            <option value="MCQ">Multiple Choice</option>
          </Select>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead className="whitespace-nowrap">Type</TableHead>
              <TableHead className="whitespace-nowrap">Difficulty</TableHead>
              <TableHead className="whitespace-nowrap">Points</TableHead>
              <TableHead className="text-right whitespace-nowrap">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Loading problems...
                </TableCell>
              </TableRow>
            ) : problems.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  No problems found.
                </TableCell>
              </TableRow>
            ) : (
              problems.map((problem) => (
                <TableRow key={problem.id}>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-foreground">
                        {problem.title}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {problem.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <ProblemTypeBadge
                      type={problem.type || problem.problemType || "CODING"}
                    />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <DifficultyBadge difficulty={problem.difficulty} />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-foreground font-semibold whitespace-nowrap">
                    {problem.points} pts
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/dashboard/admin/problems/${problem.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="View details"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Link
                        href={`/dashboard/admin/problems/${problem.id}/edit`}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          title="Edit problem"
                        >
                          <Edit3 className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setProblemToDelete({
                            id: problem.id,
                            title: problem.title,
                          })
                        }
                        disabled={deleteMutation.isPending}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-400"
                        title="Delete"
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

        <TablePagination
          page={pageParam}
          total={meta.total}
          limit={10}
          onPageChange={(p) => setParams({ page: p })}
        />

        <DeleteConfirmationModal
          open={!!problemToDelete}
          onOpenChange={(open) => {
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

export default function AdminProblemsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-muted-foreground">
          Loading admin problems...
        </div>
      }
    >
      <AdminProblemsContent />
    </Suspense>
  );
}
