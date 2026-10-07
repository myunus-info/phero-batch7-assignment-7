"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetProblemById, useDeleteProblem } from "@/hooks";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-dialog";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Clock,
  Award,
  Cpu,
  Code2,
  ListChecks,
  CheckCircle2,
  EyeOff,
  Eye,
  FileCode2,
} from "lucide-react";

export default function RecruiterProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
          <div className="h-8 w-40 bg-slate-800 rounded animate-pulse" />
          <div className="h-48 w-full bg-slate-900/60 rounded-xl animate-pulse" />
          <div className="h-64 w-full bg-slate-900/60 rounded-xl animate-pulse" />
        </div>
      </RoleGuard>
    );
  }

  if (!problem) {
    return (
      <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-900/40 rounded-xl border border-slate-800 space-y-4">
          <FileCode2 className="h-12 w-12 text-slate-500" />
          <h2 className="text-xl font-bold text-white">Problem Not Found</h2>
          <p className="text-sm text-slate-400 max-w-md">
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
            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
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
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-white">{problem.title}</h1>
              {problem.slug && <p className="font-mono text-xs text-slate-500">slug: {problem.slug}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <ProblemTypeBadge type={problemType} />
              <DifficultyBadge difficulty={problem.difficulty} />
              <Badge variant="outline" className="font-mono text-emerald-400">
                {problem.points} Points
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-500" /> Time Limit
              </span>
              <p className="text-sm font-medium text-slate-200">{timeLimitDisplay}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Cpu className="h-3.5 w-3.5 text-slate-500" /> Memory Buffer
              </span>
              <p className="text-sm font-medium text-slate-200">
                {problem.memoryLimit ? `${problem.memoryLimit} MB` : "256 MB"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-slate-500" /> Visibility
              </span>
              <p className="text-sm font-medium text-slate-200">
                {problem.isPublic !== false ? "Public Catalog" : "Private Custom"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <FileCode2 className="h-3.5 w-3.5 text-slate-500" /> Created
              </span>
              <p className="text-sm font-medium text-slate-200">
                {problem.createdAt ? formatDate(problem.createdAt) : "Recently"}
              </p>
            </div>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-3">
          <h2 className="text-lg font-semibold text-white">Problem Statement</h2>
          <div className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap font-sans bg-slate-950/40 p-4 rounded-lg border border-slate-850">
            {problem.description}
          </div>
        </div>

        {/* Test Cases for Coding Problems */}
        {problemType === "CODING" && (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <Code2 className="h-5 w-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Test Cases ({problem.testCases?.length || 0})</h2>
            </div>

            {!problem.testCases || problem.testCases.length === 0 ? (
              <p className="text-sm text-slate-400 italic">No automated test cases configured.</p>
            ) : (
              <div className="space-y-3">
                {problem.testCases.map((tc, index) => (
                  <div key={index} className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                        Test Case #{index + 1}
                      </span>
                      {tc.isHidden ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                          <EyeOff className="h-3 w-3" />
                          <span>Hidden Judge Test</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                          <Eye className="h-3 w-3" />
                          <span>Sample Visible Test</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                      <div className="space-y-1">
                        <span className="text-slate-500 font-sans">Input (stdin):</span>
                        <pre className="p-2.5 rounded bg-slate-900 text-slate-200 overflow-x-auto border border-slate-800">
                          {tc.input || "<empty input>"}
                        </pre>
                      </div>

                      <div className="space-y-1">
                        <span className="text-slate-500 font-sans">Expected Output (stdout):</span>
                        <pre className="p-2.5 rounded bg-slate-900 text-emerald-300 overflow-x-auto border border-slate-800">
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
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
            <div className="flex items-center space-x-2">
              <ListChecks className="h-5 w-5 text-cyan-400" />
              <h2 className="text-lg font-semibold text-white">Answer Choices & Solution Key</h2>
            </div>

            {(!problem.mcqOptions && !problem.options) ||
            ((problem.mcqOptions?.length || 0) === 0 && (problem.options?.length || 0) === 0) ? (
              <p className="text-sm text-slate-400 italic">No answer choices configured.</p>
            ) : (
              <div className="space-y-2">
                {(problem.mcqOptions || problem.options || []).map((opt, index) => {
                  const isCorrect =
                    opt.isCorrect || (problem.correctAnswers && problem.correctAnswers.includes(opt.id || opt.text));

                  return (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3.5 rounded-lg border transition-colors ${
                        isCorrect
                          ? "border-emerald-500/50 bg-emerald-950/20 text-emerald-200"
                          : "border-slate-800 bg-slate-950/40 text-slate-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center justify-center h-6 w-6 rounded bg-slate-900 text-xs font-mono font-bold text-slate-400 border border-slate-800">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-sm font-medium">{opt.text}</span>
                      </div>

                      {isCorrect && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Correct Answer</span>
                        </span>
                      )}
                    </div>
                  );
                })}
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
