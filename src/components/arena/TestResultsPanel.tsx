"use client";

import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { useState } from "react";
import type { ISubmitProblemResponse } from "@/types";

interface TestResultsPanelProps {
  results: ISubmitProblemResponse | null;
  isSubmitting?: boolean;
}

export function TestResultsPanel({
  results,
  isSubmitting,
}: TestResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  if (isSubmitting) {
    return (
      <div className="flex h-48 items-center justify-center border-t border-border bg-card p-6 text-muted-foreground">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-mono">
            Running test cases on remote judge...
          </p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex h-24 items-center justify-center border-t border-border bg-card/80 p-4 text-xs font-mono text-muted-foreground">
        Run code or submit answer to view automated judge execution results.
      </div>
    );
  }

  const score = results.score ?? results.scoreAwarded ?? 0;
  const testResults = results.testResults || [];
  const testCasesPassed =
    results.testCasesPassed ?? testResults.filter((t) => t.passed).length;
  const totalTestCases = results.totalTestCases ?? testResults.length;
  const status = String(results.status || "WRONG_ANSWER");
  const isAccepted = status === "ACCEPTED" || status === "PASSED";

  return (
    <div className="flex flex-col border-t border-border bg-card">
      {/* Header Summary */}
      <div className="flex flex-wrap items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center space-x-3">
          {isAccepted ? (
            <div className="flex items-center space-x-1.5 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-bold tracking-tight">Accepted</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-red-600 dark:text-red-400">
              <XCircle className="h-5 w-5" />
              <span className="text-sm font-bold tracking-tight">
                {status || "Wrong Answer"}
              </span>
            </div>
          )}

          <div className="h-4 w-px bg-border" />

          <span className="text-xs font-mono text-foreground">
            {testCasesPassed} / {totalTestCases} Test Cases Passed
          </span>

          <span className="text-xs font-mono text-muted-foreground">
            Score:{" "}
            <span className="font-semibold text-foreground">{score} pts</span>
          </span>
        </div>
      </div>

      {/* Test Cases Details */}
      {testResults.length > 0 && (
        <div className="p-4 space-y-3">
          {/* Tabs for each test case */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1">
            {testResults.map((tc, idx) => (
              <button
                type="button"
                key={tc.testCaseId || idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  activeTab === idx
                    ? "bg-muted text-foreground border border-border"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {tc.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                )}
                <span>Case #{idx + 1}</span>
              </button>
            ))}
          </div>

          {/* Active Test Case Detail */}
          {testResults[activeTab] && (
            <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-muted-foreground border-b border-border pb-2">
                <span>
                  Status:{" "}
                  <strong
                    className={
                      testResults[activeTab].passed
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }
                  >
                    {testResults[activeTab].passed ? "Passed" : "Failed"}
                  </strong>
                </span>

                <div className="flex items-center space-x-4">
                  {(testResults[activeTab].executionTime ||
                    testResults[activeTab].executionTimeMs) && (
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {testResults[activeTab].executionTime ||
                          testResults[activeTab].executionTimeMs}{" "}
                        ms
                      </span>
                    </span>
                  )}
                  {testResults[activeTab].memory && (
                    <span>{testResults[activeTab].memory} KB</span>
                  )}
                </div>
              </div>

              {testResults[activeTab].input && (
                <div>
                  <span className="text-muted-foreground">Input:</span>
                  <pre className="mt-1 p-2 rounded bg-background text-foreground border border-border overflow-x-auto">
                    {testResults[activeTab].input}
                  </pre>
                </div>
              )}

              {testResults[activeTab].expectedOutput && (
                <div>
                  <span className="text-muted-foreground">
                    Expected Output:
                  </span>
                  <pre className="mt-1 p-2 rounded bg-background text-emerald-600 dark:text-emerald-400 border border-border overflow-x-auto">
                    {testResults[activeTab].expectedOutput}
                  </pre>
                </div>
              )}

              {testResults[activeTab].actualOutput && (
                <div>
                  <span className="text-muted-foreground">Your Output:</span>
                  <pre
                    className={`mt-1 p-2 rounded bg-background border border-border overflow-x-auto ${
                      testResults[activeTab].passed
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {testResults[activeTab].actualOutput}
                  </pre>
                </div>
              )}

              {(testResults[activeTab].errorMessage ||
                testResults[activeTab].error) && (
                <div>
                  <span className="text-red-500 font-semibold">Error:</span>
                  <pre className="mt-1 p-2 rounded bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/20 overflow-x-auto">
                    {testResults[activeTab].errorMessage ||
                      testResults[activeTab].error}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
