import { z } from "zod";

export const assessmentBasicsSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  durationMinutes: z.number().int().positive("Duration must be a positive number in minutes"),
  passingMarks: z.number().int().positive("Passing marks must be a positive integer").optional(),
  passingScore: z.number().int().optional(),
  scheduleStart: z.string().optional(),
  scheduleEnd: z.string().optional(),
});

export const assessmentProblemItemSchema = z.object({
  problemId: z.string().min(1, "Problem ID is required"),
  orderIndex: z.number().int().optional(),
  customPoints: z.number().int().positive().optional(),
});

export const assessmentWizardSchema = assessmentBasicsSchema.extend({
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("PUBLISHED"),
  problemIds: z.array(assessmentProblemItemSchema).min(1, "Assessment must contain at least 1 problem"),
});

export const assessmentWizardFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  durationMinutes: z.number().int().positive("Duration must be a positive number in minutes"),
  passingScore: z.number().int().min(1).max(100),
  selectedProblemIds: z.array(z.string()),
});

export const inviteCandidateSchema = z.object({
  candidateEmail: z
    .string()
    .min(1, "Candidate email is required")
    .email("Please provide a valid candidate email address"),
  expiresAt: z.string(),
});

export type AssessmentBasicsFormData = z.infer<typeof assessmentBasicsSchema>;
export type AssessmentWizardFormData = z.infer<typeof assessmentWizardSchema>;
export type AssessmentWizardFormInputs = z.infer<typeof assessmentWizardFormSchema>;
export type InviteCandidateFormData = z.infer<typeof inviteCandidateSchema>;
