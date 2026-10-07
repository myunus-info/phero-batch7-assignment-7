"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useGetAllProblems } from "@/hooks/problem.hook";
import { useCreateAssessment, useUpdateAssessment } from "@/hooks";
import { assessmentWizardFormSchema } from "@/validations";
import { IAssessment } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { DifficultyBadge, ProblemTypeBadge } from "@/components/ui/status-badge";
import { Check, ChevronRight, ChevronLeft, CheckCircle2, Clock, Award } from "lucide-react";

interface AssessmentWizardProps {
  initialData?: IAssessment;
  isEditing?: boolean;
}

export function AssessmentWizard({ initialData, isEditing = false }: AssessmentWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const { data: problemsData, isLoading: isLoadingProblems } = useGetAllProblems({
    limit: 50,
  });
  const createAssessmentMutation = useCreateAssessment();
  const updateAssessmentMutation = useUpdateAssessment();

  const initialProblemIds =
    initialData?.problems?.map(p => p.problem.id) || initialData?.assessmentProblems?.map(p => p.problem.id) || [];

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      durationMinutes: initialData?.durationMinutes || 60,
      passingScore: initialData?.passingMarks ?? initialData?.passingScore ?? 70,
      selectedProblemIds: initialProblemIds,
    },
    validators: {
      onSubmit: assessmentWizardFormSchema,
    },
    onSubmit: async ({ value }) => {
      if (isEditing && initialData?.id) {
        updateAssessmentMutation.mutate(
          {
            id: initialData.id,
            payload: {
              title: value.title,
              description: value.description,
              durationMinutes: Number(value.durationMinutes),
              passingMarks: Number(value.passingScore),
              passingScore: Number(value.passingScore),
              problemIds: value.selectedProblemIds,
            },
          },
          {
            onSuccess: () => {
              router.push(`/dashboard/recruiter/assessments/${initialData.id}`);
            },
          },
        );
      } else {
        createAssessmentMutation.mutate(
          {
            title: value.title,
            description: value.description,
            durationMinutes: Number(value.durationMinutes),
            passingScore: Number(value.passingScore),
            passingMarks: Number(value.passingScore),
            problemIds: value.selectedProblemIds,
          },
          {
            onSuccess: () => {
              router.push(`/dashboard/recruiter/assessments`);
            },
          },
        );
      }
    },
  });

  const problems = problemsData?.data || [];

  return (
    <div className="max-w-4xl space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        {[
          { num: 1, label: "Assessment Basics" },
          { num: 2, label: "Select Problems" },
          { num: 3, label: "Review & Publish" },
        ].map(s => (
          <div key={s.num} className="flex items-center space-x-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                step === s.num
                  ? "bg-emerald-500 text-white"
                  : step > s.num
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                    : "bg-slate-800 text-slate-400"
              }`}
            >
              {step > s.num ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span className={`text-sm font-medium ${step === s.num ? "text-white" : "text-slate-400"}`}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Step 1: Basics */}
      {step === 1 && (
        <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold text-white">Assessment Information</h2>

          <FieldGroup>
            <form.Field name="title">
              {field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Title
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      placeholder="e.g. Senior Frontend Engineer Technical Screen"
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      required
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <form.Field name="durationMinutes">
                {field => (
                  <Field>
                    <FieldLabel htmlFor={field.name} required>
                      Duration (Minutes)
                    </FieldLabel>
                    <FieldDescription>Maximum time allowed once a candidate begins.</FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={15}
                      max={240}
                      value={field.state.value}
                      onChange={e => field.handleChange(Number(e.target.value))}
                      required
                    />
                  </Field>
                )}
              </form.Field>

              <form.Field name="passingScore">
                {field => (
                  <Field>
                    <FieldLabel htmlFor={field.name} required>
                      Passing Score (%)
                    </FieldLabel>
                    <FieldDescription>Minimum percentage to mark candidate as Passed.</FieldDescription>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={1}
                      max={100}
                      value={field.state.value}
                      onChange={e => field.handleChange(Number(e.target.value))}
                      required
                    />
                  </Field>
                )}
              </form.Field>
            </div>

            <form.Field name="description">
              {field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Description & Instructions
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      rows={4}
                      placeholder="Please complete all questions before the timer expires. You may submit code multiple times."
                      value={field.state.value}
                      onChange={e => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      required
                    />
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          <div className="flex justify-end pt-4">
            <form.Subscribe
              selector={state => ({
                title: state.values.title,
                description: state.values.description,
              })}
            >
              {({ title, description }) => (
                <Button
                  variant="emerald"
                  disabled={!title?.trim() || !description?.trim()}
                  onClick={() => setStep(2)}
                  className="gap-2"
                >
                  <span>Next: Select Problems</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </form.Subscribe>
          </div>
        </div>
      )}

      {/* Step 2: Select Problems */}
      {step === 2 && (
        <form.Field name="selectedProblemIds">
          {field => {
            const selectedProblemIds = field.state.value;
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
              <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">
                      Choose Problems ({selectedProblemIds.length} Selected)
                    </h2>
                    <p className="text-xs text-slate-400">
                      Total Assessment Points: <strong className="text-emerald-400">{totalPoints} pts</strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
                  {isLoadingProblems ? (
                    <p className="text-sm text-slate-400">Loading problem bank...</p>
                  ) : problems.length === 0 ? (
                    <p className="text-sm text-slate-400">No problems found. Please create problems first.</p>
                  ) : (
                    problems.map(problem => {
                      const isSelected = selectedProblemIds.includes(problem.id);
                      return (
                        <div
                          key={problem.id}
                          onClick={() => toggleProblem(problem.id)}
                          className={`flex items-center justify-between p-4 rounded-lg border transition-all cursor-pointer ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-500/10"
                              : "border-slate-800 bg-slate-950/60 hover:bg-slate-900"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-white">{problem.title}</span>
                              <DifficultyBadge difficulty={problem.difficulty} />
                              <ProblemTypeBadge type={problem.type || problem.problemType || "CODING"} />
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1">{problem.description}</p>
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className="text-xs font-mono font-medium text-slate-300">{problem.points} pts</span>
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                                isSelected
                                  ? "bg-emerald-500 border-emerald-500 text-white"
                                  : "border-slate-700 bg-slate-900"
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

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    variant="emerald"
                    disabled={selectedProblemIds.length === 0}
                    onClick={() => setStep(3)}
                    className="gap-2"
                  >
                    <span>Next: Review & Schedule</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          }}
        </form.Field>
      )}

      {/* Step 3: Review & Schedule */}
      {step === 3 && (
        <form.Subscribe
          selector={state => ({
            values: state.values,
          })}
        >
          {({ values }) => {
            const selectedProblems = problems.filter(p => values.selectedProblemIds.includes(p.id));
            const totalPoints = selectedProblems.reduce((sum, p) => sum + p.points, 0);

            return (
              <div className="space-y-6 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                <h2 className="text-lg font-semibold text-white">Review Assessment</h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Duration</span>
                    <p className="text-lg font-bold text-white flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-emerald-400" />
                      <span>{values.durationMinutes} Minutes</span>
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Passing Cutoff
                    </span>
                    <p className="text-lg font-bold text-white flex items-center space-x-1">
                      <Award className="h-4 w-4 text-cyan-400" />
                      <span>{values.passingScore}%</span>
                    </p>
                  </div>

                  <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Value</span>
                    <p className="text-lg font-bold text-emerald-400 font-mono">{totalPoints} Points</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Selected Problems ({selectedProblems.length})
                  </h3>
                  <div className="space-y-2">
                    {selectedProblems.map((p, idx) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-slate-800 bg-slate-950 text-xs"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-slate-500">#{idx + 1}</span>
                          <span className="font-semibold text-white">{p.title}</span>
                          <DifficultyBadge difficulty={p.difficulty} />
                          <ProblemTypeBadge type={p.type || p.problemType || "CODING"} />
                        </div>
                        <span className="font-mono text-slate-300 font-bold">{p.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-slate-800">
                  <Button
                    variant="outline"
                    onClick={() => setStep(2)}
                    disabled={createAssessmentMutation.isPending || updateAssessmentMutation.isPending}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>
                  <Button
                    variant="emerald"
                    onClick={() => form.handleSubmit()}
                    disabled={createAssessmentMutation.isPending || updateAssessmentMutation.isPending}
                    className="gap-2 disabled:cursor-not-allowed disabled:pointer-events-auto"
                  >
                    {createAssessmentMutation.isPending || updateAssessmentMutation.isPending ? (
                      <>
                        <Spinner size="sm" /> {isEditing ? "Updating..." : "Publishing..."}
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        <span>{isEditing ? "Update Assessment" : "Publish Assessment"}</span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          }}
        </form.Subscribe>
      )}
    </div>
  );
}

export default AssessmentWizard;
