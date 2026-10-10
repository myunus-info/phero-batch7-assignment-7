import { z } from "zod";

export const assessmentWizardFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(1, "Description is required"),
  durationMinutes: z
    .number()
    .int()
    .positive("Duration must be a positive number in minutes"),
  passingMarks: z.number().int().min(1).max(100),
  selectedProblemIds: z.array(z.string()),
});

export const inviteCandidateSchema = z.object({
  candidateEmail: z
    .string()
    .min(1, "Candidate email is required")
    .email("Please provide a valid candidate email address"),
  expiresAt: z.string(),
});

export type AssessmentWizardFormInputs = z.infer<
  typeof assessmentWizardFormSchema
>;
export type InviteCandidateFormData = z.infer<typeof inviteCandidateSchema>;
