"use client";

import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Edit3,
  Eye,
  EyeOff,
  FileCode2,
  ListChecks,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-dialog";
import {
  DifficultyBadge,
  ProblemTypeBadge,
} from "@/components/ui/status-badge";
import { useDeleteProblem, useGetProblemById } from "@/hooks";
import { formatDate } from "@/lib/utils";

export default function RecruiterProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const { data: problemData, isLoading } = useGetProblemById(resolvedParams.id);
  const deleteMutation = useDeleteProblem();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const problem = problemData?.data;

  const handleDelete = () => {
    if (!problem) return;
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!problem) return;
    deleteMutation.mutate(problem.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        router.push("/dashboard/recruiter/problems");
      },
    });
  };

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
        <div className="space-y-6 max-w-4xl">
          <div className="h-8 w-40 bg-muted rounded animate-pulse" />
          <div className="h-48 w-full bg-muted rounded-xl animate-pulse" />
          <div className="h-64 w-full bg-muted rounded-xl animate-pulse" />
        </div>
      </RoleGuard>
    );
  }

  if (!problem) {
    return (
      <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-card rounded-xl border border-border shadow-sm space-y-4">
          <FileCode2 className="h-12 w-12 text-muted-foreground" />
          <h2 className="text-xl font-bold text-foreground">
            Problem Not Found
          </h2>
          <p className="text-sm text-muted-foreground max-w-md">
            The problem you are looking for does not exist or has been removed.
          </p>
          <Link href="/dashboard/recruiter/problems">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Problem Studio</span>
            </Button>
          </Link>
        </div>
      </RoleGuard>
    );
  }

  const problemType = problem.problemType || problem.type || "CODING";
  const timeLimitDisplay = problem.timeLimitSeconds
    ? `${Math.round(problem.timeLimitSeconds / 60)} min (${problem.timeLimitSeconds}s)`
    : problem.timeLimit
      ? `${problem.timeLimit} min`
      : "300s";

  return (
    <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
      <div className="space-y-6 max-w-4xl">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link href="/dashboard/recruiter/problems">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Studio</span>
            </Button>
          </Link>

          <div className="flex items-center space-x-2">
            <Link href={`/dashboard/recruiter/problems/${problem.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit3 className="h-4 w-4" />
                <span>Edit Problem</span>
              </Button>
            </Link>

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

        {/* Problem Title & Meta Header Card */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {problem.title}
              </h1>
              {problem.slug && (
                <p className="font-mono text-xs text-muted-foreground">
                  slug: {problem.slug}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ProblemTypeBadge type={problemType} />
              <DifficultyBadge difficulty={problem.difficulty} />
              <Badge
                variant="outline"
                className="font-mono text-emerald-600 dark:text-emerald-400"
              >
                {problem.points} Points
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Time
                Limit
              </span>
              <p className="text-sm font-medium text-foreground">
                {timeLimitDisplay}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-muted-foreground" /> Memory
                Buffer
              </span>
              <p className="text-sm font-medium text-foreground">
                {problem.memoryLimit ? `${problem.memoryLimit} MB` : "256 MB"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                Visibility
              </span>
              <p className="text-sm font-medium text-foreground">
                {problem.isPublic !== false
                  ? "Public Catalog"
                  : "Private Custom"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-muted-foreground flex items-center gap-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-muted-foreground" />{" "}
                Created
              </span>
              <p className="text-sm font-medium text-foreground">
                {problem.createdAt ? formatDate(problem.createdAt) : "Recently"}
              </p>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            Problem Statement
          </h2>
          <div className="text-sm leading-relaxed text-foreground whitespace-pre-wrap font-sans bg-muted/40 p-4 rounded-lg border border-border">
            {problem.description}
          </div>
        </div>

        {/* Test Cases for Coding Problems */}
        {problemType === "CODING" && (
          <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Code2 className="h-5 w-5 text-emerald-500" />
              <h2 className="text-lg font-semibold text-foreground">
                Test Cases ({problem.testCases?.length || 0})
              </h2>
            </div>

            {!problem.testCases || problem.testCases.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                No automated test cases configured.
              </p>
            ) : (
              <div className="space-y-3">
                {problem.testCases.map((tc, index) => (
                  <div
                    key={tc.id || `${tc.input}-${tc.expectedOutput}`}
                    className="p-4 rounded-lg border border-border bg-muted/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
                        Test Case #{index + 1}
                      </span>
                      {tc.isHidden ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          <EyeOff className="h-3 w-3" />
                          <span>Hidden Judge Test</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          <Eye className="h-3 w-3" />
                          <span>Sample Visible Test</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="space-y-1">
                        <span className="text-muted-foreground font-sans">
                          Input (stdin):
                        </span>
                        <pre className="p-2.5 rounded bg-background text-foreground overflow-x-auto border border-border">
                          {tc.input || "<empty input>"}
                        </pre>
                      </div>

                      <div className="space-y-1">
                        <span className="text-muted-foreground font-sans">
                          Expected Output (stdout):
                        </span>
                        <pre className="p-2.5 rounded bg-background text-emerald-600 dark:text-emerald-300 overflow-x-auto border border-border">
                          {tc.expectedOutput || "<empty output>"}
                        </pre>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* MCQ Options for MCQ Problems */}
        {problemType === "MCQ" && (
          <div className="rounded-xl border border-border bg-card shadow-sm p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <ListChecks className="h-5 w-5 text-cyan-500" />
              <h2 className="text-lg font-semibold text-foreground">
                Answer Choices & Solution Key
              </h2>
            </div>

            {(!problem.mcqOptions && !problem.options) ||
            ((problem.mcqOptions?.length || 0) === 0 &&
              (problem.options?.length || 0) === 0) ? (
              <p className="text-sm text-muted-foreground italic">
                No answer choices configured.
              </p>
            ) : (
              <div className="space-y-2">
                {(problem.mcqOptions || problem.options || []).map(
                  (opt, index) => {
                    const isCorrect =
                      opt.isCorrect ||
                      problem.correctAnswers?.includes(opt.id || opt.text);

                    return (
                      <div
                        key={opt.id || opt.text}
                        className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors ${
                          isCorrect
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200"
                            : "border-border bg-muted/30 text-foreground"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="flex items-center justify-center h-6 w-6 rounded bg-muted text-xs font-mono font-bold text-muted-foreground border border-border">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span className="text-sm font-medium">
                            {opt.text}
                          </span>
                        </div>

                        {isCorrect && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            <span>Correct Answer</span>
                          </span>
                        )}
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </div>
        )}

        <DeleteConfirmationModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          itemType="problem"
          itemName={problem?.title}
          isLoading={deleteMutation.isPending}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </RoleGuard>
  );
}
