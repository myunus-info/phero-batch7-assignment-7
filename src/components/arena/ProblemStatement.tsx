"use client";

import { useState } from "react";
import { IProblem } from "@/types";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/ui/status-badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Terminal, BookOpen, CheckCircle2 } from "lucide-react";

interface ProblemStatementProps {
  problem: IProblem;
}

export function ProblemStatement({ problem }: ProblemStatementProps) {
  const [tab, setTab] = useState("description");

  return (
    <div className="flex h-full flex-col overflow-y-auto p-4 sm:p-6 bg-card text-foreground">
      {/* Title & Metadata */}
      <div className="space-y-3 pb-4 border-b border-border">
        <div className="flex flex-wrap items-center gap-2">
          <DifficultyBadge difficulty={problem.difficulty} />
          <ProblemTypeBadge type={problem.type || problem.problemType || "CODING"} />
          <span className="text-xs font-mono text-muted-foreground">{problem.points} points</span>
          {problem.timeLimit && (
            <span className="text-xs font-mono text-muted-foreground">⏱ {problem.timeLimit}s limit</span>
          )}
        </div>

        <h1 className="text-xl font-bold text-foreground tracking-tight">{problem.title}</h1>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab} className="mt-4 flex-1">
        <TabsList className="mb-4">
          <TabsTrigger value="description" className="gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Description</span>
          </TabsTrigger>
          {problem.testCases && problem.testCases.length > 0 && (
            <TabsTrigger value="examples" className="gap-2">
              <Terminal className="h-4 w-4" />
              <span>Sample Cases ({problem.testCases.filter(t => !t.isHidden).length})</span>
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="description" className="space-y-6">
          {/* Main Description */}
          <div className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 font-sans">
            {problem.description}
          </div>

          {/* Sample Cases Preview */}
          {problem.testCases && problem.testCases.filter(t => !t.isHidden).length > 0 && (
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Sample Test Cases
              </h3>
              {problem.testCases
                .filter(tc => !tc.isHidden)
                .map((tc, idx) => (
                  <div
                    key={tc.id || idx}
                    className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 text-xs font-mono"
                  >
                    <p className="font-semibold text-muted-foreground">Example {idx + 1}:</p>
                    <div>
                      <span className="text-muted-foreground">Input:</span>
                      <pre className="mt-1 p-2 rounded bg-background text-foreground border border-border overflow-x-auto">
                        {tc.input}
                      </pre>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Expected Output:</span>
                      <pre className="mt-1 p-2 rounded bg-background text-emerald-600 dark:text-emerald-400 border border-border overflow-x-auto">
                        {tc.expectedOutput}
                      </pre>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="examples" className="space-y-4">
          {problem.testCases
            ?.filter(tc => !tc.isHidden)
            .map((tc, idx) => (
              <div
                key={tc.id || idx}
                className="rounded-lg border border-border bg-muted/30 p-4 space-y-2 font-mono text-xs"
              >
                <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-semibold">Sample Case #{idx + 1}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Input:</span>
                  <pre className="mt-1 p-2 rounded bg-background text-foreground overflow-x-auto border border-border">
                    {tc.input}
                  </pre>
                </div>
                <div>
                  <span className="text-muted-foreground">Output:</span>
                  <pre className="mt-1 p-2 rounded bg-background text-emerald-600 dark:text-emerald-400 overflow-x-auto border border-border">
                    {tc.expectedOutput}
                  </pre>
                </div>
              </div>
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
