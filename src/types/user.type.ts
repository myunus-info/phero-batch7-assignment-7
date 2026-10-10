import type { UserRole, UserStatus } from "./auth.type";

export interface IRecruiterProfile {
  id?: string;
  companyName: string;
  companyWebsite?: string | null;
  credits: number;
}

export interface ICandidateProfile {
  id?: string;
  headline?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  skills: string[];
}

export interface IUserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
  status: UserStatus;
  createdAt: string;
  recruiterProfile?: IRecruiterProfile | null;
  candidateProfile?: ICandidateProfile | null;
  _count?: {
    createdAssessments?: number;
    candidateAssessments?: number;
    submissions?: number;
    payments?: number;
  };
}

export interface IUpdateProfilePayload {
  name?: string;
  avatar?: string;
  headline?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  skills?: string[];
  companyName?: string;
  companyWebsite?: string;
}
