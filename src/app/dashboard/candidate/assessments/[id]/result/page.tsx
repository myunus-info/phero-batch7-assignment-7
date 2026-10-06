"use client";

import { use } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetAssessmentResult } from "@/hooks/attempt.hook";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/ui/status-badge";

export default function AssessmentResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: resultData, isLoading } = useGetAssessmentResult(resolvedParams.id);
  const result = resultData?.data;

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["CANDIDATE"]}>
        <div className="py-16 text-center text-slate-500">Computing assessment results...</div>
      </RoleGuard>
    );
  }

  if (!result) {
    return (
      <RoleGuard allowedRoles={["CANDIDATE"]}>
        <div className="py-16 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Results not available</h2>
          <p className="text-sm text-slate-400">
            You must complete and submit the assessment before viewing scorecard results.
          </p>
          <Link href="/dashboard/candidate">
            <Button variant="outline">Back to Candidate Portal</Button>
          </Link>
        </div>
      </RoleGuard>
    );
  }

  const isPassed = result.passed;

  return (
    <RoleGuard allowedRoles={["CANDIDATE"]}>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <Link
            href="/dashboard/candidate"
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Candidate Portal</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Assessment Scorecard</h1>
          <p className="text-sm text-slate-400">{result.assessment?.title || "Technical Assessment"}</p>
        </div>

        {/* Outcome Banner */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-between p-6 rounded-2xl border ${
            isPassed
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-red-500/10 border-red-500/30 text-red-300"
          }`}
        >
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div
              className={`p-3 rounded-full ${
                isPassed ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
              }`}
            >
              {isPassed ? <CheckCircle2 className="h-8 w-8" /> : <XCircle className="h-8 w-8" />}
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                {isPassed ? "Assessment Passed" : "Needs Improvement"}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Benchmark Cutoff: {result.assessment?.passingScore}% • Your Score: {result.percentageScore}%
              </p>
            </div>
          </div>

          <div className="text-right font-mono">
            <p className="text-4xl font-extrabold text-white">
              {result.totalScore} / {result.maxPossibleScore}
            </p>
            <p className="text-xs text-slate-400 mt-1">Total Points Scored</p>
          </div>
        </div>

        {/* Problem Breakdown List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Problem Breakdown</h3>

          <div className="space-y-3">
            {result.problemResults?.map((pr, idx) => (
              <div
                key={pr.problemId || idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/40 gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs text-slate-500">#{idx + 1}</span>
                    <h4 className="font-semibold text-white">{pr.title}</h4>
                    <DifficultyBadge difficulty={pr.difficulty} />
                    <ProblemTypeBadge type={pr.type || pr.problemType || "CODING"} />
                  </div>
                  <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
                    <span>
                      Passed: {pr.testCasesPassed || 0} / {pr.totalTestCases || 0} test cases
                    </span>
                    {pr.status && <span>Status: {pr.status}</span>}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <p className="text-base font-bold text-white">
                    {pr.score} / {pr.maxPoints} pts
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {pr.score === pr.maxPoints ? (
                      <span className="text-emerald-400 font-semibold">Full Score</span>
                    ) : pr.score > 0 ? (
                      <span className="text-amber-400 font-semibold">Partial Credit</span>
                    ) : (
                      <span className="text-slate-500">0%</span>
                    )}
                  </p>
                </div>
              </div>
            ))}
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
