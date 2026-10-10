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

export type CreateProblemFormInputs = z.infer<typeof createProblemFormSchema>;
