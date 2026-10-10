import type { CandidateAssessmentStatus } from "./assessment.type";
import type { DifficultyLevel, IProblem, ProblemType } from "./problem.type";

export type SubmissionStatus =
  | "PASSED"
  | "FAILED"
  | "ACCEPTED"
  | "WRONG_ANSWER"
  | "ERROR";

export interface ITestResult {
  testCaseId?: string;
  passed: boolean;
  input: string;
  expectedOutput: string;
  actualOutput?: string;
  executionTime?: number;
  executionTimeMs?: number;
  memory?: number;
  error?: string;
  errorMessage?: string;
  isHidden?: boolean;
}

export interface IAttemptProblem {
  orderIndex: number;
  points?: number;
  problem: IProblem;
}

export interface IStartAttemptResponse {
  attemptId?: string;
  assessmentId: string;
  title?: string;
  durationMinutes?: number;
  startedAt?: string;
  assessment?: {
    id: string;
    title: string;
    durationMinutes: number;
    passingScore?: number;
  };
  problems: IAttemptProblem[];
  submittedProblemIds?: string[];
  submissions?: Array<{
    problemId: string;
    submittedCode?: string | null;
    selectedOptions?: string[] | null;
  }>;
}

export interface ISubmitProblemPayload {
  problemId?: string;
  code?: string;
  submittedCode?: string;
  language?: string;
  selectedOptionId?: string;
  selectedOptions?: string[];
}

export interface ISubmitProblemResponse {
  submissionId?: string;
  problemId?: string;
  score?: number;
  scoreAwarded?: number;
  maxPoints?: number;
  testCasesPassed?: number;
  totalTestCases?: number;
  status: SubmissionStatus | string;
  testResults?: ITestResult[];
}

export interface IFinishAssessmentResponse {
  attemptId: string;
  assessmentTitle: string;
  totalScore: number;
  totalMarks: number;
  passingMarks: number;
  isPassed: boolean;
  status: CandidateAssessmentStatus;
  submittedAt: string;
}

export interface ISubmissionDetail {
  id: string;
  problemId: string;
  submittedCode?: string | null;
  selectedOptions?: string[] | null;
  scoreAwarded: number;
  status: SubmissionStatus | string;
  executionTimeMs?: number;
  executionResult?: ITestResult[] | Record<string, unknown> | null;
  problem: {
    id: string;
    title: string;
    difficulty: DifficultyLevel;
    problemType?: ProblemType;
    type?: ProblemType;
    points: number;
  };
}

export interface IAssessmentResult {
  id?: string;
  assessmentId?: string;
  candidateId?: string | null;
  candidateEmail?: string;
  status?: CandidateAssessmentStatus;
  totalScore: number;
  isPassed?: boolean;
  passed?: boolean;
  percentageScore?: number;
  maxPossibleScore?: number;
  startedAt?: string | null;
  submittedAt?: string | null;
  assessment?: {
    id: string;
    title: string;
    description?: string | null;
    totalMarks?: number;
    passingMarks?: number;
    passingScore?: number;
    durationMinutes: number;
  };
  submissions?: ISubmissionDetail[];
  problemResults?: Array<{
    problemId: string;
    title: string;
    difficulty: DifficultyLevel;
    problemType?: ProblemType;
    type?: ProblemType;
    score: number;
    maxPoints: number;
    status?: string;
    testCasesPassed?: number;
    totalTestCases?: number;
  }>;
}

export interface ICandidateAssessmentItem {
  id: string;
  assessmentId: string;
  candidateEmail: string;
  status: CandidateAssessmentStatus;
  totalScore?: number | null;
  score?: number | null;
  isPassed?: boolean | null;
  startedAt?: string | null;
  submittedAt?: string | null;
  assessment: {
    id: string;
    title: string;
    description?: string | null;
    durationMinutes: number;
    totalMarks?: number;
    passingMarks?: number;
    passingScore?: number;
    scheduleStart?: string | null;
    scheduleEnd?: string | null;
    recruiter?: {
      name: string;
      recruiterProfile?: {
        companyName?: string;
      };
    };
    _count?: {
      problems: number;
    };
  };
}
