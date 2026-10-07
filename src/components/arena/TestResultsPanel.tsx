"use client";

import { ISubmitProblemResponse } from "@/types/attempt.type";
import { CheckCircle2, XCircle, Clock, AlertTriangle, Terminal } from "lucide-react";
import { useState } from "react";

interface TestResultsPanelProps {
  results: ISubmitProblemResponse | null;
  isSubmitting?: boolean;
}

export function TestResultsPanel({ results, isSubmitting }: TestResultsPanelProps) {
  const [activeTab, setActiveTab] = useState<number>(0);

  if (isSubmitting) {
    return (
      <div className="flex h-48 items-center justify-center border-t border-slate-800 bg-slate-950 p-6 text-slate-400">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm font-mono">Running test cases on remote judge...</p>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="flex h-24 items-center justify-center border-t border-slate-800 bg-slate-950/80 p-4 text-xs font-mono text-slate-500">
        Run code or submit answer to view automated judge execution results.
      </div>
    );
  }

  const score = results.score ?? results.scoreAwarded ?? 0;
  const testResults = results.testResults || [];
  const testCasesPassed = results.testCasesPassed ?? testResults.filter(t => t.passed).length;
  const totalTestCases = results.totalTestCases ?? testResults.length;
  const status = String(results.status || "WRONG_ANSWER");
  const isAccepted = status === "ACCEPTED" || status === "PASSED";

  return (
    <div className="flex flex-col border-t border-slate-800 bg-slate-950">
      {/* Header Summary */}
      <div className="flex flex-wrap items-center justify-between border-b border-slate-800 px-4 py-3">
        <div className="flex items-center space-x-3">
          {isAccepted ? (
            <div className="flex items-center space-x-1.5 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
              <span className="text-sm font-bold tracking-tight">Accepted</span>
            </div>
          ) : (
            <div className="flex items-center space-x-1.5 text-red-400">
              <XCircle className="h-5 w-5" />
              <span className="text-sm font-bold tracking-tight">{status || "Wrong Answer"}</span>
            </div>
          )}

          <div className="h-4 w-px bg-slate-800" />

          <span className="text-xs font-mono text-slate-300">
            {testCasesPassed} / {totalTestCases} Test Cases Passed
          </span>

          <span className="text-xs font-mono text-slate-400">
            Score: <span className="font-semibold text-white">{score} pts</span>
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
                key={tc.testCaseId || idx}
                onClick={() => setActiveTab(idx)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  activeTab === idx
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                {tc.passed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <XCircle className="h-3.5 w-3.5 text-red-400" />
                )}
                <span>Case #{idx + 1}</span>
              </button>
            ))}
          </div>

          {/* Active Test Case Detail */}
          {testResults[activeTab] && (
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 border-b border-slate-800/80 pb-2">
                <span>
                  Status:{" "}
                  <strong className={testResults[activeTab].passed ? "text-emerald-400" : "text-red-400"}>
                    {testResults[activeTab].passed ? "Passed" : "Failed"}
                  </strong>
                </span>

                <div className="flex items-center space-x-4">
                  {(testResults[activeTab].executionTime || testResults[activeTab].executionTimeMs) && (
                    <span className="flex items-center space-x-1">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{testResults[activeTab].executionTime || testResults[activeTab].executionTimeMs} ms</span>
                    </span>
                  )}
                  {testResults[activeTab].memory && <span>{testResults[activeTab].memory} KB</span>}
                </div>
              </div>

              {testResults[activeTab].input && (
                <div>
                  <span className="text-slate-400">Input:</span>
                  <pre className="mt-1 p-2 rounded bg-slate-950 text-slate-200 border border-slate-800 overflow-x-auto">
                    {testResults[activeTab].input}
                  </pre>
                </div>
              )}

              {testResults[activeTab].expectedOutput && (
                <div>
                  <span className="text-slate-400">Expected Output:</span>
                  <pre className="mt-1 p-2 rounded bg-slate-950 text-emerald-400 border border-slate-800 overflow-x-auto">
                    {testResults[activeTab].expectedOutput}
                  </pre>
                </div>
              )}

              {testResults[activeTab].actualOutput && (
                <div>
                  <span className="text-slate-400">Your Output:</span>
                  <pre
                    className={`mt-1 p-2 rounded bg-slate-950 border border-slate-800 overflow-x-auto ${
                      testResults[activeTab].passed ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {testResults[activeTab].actualOutput}
                  </pre>
                </div>
              )}

              {(testResults[activeTab].errorMessage || testResults[activeTab].error) && (
                <div>
                  <span className="text-red-400 font-semibold">Error:</span>
                  <pre className="mt-1 p-2 rounded bg-red-950/30 text-red-300 border border-red-900/40 overflow-x-auto">
                    {testResults[activeTab].errorMessage || testResults[activeTab].error}
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
