import { IPaginationParams } from "./api.type";
import { IProblem } from "./problem.type";

export type AssessmentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type CandidateAssessmentStatus = "INVITED" | "IN_PROGRESS" | "COMPLETED" | "EXPIRED";

export interface IAssessmentProblem {
  id?: string;
  assessmentId?: string;
  problemId: string;
  orderIndex?: number;
  customPoints?: number | null;
  problem: IProblem;
}

export interface IAssessmentCandidate {
  id: string;
  assessmentId?: string;
  candidateEmail?: string;
  candidateId?: string | null;
  status: CandidateAssessmentStatus;
  totalScore?: number | null;
  score?: number | null;
  isPassed?: boolean | null;
  startedAt?: string | null;
  submittedAt?: string | null;
  completedAt?: string | null;
  invitationToken?: string;
  candidate?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string | null;
  } | null;
}

export interface IAssessment {
  id: string;
  title: string;
  description?: string | null;
  recruiterId?: string;
  durationMinutes: number;
  totalMarks?: number;
  passingMarks?: number;
  passingScore?: number;
  scheduleStart?: string | null;
  scheduleEnd?: string | null;
  status: AssessmentStatus;
  createdAt: string;
  updatedAt?: string;
  recruiter?: {
    id: string;
    name: string;
    email: string;
    recruiterProfile?: {
      companyName?: string;
    };
  };
  problems?: IAssessmentProblem[];
  assessmentProblems?: IAssessmentProblem[];
  candidates?: IAssessmentCandidate[];
  candidateAssessments?: IAssessmentCandidate[];
  _count?: {
    problems: number;
    candidates: number;
  };
}

export interface IAssessmentFilters extends IPaginationParams {
  searchTerm?: string;
  status?: AssessmentStatus;
  recruiterId?: string;
}

export interface ICreateAssessmentPayload {
  title: string;
  description?: string;
  durationMinutes: number;
  totalMarks?: number;
  passingMarks?: number;
  passingScore?: number;
  scheduleStart?: string;
  scheduleEnd?: string;
  status?: AssessmentStatus;
  problemIds: string[] | Array<{ problemId: string; orderIndex?: number; customPoints?: number }>;
}

export interface IInviteCandidatePayload {
  email?: string;
  candidateEmail?: string;
  candidateId?: string;
  expiresAt?: string;
}
