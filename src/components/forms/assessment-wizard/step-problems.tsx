"use client";

import { useState } from "react";
import { IProblem } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/ui/status-badge";
import { Check, ChevronRight, ChevronLeft, Search } from "lucide-react";

export interface StepProblemsProps {
  form: any;
  problems: IProblem[];
  isLoadingProblems: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function StepProblems({ form, problems, isLoadingProblems, onBack, onNext }: StepProblemsProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProblems = problems.filter(p => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return p.title.toLowerCase().includes(term) || (p.description && p.description.toLowerCase().includes(term));
  });

  return (
    <form.Field name="selectedProblemIds">
      {(field: any) => {
        const selectedProblemIds: string[] = field.state.value || [];
        const selectedProblems = problems.filter(p => selectedProblemIds.includes(p.id));
        const totalPoints = selectedProblems.reduce((sum, p) => sum + p.points, 0);

        const toggleProblem = (id: string) => {
          if (selectedProblemIds.includes(id)) {
            field.handleChange(selectedProblemIds.filter(pId => pId !== id));
          } else {
            field.handleChange([...selectedProblemIds, id]);
          }
        };

        return (
          <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Choose Problems ({selectedProblemIds.length} Selected)
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Total Assessment Points: <strong className="text-emerald-500 font-mono">{totalPoints} pts</strong>
                </p>
              </div>

              {/* Search Filter */}
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Filter problems..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
              {isLoadingProblems ? (
                <p className="text-sm text-muted-foreground py-8 text-center">Loading problem bank...</p>
              ) : filteredProblems.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  {searchTerm
                    ? "No problems match your search filter."
                    : "No problems found. Please create problems first."}
                </p>
              ) : (
                filteredProblems.map(problem => {
                  const isSelected = selectedProblemIds.includes(problem.id);
                  return (
                    <div
                      key={problem.id}
                      onClick={() => toggleProblem(problem.id)}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-500/10 shadow-sm"
                          : "border-border bg-card hover:bg-muted/50"
                      }`}
                    >
                      <div className="space-y-1 pr-4">
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <span className="text-sm font-semibold text-foreground">{problem.title}</span>
                          <DifficultyBadge difficulty={problem.difficulty} />
                          <ProblemTypeBadge type={problem.type || problem.problemType || "CODING"} />
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">{problem.description}</p>
                      </div>

                      <div className="flex items-center space-x-4 shrink-0">
                        <span className="text-xs font-mono font-medium text-foreground whitespace-nowrap">
                          {problem.points} pts
                        </span>
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-md border transition-colors ${
                            isSelected ? "bg-emerald-500 border-emerald-500 text-white" : "border-border bg-muted"
                          }`}
                        >
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex justify-between pt-4 border-t border-border">
              <Button variant="outline" onClick={onBack} className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <Button variant="emerald" disabled={selectedProblemIds.length === 0} onClick={onNext} className="gap-2">
                <span>Next: Review & Schedule</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        );
      }}
    </form.Field>
  );
}

export default StepProblems;
