"use client";

import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useDebounce } from "@/hooks";
import useUrlParams from "@/hooks/url-params.hook";
import { useGetAllProblems } from "@/hooks/problem.hook";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/ui/status-badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { DifficultyLevel, ProblemType } from "@/types/problem.type";
import { Search, ChevronRight } from "lucide-react";

function ProblemsDirectoryContent() {
  const { getParam, setParams } = useUrlParams();

  const searchParam = getParam("search", "");
  const difficultyParam = getParam("difficulty", "");
  const typeParam = getParam("type", "");
  const pageParam = Number(getParam("page", "1")) || 1;

  const [searchInput, setSearchInput] = useState(searchParam);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Sync debounced search to URL
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

  const problems = problemsData?.data || [];
  const meta = problemsData?.meta || { total: 0, page: 1, limit: 10 };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Problem Bank</h1>
        <p className="text-sm text-slate-400 mt-1">
          Explore coding challenges and conceptual MCQ problems used in DevJudge assessments.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
          <Input
            placeholder="Search problem title..."
            className="pl-9"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        <Select value={difficultyParam} onValueChange={(value) => setParams({ difficulty: value }, true)}>
          <option value="">All Difficulties</option>
          <option value="EASY">Easy</option>
          <option value="MEDIUM">Medium</option>
          <option value="HARD">Hard</option>
        </Select>

        <Select value={typeParam} onValueChange={(value) => setParams({ type: value }, true)}>
          <option value="">All Problem Types</option>
          <option value="CODING">Coding (Judge0)</option>
          <option value="MCQ">Multiple Choice</option>
        </Select>
      </div>

      {/* Problems Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Problem</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Difficulty</TableHead>
            <TableHead>Points</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                Loading problem bank...
              </TableCell>
            </TableRow>
          ) : problems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-10 text-slate-500">
                No problems match your search criteria.
              </TableCell>
            </TableRow>
          ) : (
            problems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell>
                  <Link
                    href={`/problems/${problem.id}`}
                    className="font-medium text-white hover:text-emerald-400 transition-colors"
                  >
                    {problem.title}
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">{problem.description}</p>
                </TableCell>
                <TableCell>
                  <ProblemTypeBadge type={problem.type || problem.problemType || "CODING"} />
                </TableCell>
                <TableCell>
                  <DifficultyBadge difficulty={problem.difficulty} />
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-300">{problem.points} pts</TableCell>
                <TableCell className="text-right">
                  <Link
                    href={`/problems/${problem.id}`}
                    className="inline-flex items-center space-x-1 text-xs text-emerald-400 hover:underline"
                  >
                    <span>View</span>
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <TablePagination page={pageParam} total={meta.total} limit={10} onPageChange={(p) => setParams({ page: p })} />
    </div>
  );
}

export default function ProblemsDirectoryPage() {
  return (
    <Suspense
      fallback={<div className="container mx-auto px-4 py-12 max-w-6xl text-slate-400">Loading problem bank...</div>}
    >
      <ProblemsDirectoryContent />
    </Suspense>
  );
}
