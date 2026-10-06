import { z } from "zod";

export const testCaseSchema = z.object({
  input: z.string().min(1, "Input is required"),
  expectedOutput: z.string().min(1, "Expected output is required"),
  isHidden: z.boolean().default(false),
});

export const mcqOptionSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Option text cannot be empty"),
  isCorrect: z.boolean().optional(),
});

export const createProblemSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]).default("EASY"),
  problemType: z.enum(["CODING", "MCQ", "SINGLE_CHOICE"]).default("CODING"),
  points: z.number().int().positive("Points must be positive").default(10),
  timeLimitSeconds: z.number().int().positive("Time limit must be positive").default(300),
  isPublic: z.boolean().default(true),
  starterCodeJavascript: z.string().optional(),
  starterCodeTypescript: z.string().optional(),
  mcqOptions: z.array(mcqOptionSchema).optional(),
  correctAnswers: z.array(z.string()).optional(),
  testCases: z.array(testCaseSchema).optional(),
});

export const createProblemFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  type: z.enum(["CODING", "MCQ"]),
  points: z.number().int().positive("Points must be positive"),
  timeLimit: z.number().positive(),
  memoryLimit: z.number().positive(),
  testCases: z.array(
    z.object({
      input: z.string().min(1, "Input is required"),
      expectedOutput: z.string().min(1, "Expected output is required"),
      isHidden: z.boolean(),
    }),
  ),
  options: z.array(
    z.object({
      text: z.string().min(1, "Option text cannot be empty"),
      isCorrect: z.boolean(),
    }),
  ),
});

export type CreateProblemFormData = z.infer<typeof createProblemSchema>;
export type CreateProblemFormInputs = z.infer<typeof createProblemFormSchema>;
