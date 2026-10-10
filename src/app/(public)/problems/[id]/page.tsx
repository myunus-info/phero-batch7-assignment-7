"use client";

import { ArrowLeft, Clock, HardDrive } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";
import {
  DifficultyBadge,
  ProblemTypeBadge,
} from "@/components/ui/status-badge";
import { useGetProblemById } from "@/hooks";

export default function ProblemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: problemData, isLoading } = useGetProblemById(resolvedParams.id);
  const problem = problemData?.data;

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading problem details...
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-foreground">Problem not found</h2>
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
          className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Problem Bank</span>
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <DifficultyBadge difficulty={problem.difficulty} />
          <ProblemTypeBadge
            type={problem.type || problem.problemType || "CODING"}
          />
          <span className="text-xs font-mono text-muted-foreground">
            {problem.points} Points
          </span>
          {problem.timeLimit && (
            <span className="flex items-center space-x-1 text-xs font-mono text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{problem.timeLimit}s Time Limit</span>
            </span>
          )}
          {problem.memoryLimit && (
            <span className="flex items-center space-x-1 text-xs font-mono text-muted-foreground">
              <HardDrive className="h-3 w-3" />
              <span>{problem.memoryLimit}MB Memory</span>
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-foreground mt-3">
          {problem.title}
        </h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 space-y-6 shadow-sm">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Description
          </h3>
          <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {problem.description}
          </p>
        </div>

        {/* Sample Test Cases (if coding) */}
        {problem.testCases &&
          problem.testCases.filter((t) => !t.isHidden).length > 0 && (
            <div className="space-y-4 pt-4 border-t border-border">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Sample Examples
              </h3>
              {problem.testCases
                .filter((tc) => !tc.isHidden)
                .map((tc, idx) => (
                  <div
                    key={tc.id || idx}
                    className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs space-y-2"
                  >
                    <p className="font-semibold text-muted-foreground">
                      Example {idx + 1}:
                    </p>
                    <div>
                      <span className="text-muted-foreground">Input:</span>
                      <pre className="mt-1 p-2 rounded bg-background text-foreground border border-border overflow-x-auto">
                        {tc.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-muted-foreground">
                        Expected Output:
                      </span>
                      <pre className="mt-1 p-2 rounded bg-background text-emerald-600 dark:text-emerald-400 border border-border overflow-x-auto">
                        {tc.expectedOutput}
                      </pre>
                    </div>
                  </div>
                ))}
            </div>
          )}

        {/* MCQ Preview */}
        {problem.options && problem.options.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-border">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Answer Choices ({problem.options.length})
            </h3>
            <div className="space-y-2">
              {problem.options.map((opt, idx) => (
                <div
                  key={opt.id || idx}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border bg-muted/30 text-xs"
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted font-mono font-bold text-muted-foreground border border-border">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-foreground">{opt.text}</span>
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
