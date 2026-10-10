"use client";

import { use } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetAssessmentResult } from "@/hooks";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/ui/status-badge";
import { DifficultyLevel, ProblemType, ITestResult } from "@/types";

export default function AssessmentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: resultData, isLoading } = useGetAssessmentResult(resolvedParams.id);
  const result = resultData?.data;

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["CANDIDATE"]}>
        <div className="py-16 text-center text-muted-foreground">Computing assessment results...</div>
      </RoleGuard>
    );
  }

  if (!result) {
    return (
      <RoleGuard allowedRoles={["CANDIDATE"]}>
        <div className="py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-foreground">Results not available</h2>
          <p className="text-sm text-muted-foreground">
            You must complete and submit the assessment before viewing scorecard results.
          </p>
          <Link href="/dashboard/candidate">
            <Button variant="outline">Back to Candidate Portal</Button>
          </Link>
        </div>
      </RoleGuard>
    );
  }

  const totalScore = result.totalScore ?? 0;
  const maxPossibleScore = result.assessment?.totalMarks ?? result.maxPossibleScore ?? 100;
  const rawPassingMarks = result.assessment?.passingMarks ?? result.assessment?.passingScore ?? 60;
  const passingMarks =
    rawPassingMarks > maxPossibleScore
      ? Math.max(1, Math.round((rawPassingMarks / 100) * maxPossibleScore))
      : rawPassingMarks;
  const isPassed = result.isPassed ?? totalScore >= passingMarks;
  const percentageScore =
    result.percentageScore ?? (maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0);
  const benchmarkPercentage =
    maxPossibleScore > 0 ? Math.min(100, Math.round((passingMarks / maxPossibleScore) * 100)) : 0;

  interface IProblemBreakdownItem {
    problemId: string;
    title: string;
    difficulty: DifficultyLevel | string;
    type?: ProblemType | string;
    score: number;
    maxPoints: number;
    status?: string;
    testCasesPassed?: number;
    totalTestCases?: number;
    submittedCode?: string | null;
    executionTimeMs?: number | null;
  }

  const problemBreakdown: IProblemBreakdownItem[] = (result.submissions || []).map(sub => {
    let testCasesPassed = 0;
    let totalTestCases = 0;
    if (Array.isArray(sub.executionResult)) {
      const results = sub.executionResult as ITestResult[];
      totalTestCases = results.length;
      testCasesPassed = results.filter(tc => tc.passed).length;
    }
    return {
      problemId: sub.problemId,
      title: sub.problem?.title || "Problem",
      difficulty: sub.problem?.difficulty || "MEDIUM",
      type: sub.problem?.problemType || "CODING",
      score: sub.scoreAwarded ?? 0,
      maxPoints: sub.problem?.points ?? 100,
      status: sub.status,
      testCasesPassed,
      totalTestCases,
      submittedCode: sub.submittedCode,
      executionTimeMs: sub.executionTimeMs,
    };
  });

  return (
    <RoleGuard allowedRoles={["CANDIDATE"]}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard/candidate"
            className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Candidate Portal</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Assessment Scorecard</h1>
          <p className="text-sm text-muted-foreground">{result.assessment?.title || "Technical Assessment"}</p>
        </div>

        {/* Outcome Banner */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border ${
            isPassed
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-800 dark:text-red-300"
          }`}
        >
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div
              className={`p-3 rounded-full ${
                isPassed
                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/20 text-red-600 dark:text-red-400"
              }`}
            >
              {isPassed ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {isPassed ? "Assessment Passed" : "Needs Improvement"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Benchmark Cutoff: {passingMarks} pts ({benchmarkPercentage}%) • Your
                Score: {totalScore} pts ({percentageScore}%)
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <p className="text-4xl font-extrabold text-foreground">
              {totalScore} / {maxPossibleScore}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Total Points Scored</p>
          </div>
        </div>

        {/* Problem Breakdown List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Problem Breakdown</h3>

          <div className="space-y-3">
            {problemBreakdown.length === 0 ? (
              <div className="p-6 rounded-xl border border-border bg-card text-center text-muted-foreground text-sm shadow-sm">
                No problem submission details recorded.
              </div>
            ) : (
              problemBreakdown.map((pr, idx) => (
                <div
                  key={pr.problemId || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-border bg-card shadow-sm gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-muted-foreground">#{idx + 1}</span>
                      <h4 className="font-semibold text-foreground">{pr.title}</h4>
                      <DifficultyBadge difficulty={pr.difficulty} />
                      <ProblemTypeBadge type={pr.type || "CODING"} />
                    </div>
                    <div className="flex items-center space-x-4 text-xs font-mono text-muted-foreground">
                      {pr.totalTestCases !== undefined && pr.totalTestCases > 0 && (
                        <span>
                          Passed: {pr.testCasesPassed ?? 0} / {pr.totalTestCases} test cases
                        </span>
                      )}
                      {pr.executionTimeMs !== undefined && pr.executionTimeMs !== null && (
                        <span>Runtime: {pr.executionTimeMs}ms</span>
                      )}
                      {pr.status && <span>Status: {pr.status}</span>}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <p className="text-base font-bold text-foreground">
                      {pr.score} / {pr.maxPoints} pts
                    </p>
                    <p className="text-[11px] text-muted-foreground">
                      {pr.score === pr.maxPoints ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Full Score</span>
                      ) : pr.score > 0 ? (
                        <span className="text-amber-600 dark:text-amber-400 font-semibold">Partial Credit</span>
                      ) : (
                        <span className="text-muted-foreground">0%</span>
                      )}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Link href="/dashboard/candidate">
            <Button variant="emerald">Return to Dashboard</Button>
          </Link>
        </div>
      </div>
    </RoleGuard>
  );
}
