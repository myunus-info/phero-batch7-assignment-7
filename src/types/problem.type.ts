import { IPaginationParams } from "./api.type";

export type DifficultyLevel = "EASY" | "MEDIUM" | "HARD";
export type ProblemType = "CODING" | "MCQ" | "SINGLE_CHOICE";

export interface ITestCase {
  id?: string;
  input: string;
  expectedOutput: string;
  isHidden?: boolean;
}

export interface IMcqOption {
  id?: string;
  text: string;
  isCorrect?: boolean;
}

export interface IProblem {
  id: string;
  title: string;
  slug?: string;
  description: string;
  difficulty: DifficultyLevel;
  problemType?: ProblemType;
  type?: ProblemType;
  creatorId?: string;
  points: number;
  timeLimitSeconds?: number;
  timeLimit?: number;
  memoryLimit?: number;
  isPublic?: boolean;
  starterCode?: Record<string, string> | null;
  mcqOptions?: IMcqOption[] | null;
  options?: IMcqOption[] | null;
  correctAnswers?: string[] | null;
  testCases?: ITestCase[] | null;
  createdAt?: string;
  updatedAt?: string;
  creator?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IProblemFilters extends IPaginationParams {
  searchTerm?: string;
  difficulty?: DifficultyLevel;
  problemType?: ProblemType;
  type?: ProblemType;
  creatorId?: string;
  isPublic?: boolean;
}

export interface ICreateProblemPayload {
  title: string;
  slug?: string;
  description: string;
  difficulty?: DifficultyLevel;
  problemType?: ProblemType;
  type?: ProblemType;
  points?: number;
  timeLimitSeconds?: number;
  timeLimit?: number;
  memoryLimit?: number;
  isPublic?: boolean;
  starterCode?: Record<string, string>;
  mcqOptions?: IMcqOption[];
  options?: IMcqOption[];
  correctAnswers?: string[];
  testCases?: ITestCase[];
}
