"use client";

import { use, useState, useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { useStartAssessmentAttempt, useSubmitProblemSolution, useFinishAssessment } from "@/hooks/attempt.hook";
import { ArenaHeader } from "@/components/arena/ArenaHeader";
import { ProblemStatement } from "@/components/arena/ProblemStatement";
import { CodeEditor } from "@/components/arena/CodeEditor";
import { McqView } from "@/components/arena/McqView";
import { TestResultsPanel } from "@/components/arena/TestResultsPanel";
import { FinishDialog } from "@/components/arena/FinishDialog";
import { ISubmitProblemResponse } from "@/types/attempt.type";
import { Spinner } from "@/components/ui/spinner";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { IProblem } from "@/types/problem.type";

function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

function getOnlineServerSnapshot() {
  return true;
}

const getDraftKey = (assessmentId: string, problemId: string) => `devjudge_draft_${assessmentId}_${problemId}`;

export default function ArenaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const assessmentId = resolvedParams.id;
  const router = useRouter();

  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getOnlineServerSnapshot);

  const [activeProblemIdx, setActiveProblemIdx] = useState(0);
  const [finishDialogOpen, setFinishDialogOpen] = useState(false);
  const [testResults, setTestResults] = useState<ISubmitProblemResponse | null>(null);
  const [selectedMcqOption, setSelectedMcqOption] = useState<string>("");

  // Code state per problem
  const [codeSolutions, setCodeSolutions] = useState<Record<string, string>>({});
  const [answeredProblems, setAnsweredProblems] = useState<Set<string>>(new Set());

  // Mutations
  const startAttemptMutation = useStartAssessmentAttempt();
  const submitSolutionMutation = useSubmitProblemSolution();
  const finishAssessmentMutation = useFinishAssessment();

  // Start or resume attempt on mount
  useEffect(() => {
    if (assessmentId) {
      startAttemptMutation.mutate(assessmentId);
    }
  }, [assessmentId]);

  // Tab switch monitoring (proctoring alert)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        toast.warning("Proctoring Alert: Assessment window lost focus. Tab switches are logged.");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const attemptData = startAttemptMutation.data?.data;
  const problems = attemptData?.problems || [];

  const getInitialProblemCode = (problemId: string): string | undefined => {
    if (codeSolutions[problemId] !== undefined) {
      return codeSolutions[problemId];
    }
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem(getDraftKey(assessmentId, problemId));
        if (saved) return saved;
      } catch {
        // ignore
      }
    }
    return undefined;
  };

  const currentProblemRaw = problems[activeProblemIdx]?.problem;
  const activeProblem: IProblem | undefined = currentProblemRaw
    ? {
        ...currentProblemRaw,
        points: currentProblemRaw.points ?? 100,
        type: currentProblemRaw.type || currentProblemRaw.problemType || "CODING",
        problemType: currentProblemRaw.problemType || currentProblemRaw.type || "CODING",
        options: currentProblemRaw.options || currentProblemRaw.mcqOptions || [],
        mcqOptions: currentProblemRaw.mcqOptions || currentProblemRaw.options || [],
      }
    : undefined;

  // Handle local code changes and persist to localStorage
  const handleCodeChange = (problemId: string, code: string) => {
    setCodeSolutions(prev => ({
      ...prev,
      [problemId]: code,
    }));
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(getDraftKey(assessmentId, problemId), code);
      } catch {
        // Ignore storage quota errors
      }
    }
  };

  // Handle Coding Submission
  const handleCodeSubmit = (code: string, language: string) => {
    if (!activeProblem) return;

    submitSolutionMutation.mutate(
      {
        assessmentId,
        problemId: activeProblem.id,
        payload: {
          code,
          language,
        },
      },
      {
        onSuccess: res => {
          setTestResults(res.data);
          setAnsweredProblems(prev => new Set([...prev, activeProblem.id]));
        },
      },
    );
  };

  // Handle MCQ Submission
  const handleMcqSubmit = () => {
    if (!activeProblem || !selectedMcqOption) return;

    submitSolutionMutation.mutate(
      {
        assessmentId,
        problemId: activeProblem.id,
        payload: {
          selectedOptionId: selectedMcqOption,
        },
      },
      {
        onSuccess: res => {
          setTestResults(res.data);
          setAnsweredProblems(prev => new Set([...prev, activeProblem.id]));
        },
      },
    );
  };

  // Finish assessment
  const handleFinishAssessment = () => {
    finishAssessmentMutation.mutate(assessmentId, {
      onSuccess: () => {
        problems.forEach(p => {
          try {
            localStorage.removeItem(getDraftKey(assessmentId, p.problem.id));
          } catch {
            // ignore
          }
        });
        router.push(`/dashboard/candidate/assessments/${assessmentId}/result`);
      },
    });
  };

  if (startAttemptMutation.isPending) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#090d16] text-slate-300">
        <Spinner size="lg" className="mb-4" />
        <p className="font-mono text-sm">Initializing Secure Assessment Sandbox...</p>
      </div>
    );
  }

  if (startAttemptMutation.isError || !attemptData) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-[#090d16] p-6 text-center text-slate-300">
        <h2 className="text-xl font-bold text-white mb-2">Unable to Load Assessment</h2>
        <p className="text-sm text-slate-400 mb-6 max-w-md">
          {startAttemptMutation.error?.message ||
            "You may not have an active invitation or the test has already ended."}
        </p>
        <button
          onClick={() => router.push("/dashboard/candidate")}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Return to Candidate Dashboard
        </button>
      </div>
    );
  }

  const isCodingProblem = (activeProblem?.type || activeProblem?.problemType) === "CODING";

  return (
    <AuthGuard>
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#090d16]">
        {/* Offline Banner */}
        {!isOnline && (
          <div className="flex items-center justify-center space-x-2 bg-amber-500/15 border-b border-amber-500/30 px-4 py-1.5 text-xs font-medium text-amber-300 shrink-0">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>
              Network connection lost. You are currently offline. Local progress is saved, but running tests and
              submissions require internet.
            </span>
          </div>
        )}

        {/* Arena Header */}
        <ArenaHeader
          assessmentTitle={attemptData.title || attemptData.assessment?.title || "Assessment"}
          totalProblems={problems.length}
          completedProblems={answeredProblems.size}
          durationMinutes={attemptData.durationMinutes || attemptData.assessment?.durationMinutes || 60}
          onFinish={() => setFinishDialogOpen(true)}
          onAutoSubmit={handleFinishAssessment}
          isSubmitting={finishAssessmentMutation.isPending}
        />

        {/* Problems Tab Bar */}
        <div className="flex h-10 items-center space-x-1 border-b border-slate-800 bg-slate-900/80 px-4 overflow-x-auto">
          {problems.map((p, idx) => {
            const isCompleted = answeredProblems.has(p.problem.id);
            const isActive = activeProblemIdx === idx;

            return (
              <button
                key={p.problem.id}
                onClick={() => {
                  setActiveProblemIdx(idx);
                  setTestResults(null);
                  setSelectedMcqOption("");
                }}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  isActive
                    ? "bg-slate-800 text-white border border-slate-700"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
                }`}
              >
                <span>Problem {idx + 1}</span>
                {isCompleted && <CheckCircle2 className="h-3 w-3 text-emerald-400" />}
              </button>
            );
          })}
        </div>

        {/* Main Split Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left: Problem Statement */}
          <div className="w-1/2 border-r border-slate-800 overflow-hidden">
            {activeProblem && <ProblemStatement problem={activeProblem} />}
          </div>

          {/* Right: Code Editor or MCQ + Test Results */}
          <div className="flex w-1/2 flex-col overflow-hidden">
            {isCodingProblem ? (
              <>
                <div className="flex-1 overflow-hidden">
                  {activeProblem && (
                    <CodeEditor
                      key={activeProblem.id}
                      initialCode={getInitialProblemCode(activeProblem.id)}
                      starterCode={activeProblem.starterCode}
                      onCodeChange={code => handleCodeChange(activeProblem.id, code)}
                      onSubmit={handleCodeSubmit}
                      isSubmitting={submitSolutionMutation.isPending}
                    />
                  )}
                </div>
                <div className="max-h-60 overflow-y-auto">
                  <TestResultsPanel results={testResults} isSubmitting={submitSolutionMutation.isPending} />
                </div>
              </>
            ) : (
              <div className="flex-1 overflow-hidden">
                <McqView
                  options={activeProblem?.options || []}
                  selectedOptionId={selectedMcqOption}
                  onSelectOption={setSelectedMcqOption}
                  onSubmit={handleMcqSubmit}
                  isSubmitting={submitSolutionMutation.isPending}
                />
              </div>
            )}
          </div>
        </div>

        {/* Finish Confirmation Dialog */}
        <FinishDialog
          open={finishDialogOpen}
          onOpenChange={setFinishDialogOpen}
          onConfirmFinish={handleFinishAssessment}
          isSubmitting={finishAssessmentMutation.isPending}
          answeredCount={answeredProblems.size}
          totalCount={problems.length}
        />
      </div>
    </AuthGuard>
  );
}
