"use client";

import { Award, CheckCircle2, ChevronLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  DifficultyBadge,
  ProblemTypeBadge,
} from "@/components/ui/status-badge";
import type { IProblem } from "@/types";

export interface StepReviewValues {
  title: string;
  description: string;
  durationMinutes: number;
  passingMarks: number;
  selectedProblemIds: string[];
}

export interface StepReviewProps {
  values: StepReviewValues;
  problems: IProblem[];
  isEditing?: boolean;
  isSubmitting?: boolean;
  onBack: () => void;
  onPublish: () => void;
}

export function StepReview({
  values,
  problems,
  isEditing = false,
  isSubmitting = false,
  onBack,
  onPublish,
}: StepReviewProps) {
  const selectedProblems = problems.filter((p) =>
    values.selectedProblemIds?.includes(p.id),
  );
  const totalPoints = selectedProblems.reduce((sum, p) => sum + p.points, 0);

  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">
        Review Assessment
      </h2>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Duration
          </span>
          <p className="text-lg font-bold text-foreground flex items-center space-x-1">
            <Clock className="h-4 w-4 text-emerald-500" />
            <span>{values.durationMinutes} Minutes</span>
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Passing Cutoff
          </span>
          <p className="text-lg font-bold text-foreground flex items-center space-x-1">
            <Award className="h-4 w-4 text-cyan-500" />
            <span>
              {values.passingMarks}% (
              {Math.max(
                1,
                Math.round((values.passingMarks / 100) * totalPoints),
              )}{" "}
              pts)
            </span>
          </p>
        </div>

        <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Total Value
          </span>
          <p className="text-lg font-bold text-emerald-500 font-mono">
            {totalPoints} Points
          </p>
        </div>
      </div>

      {/* Selected Problems List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Selected Problems ({selectedProblems.length})
        </h3>
        <div className="space-y-2">
          {selectedProblems.map((p, idx) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/40 text-xs"
            >
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <span className="font-mono text-muted-foreground">
                  #{idx + 1}
                </span>
                <span className="font-semibold text-foreground">{p.title}</span>
                <DifficultyBadge difficulty={p.difficulty} />
                <ProblemTypeBadge type={p.type || p.problemType || "CODING"} />
              </div>
              <span className="font-mono text-foreground font-bold whitespace-nowrap">
                {p.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-border">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <Button
          variant="emerald"
          onClick={onPublish}
          disabled={isSubmitting}
          className="gap-2 disabled:cursor-not-allowed disabled:pointer-events-auto"
        >
          {isSubmitting ? (
            <>
              <Spinner size="sm" />{" "}
              <span>{isEditing ? "Updating..." : "Publishing..."}</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {isEditing ? "Update Assessment" : "Publish Assessment"}
              </span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

export default StepReview;
