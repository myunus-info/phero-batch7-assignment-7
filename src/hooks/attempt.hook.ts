"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  finishAssessment,
  getAssessmentResult,
  getMyCandidateAssessments,
  startAssessmentAttempt,
  submitProblemSolution,
} from "@/api/attempt.api";
import { ISubmitProblemPayload } from "@/types";

export function useGetMyCandidateAssessments() {
  return useQuery({
    queryKey: ["my-candidate-assessments"],
    queryFn: getMyCandidateAssessments,
  });
}

export function useStartAssessmentAttempt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessmentId: string) => startAssessmentAttempt(assessmentId),
    onSuccess: (_, assessmentId) => {
      queryClient.invalidateQueries({ queryKey: ["my-candidate-assessments"] });
      queryClient.invalidateQueries({
        queryKey: ["attempt-result", assessmentId],
      });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || "Failed to start assessment");
    },
  });
}

export function useSubmitProblemSolution() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      problemId,
      payload,
    }: {
      assessmentId: string;
      problemId?: string;
      payload: ISubmitProblemPayload;
    }) =>
      submitProblemSolution(assessmentId, {
        problemId: problemId || payload.problemId,
        ...payload,
      }),
    onSuccess: (_, variables) => {
      toast.success("Solution submitted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["attempt-result", variables.assessmentId],
      });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || "Submission failed");
    },
  });
}

export function useFinishAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (assessmentId: string) => finishAssessment(assessmentId),
    onSuccess: (_, assessmentId) => {
      toast.success("Assessment finished successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-candidate-assessments"] });
      queryClient.invalidateQueries({
        queryKey: ["attempt-result", assessmentId],
      });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || "Failed to finish assessment");
    },
  });
}

export function useGetAssessmentResult(assessmentId: string) {
  return useQuery({
    queryKey: ["attempt-result", assessmentId],
    queryFn: () => getAssessmentResult(assessmentId),
    enabled: !!assessmentId,
  });
}
