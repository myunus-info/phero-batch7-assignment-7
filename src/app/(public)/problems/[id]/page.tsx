"use client";

import { use } from "react";
import Link from "next/link";
import { useGetProblemById } from "@/hooks/problem.hook";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, HardDrive } from "lucide-react";

export default function ProblemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: problemData, isLoading } = useGetProblemById(resolvedParams.id);
  const problem = problemData?.data;

  if (isLoading) {
    return <div className="container mx-auto px-4 py-16 text-center text-slate-500">Loading problem details...</div>;
  }

  if (!problem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-white">Problem not found</h2>
        <Link href="/problems">
          <Button variant="outline" className="mt-4">
            Back to Problem Bank
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl space-y-8">
      <div>
        <Link
          href="/problems"
          className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Problem Bank</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <DifficultyBadge difficulty={problem.difficulty} />
          <ProblemTypeBadge type={problem.type || problem.problemType || "CODING"} />
          <span className="text-xs font-mono text-slate-400">{problem.points} Points</span>
          {problem.timeLimit && (
            <span className="flex items-center space-x-1 text-xs font-mono text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{problem.timeLimit}s Time Limit</span>
            </span>
          )}
          {problem.memoryLimit && (
            <span className="flex items-center space-x-1 text-xs font-mono text-slate-400">
              <HardDrive className="h-3 w-3" />
              <span>{problem.memoryLimit}MB Memory</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-white mt-3">{problem.title}</h1>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-6">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">Description</h3>
          <p className="text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">{problem.description}</p>
        </div>

        {/* Sample Test Cases (if coding) */}
        {problem.testCases && problem.testCases.filter((t) => !t.isHidden).length > 0 && (
          <div className="space-y-4 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">Sample Examples</h3>
            {problem.testCases
              .filter((tc) => !tc.isHidden)
              .map((tc, idx) => (
                <div
                  key={tc.id || idx}
                  className="rounded-lg border border-slate-800 bg-slate-950 p-4 font-mono text-xs space-y-2"
                >
                  <p className="font-semibold text-slate-400">Example {idx + 1}:</p>
                  <div>
                    <span className="text-slate-500">Input:</span>
                    <pre className="mt-1 p-2 rounded bg-slate-900 text-slate-200 overflow-x-auto">{tc.input}</pre>
                  </div>
                  <div>
                    <span className="text-slate-500">Expected Output:</span>
                    <pre className="mt-1 p-2 rounded bg-slate-900 text-emerald-400 overflow-x-auto">
                      {tc.expectedOutput}
                    </pre>
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* MCQ Preview */}
        {problem.options && problem.options.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
              Answer Choices ({problem.options.length})
            </h3>
            <div className="space-y-2">
              {problem.options.map((opt, idx) => (
                <div
                  key={opt.id || idx}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-slate-800 bg-slate-950 text-xs"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-800 font-mono font-bold text-slate-400">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-slate-200">{opt.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pt-4 flex justify-between">
        <Link href="/register">
          <Button variant="emerald">Create Assessment with this Problem</Button>
        </Link>
      </div>
    </div>
  );
}
