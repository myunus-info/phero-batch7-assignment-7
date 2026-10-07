"use client";

import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useCreateProblem, useUpdateProblem } from "@/hooks/problem.hook";
import { createProblemFormSchema } from "@/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { DifficultyLevel, ProblemType, ITestCase, IMcqOption, IProblem } from "@/types/problem.type";
import { Plus, Trash2, Code2, ListChecks, Check } from "lucide-react";

interface ProblemFormProps {
  initialProblem?: IProblem;
  mode?: "create" | "edit";
  redirectPath?: string;
}

export function ProblemForm({
  initialProblem,
  mode = "create",
  redirectPath = "/dashboard/recruiter/problems",
}: ProblemFormProps) {
  const router = useRouter();
  const createProblemMutation = useCreateProblem();
  const updateProblemMutation = useUpdateProblem();

  const isPending = createProblemMutation.isPending || updateProblemMutation.isPending;

  const initialTestCases: Omit<ITestCase, "id">[] =
    initialProblem?.testCases && initialProblem.testCases.length > 0
      ? initialProblem.testCases.map(tc => ({
          input: tc.input || "",
          expectedOutput: tc.expectedOutput || "",
          isHidden: !!tc.isHidden,
        }))
      : [
          { input: "1 2", expectedOutput: "3", isHidden: false },
          { input: "10 20", expectedOutput: "30", isHidden: true },
        ];

  const initialOptions: Omit<IMcqOption, "id">[] =
    initialProblem?.mcqOptions && initialProblem.mcqOptions.length > 0
      ? initialProblem.mcqOptions.map(opt => ({
          text: opt.text || "",
          isCorrect: !!opt.isCorrect,
        }))
      : [
          { text: "Option A", isCorrect: true },
          { text: "Option B", isCorrect: false },
          { text: "Option C", isCorrect: false },
          { text: "Option D", isCorrect: false },
        ];

  const initialProblemType: ProblemType =
    (initialProblem?.problemType as ProblemType) || (initialProblem?.type as ProblemType) || "CODING";

  const form = useForm({
    defaultValues: {
      title: initialProblem?.title || "",
      description: initialProblem?.description || "",
      difficulty: (initialProblem?.difficulty as DifficultyLevel) || "EASY",
      type: initialProblemType,
      points: initialProblem?.points || 100,
      timeLimit: initialProblem?.timeLimitSeconds
        ? Math.round(initialProblem.timeLimitSeconds / 60)
        : initialProblem?.timeLimit || 2,
      memoryLimit: initialProblem?.memoryLimit || 256,
      testCases: initialTestCases,
      options: initialOptions,
    },
    validators: {
      onSubmit: createProblemFormSchema,
    },
    onSubmit: async ({ value }) => {
      const payload = {
        title: value.title,
        description: value.description,
        difficulty: value.difficulty,
        type: value.type,
        problemType: value.type,
        points: Number(value.points),
        timeLimit: value.type === "CODING" ? Number(value.timeLimit) : undefined,
        timeLimitSeconds: value.type === "CODING" ? Number(value.timeLimit) * 60 : undefined,
        memoryLimit: value.type === "CODING" ? Number(value.memoryLimit) : undefined,
        testCases: value.type === "CODING" ? value.testCases : undefined,
        options: value.type === "MCQ" ? value.options : undefined,
        mcqOptions: value.type === "MCQ" ? value.options : undefined,
      };

      if (mode === "edit" && initialProblem?.id) {
        updateProblemMutation.mutate(
          {
            id: initialProblem.id,
            payload,
          },
          {
            onSuccess: () => {
              router.push(redirectPath);
            },
          },
        );
      } else {
        createProblemMutation.mutate(payload, {
          onSuccess: () => {
            router.push(redirectPath);
          },
        });
      }
    },
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-8 max-w-4xl"
    >
      {/* Basic Info */}
      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold text-white">Problem Details</h2>

        <FieldGroup>
          <form.Field name="title">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Problem Title
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    placeholder="e.g. Two Sum, Valid Parentheses, Event Loop MCQ"
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <form.Field name="type">
              {field => (
                <Field>
                  <FieldLabel htmlFor={field.name} required>
                    Problem Type
                  </FieldLabel>
                  <Select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value as ProblemType)}
                  >
                    <option value="CODING">Coding (Judge0 Executable)</option>
                    <option value="MCQ">Multiple Choice Question</option>
                  </Select>
                  <FieldDescription>Determines execution environment</FieldDescription>
                </Field>
              )}
            </form.Field>

            <form.Field name="difficulty">
              {field => (
                <Field>
                  <FieldLabel htmlFor={field.name} required>
                    Difficulty Level
                  </FieldLabel>
                  <Select
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value as DifficultyLevel)}
                  >
                    <option value="EASY">Easy</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HARD">Hard</option>
                  </Select>
                  <FieldDescription>Complexity rating</FieldDescription>
                </Field>
              )}
            </form.Field>

            <form.Field name="points">
              {field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Award Points
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={1}
                      value={field.state.value}
                      onChange={e => field.handleChange(Number(e.target.value))}
                      onBlur={field.handleBlur}
                      aria-invalid={isInvalid}
                      required
                    />
                    <FieldDescription>Total scorecard score</FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>
          </div>
        </FieldGroup>
      </div>

      {/* Description */}
      <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
        <h2 className="text-lg font-semibold text-white">Problem Statement</h2>

        <FieldGroup>
          <form.Field name="description">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Description & Specifications
                  </FieldLabel>
                  <Textarea
                    id={field.name}
                    name={field.name}
                    rows={6}
                    placeholder="Provide a clear description of the problem, input format, constraints, and edge cases..."
                    value={field.state.value}
                    onChange={e => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    aria-invalid={isInvalid}
                    required
                  />
                  <FieldDescription>Markdown syntax is supported for code blocks and tables.</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
        </FieldGroup>
      </div>

      {/* Conditional: Execution Limits for Coding Problems */}
      <form.Subscribe selector={state => state.values.type}>
        {problemType =>
          problemType === "CODING" ? (
            <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
              <div className="flex items-center space-x-2">
                <Code2 className="h-5 w-5 text-emerald-400" />
                <h2 className="text-lg font-semibold text-white">Execution Limits</h2>
              </div>

              <FieldGroup>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <form.Field name="timeLimit">
                    {field => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name} required>
                            Time Limit (Minutes)
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="number"
                            min={1}
                            max={60}
                            value={field.state.value}
                            onChange={e => field.handleChange(Number(e.target.value))}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            required
                          />
                          <FieldDescription>Max runtime before Time Limit Exceeded (TLE)</FieldDescription>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </form.Field>

                  <form.Field name="memoryLimit">
                    {field => {
                      const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                      return (
                        <Field data-invalid={isInvalid}>
                          <FieldLabel htmlFor={field.name} required>
                            Memory Limit (MB)
                          </FieldLabel>
                          <Input
                            id={field.name}
                            name={field.name}
                            type="number"
                            min={64}
                            max={1024}
                            step={64}
                            value={field.state.value}
                            onChange={e => field.handleChange(Number(e.target.value))}
                            onBlur={field.handleBlur}
                            aria-invalid={isInvalid}
                            required
                          />
                          <FieldDescription>Allocated memory buffer per run</FieldDescription>
                          {isInvalid && <FieldError errors={field.state.meta.errors} />}
                        </Field>
                      );
                    }}
                  </form.Field>
                </div>
              </FieldGroup>
            </div>
          ) : null
        }
      </form.Subscribe>

      {/* Conditional: Test Cases for Coding Problems */}
      <form.Subscribe selector={state => state.values.type}>
        {problemType =>
          problemType === "CODING" ? (
            <form.Field name="testCases">
              {field => {
                const testCases = field.state.value || [];

                const addTestCase = () => {
                  field.handleChange([...testCases, { input: "", expectedOutput: "", isHidden: true }]);
                };

                const removeTestCase = (index: number) => {
                  field.handleChange(testCases.filter((_, idx) => idx !== index));
                };

                const updateTestCase = (index: number, updated: Partial<ITestCase>) => {
                  field.handleChange(testCases.map((tc, idx) => (idx === index ? { ...tc, ...updated } : tc)));
                };

                return (
                  <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-semibold text-white">Automated Test Cases</h2>
                        <p className="text-sm text-slate-400">
                          Configure input and expected output pairs used by the judge.
                        </p>
                      </div>
                      <Button type="button" size="sm" variant="outline" onClick={addTestCase} className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Test Case</span>
                      </Button>
                    </div>

                    <div className="space-y-4 pt-2">
                      {testCases.map((tc, index) => (
                        <div key={index} className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-mono">
                              Test Case #{index + 1}
                            </span>
                            <div className="flex items-center space-x-3">
                              <label className="flex items-center space-x-2 text-xs text-slate-300 cursor-pointer select-none">
                                <input
                                  type="checkbox"
                                  checked={tc.isHidden}
                                  onChange={e =>
                                    updateTestCase(index, {
                                      isHidden: e.target.checked,
                                    })
                                  }
                                  className="rounded border-slate-700 bg-slate-900 text-emerald-500"
                                />
                                <span>Hidden from candidate</span>
                              </label>

                              {testCases.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => removeTestCase(index)}
                                  className="text-slate-500 hover:text-red-400 transition-colors p-1"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <FieldLabel className="text-xs">Standard Input (stdin)</FieldLabel>
                              <Textarea
                                rows={2}
                                placeholder="Input passed via stdin"
                                value={tc.input}
                                onChange={e =>
                                  updateTestCase(index, {
                                    input: e.target.value,
                                  })
                                }
                                className="font-mono text-xs bg-slate-900"
                                required
                              />
                            </div>
                            <div>
                              <FieldLabel className="text-xs">Expected Output (stdout)</FieldLabel>
                              <Textarea
                                rows={2}
                                placeholder="Exact expected stdout"
                                value={tc.expectedOutput}
                                onChange={e =>
                                  updateTestCase(index, {
                                    expectedOutput: e.target.value,
                                  })
                                }
                                className="font-mono text-xs bg-slate-900"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            </form.Field>
          ) : null
        }
      </form.Subscribe>

      {/* Conditional: MCQ Options */}
      <form.Subscribe selector={state => state.values.type}>
        {problemType =>
          problemType === "MCQ" ? (
            <form.Field name="options">
              {field => {
                const options = field.state.value || [];

                const addOption = () => {
                  field.handleChange([
                    ...options,
                    {
                      text: `Option ${String.fromCharCode(65 + options.length)}`,
                      isCorrect: false,
                    },
                  ]);
                };

                const removeOption = (index: number) => {
                  field.handleChange(options.filter((_, idx) => idx !== index));
                };

                const updateOption = (index: number, updated: Partial<IMcqOption>) => {
                  field.handleChange(options.map((opt, idx) => (idx === index ? { ...opt, ...updated } : opt)));
                };

                const setCorrectOption = (correctIndex: number) => {
                  field.handleChange(
                    options.map((opt, idx) => ({
                      ...opt,
                      isCorrect: idx === correctIndex,
                    })),
                  );
                };

                return (
                  <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/60 p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ListChecks className="h-5 w-5 text-cyan-400" />
                        <div>
                          <h2 className="text-lg font-semibold text-white">Multiple Choice Options</h2>
                          <p className="text-sm text-slate-400">
                            Specify candidate answer choices and mark the correct answer.
                          </p>
                        </div>
                      </div>
                      <Button type="button" size="sm" variant="outline" onClick={addOption} className="gap-2">
                        <Plus className="h-4 w-4" />
                        <span>Add Option</span>
                      </Button>
                    </div>

                    <div className="space-y-3 pt-2">
                      {options.map((opt, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 rounded-lg border border-slate-800 bg-slate-950/60"
                        >
                          <button
                            type="button"
                            onClick={() => setCorrectOption(index)}
                            className={`p-1.5 rounded-full border transition-all ${
                              opt.isCorrect
                                ? "bg-emerald-500 border-emerald-400 text-white"
                                : "border-slate-700 hover:border-slate-500 text-transparent"
                            }`}
                            title="Mark as correct answer"
                          >
                            <Check className="h-3.5 w-3.5 stroke-3" />
                          </button>

                          <Input
                            value={opt.text}
                            onChange={e => updateOption(index, { text: e.target.value })}
                            placeholder={`Choice ${String.fromCharCode(65 + index)}`}
                            className="flex-1 bg-slate-900"
                            required
                          />

                          {options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(index)}
                              className="text-slate-500 hover:text-red-400 transition-colors p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }}
            </form.Field>
          ) : null
        }
      </form.Subscribe>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isPending}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="emerald"
          disabled={isPending}
          className="disabled:cursor-not-allowed disabled:pointer-events-auto"
        >
          {isPending ? (
            <>
              <Spinner size="sm" /> {mode === "edit" ? "Saving Changes..." : "Creating Problem..."}
            </>
          ) : mode === "edit" ? (
            "Save Changes"
          ) : (
            "Create Problem"
          )}
        </Button>
      </div>
    </form>
  );
}

export default ProblemForm;
