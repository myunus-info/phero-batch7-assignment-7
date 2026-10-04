"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle2, Terminal } from "lucide-react";

export function LiveJudgeDemo() {
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  const sampleCode = `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) return [map.get(diff), i];
    map.set(nums[i], i);
  }
  return [];
}`;

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 800);
  };

  return (
    <div className="py-16 bg-slate-900/30 border-y border-slate-800">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Experience the Automated Code Judge</h2>
          <p className="text-sm text-slate-400 mt-2">
            Candidates execute their algorithms against real-time containerized test runners.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950 shadow-2xl">
          {/* Mock Window Header */}
          <div className="flex h-10 items-center justify-between border-b border-slate-800 bg-slate-900 px-4">
            <div className="flex items-center space-x-2">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-slate-400">two_sum_solution.js</span>
            </div>

            <Button
              variant="emerald"
              size="sm"
              onClick={handleRun}
              isLoading={isRunning}
              className="h-7 text-xs gap-1.5"
            >
              <Play className="h-3 w-3 fill-current" />
              <span>Simulate Run</span>
            </Button>
          </div>

          {/* Code Body */}
          <div className="p-4 font-mono text-xs leading-relaxed text-slate-300 bg-slate-950 overflow-x-auto">
            <pre>{sampleCode}</pre>
          </div>

          {/* Test Case Output */}
          <div className="border-t border-slate-800 bg-slate-900/90 p-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <div className="flex items-center space-x-2 text-slate-400">
                <Terminal className="h-3.5 w-3.5 text-slate-500" />
                <span>Test Execution Verdict:</span>
              </div>
              {hasRun ? (
                <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>ACCEPTED • 3/3 Test Cases Passed (42ms)</span>
                </div>
              ) : (
                <span className="text-slate-500">Click &ldquo;Simulate Run&rdquo; to test</span>
              )}
            </div>

            {hasRun && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px]">
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                  Case 1: nums=[2,7,11,15], target=9 → [0,1] ✓
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                  Case 2: nums=[3,2,4], target=6 → [1,2] ✓
                </div>
                <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-300">
                  Case 3: nums=[3,3], target=6 → [0,1] ✓
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
