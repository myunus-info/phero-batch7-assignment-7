"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useGetAllProblems } from "@/hooks/problem.hook";
import { useCreateAssessment, useUpdateAssessment } from "@/hooks/assessment.hook";
import { assessmentWizardFormSchema } from "@/validations";
import { IAssessment } from "@/types";
import { toast } from "sonner";
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
    onSubmit: async () => {
      handlePublish();
    },
  });

  const problems = problemsData?.data || [];

  const handlePublish = () => {
    const values = form.state.values;

    if (!values.title || values.title.trim().length < 3) {
      toast.error("Assessment title must be at least 3 characters.");
      setStep(1);
      return;
    }

    if (!values.description || !values.description.trim()) {
      toast.error("Please provide instructions or description for the assessment.");
      setStep(1);
      return;
    }

    const duration = Number(values.durationMinutes);
    if (!duration || duration <= 0) {
      toast.error("Duration must be a positive number in minutes.");
      setStep(1);
      return;
    }

    const passingScore = Number(values.passingScore);
    if (!passingScore || passingScore <= 0 || passingScore > 100) {
      toast.error("Passing score must be between 1 and 100 percent.");
      setStep(1);
      return;
    }

    if (!values.selectedProblemIds || values.selectedProblemIds.length === 0) {
      toast.error("Please select at least one problem to include in this assessment.");
      setStep(2);
      return;
    }

    const selectedProblems = problems.filter(p => values.selectedProblemIds.includes(p.id));
    const totalPoints = selectedProblems.reduce((sum, p) => sum + p.points, 0);

    const formattedProblemIds = values.selectedProblemIds.map((id, index) => ({
      problemId: id,
      orderIndex: index + 1,
    }));

    if (isEditing && initialData?.id) {
      updateAssessmentMutation.mutate(
        {
          id: initialData.id,
          payload: {
            title: values.title.trim(),
            description: values.description.trim(),
            durationMinutes: duration,
            passingMarks: passingScore,
            passingScore: passingScore,
            totalMarks: totalPoints || 100,
            problemIds: formattedProblemIds,
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
          title: values.title.trim(),
          description: values.description.trim(),
          durationMinutes: duration,
          passingScore: passingScore,
          passingMarks: passingScore,
          totalMarks: totalPoints || 100,
          problemIds: formattedProblemIds,
        },
        {
          onSuccess: () => {
            router.push(`/dashboard/recruiter/assessments`);
          },
        },
      );
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between border-b border-border pb-4">
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
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step > s.num ? <Check className="h-4 w-4" /> : s.num}
            </div>
            <span
              className={`text-sm font-medium ${step === s.num ? "text-foreground font-semibold" : "text-muted-foreground"}`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Basics */}
      {step === 1 && (
        <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground">Assessment Information</h2>

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
              <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Choose Problems ({selectedProblemIds.length} Selected)
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Total Assessment Points: <strong className="text-emerald-500">{totalPoints} pts</strong>
                    </p>
                  </div>
                </div>

                <div className="space-y-3 max-h-125 overflow-y-auto pr-1">
                  {isLoadingProblems ? (
                    <p className="text-sm text-muted-foreground">Loading problem bank...</p>
                  ) : problems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No problems found. Please create problems first.</p>
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
                              : "border-border bg-card hover:bg-muted/50"
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-semibold text-foreground">{problem.title}</span>
                              <DifficultyBadge difficulty={problem.difficulty} />
                              <ProblemTypeBadge type={problem.type || problem.problemType || "CODING"} />
                            </div>
                            <p className="text-xs text-muted-foreground line-clamp-1">{problem.description}</p>
                          </div>

                          <div className="flex items-center space-x-4">
                            <span className="text-xs font-mono font-medium text-foreground whitespace-nowrap">
                              {problem.points} pts
                            </span>
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-md border ${
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
              <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-foreground">Review Assessment</h2>

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
                      <span>{values.passingScore}%</span>
                    </p>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-1">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Total Value
                    </span>
                    <p className="text-lg font-bold text-emerald-500 font-mono">{totalPoints} Points</p>
                  </div>
                </div>

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
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-muted-foreground">#{idx + 1}</span>
                          <span className="font-semibold text-foreground">{p.title}</span>
                          <DifficultyBadge difficulty={p.difficulty} />
                          <ProblemTypeBadge type={p.type || p.problemType || "CODING"} />
                        </div>
                        <span className="font-mono text-foreground font-bold">{p.points} pts</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t border-border">
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
                    onClick={handlePublish}
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
