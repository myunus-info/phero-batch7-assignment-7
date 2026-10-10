"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createAssessment,
  deleteAssessment,
  getAllAssessments,
  getAssessmentById,
  inviteCandidate,
  updateAssessment,
} from "@/api/assessment.api";
import type {
  IAssessmentFilters,
  ICreateAssessmentPayload,
  IInviteCandidatePayload,
} from "@/types";

export function useGetAllAssessments(filters?: IAssessmentFilters) {
  return useQuery({
    queryKey: ["assessments", filters],
    queryFn: () => getAllAssessments(filters),
  });
}

export function useGetAssessmentById(id: string) {
  return useQuery({
    queryKey: ["assessment", id],
    queryFn: () => getAssessmentById(id),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateAssessmentPayload) =>
      createAssessment(payload),
    onSuccess: (res) => {
      toast.success(res?.message || "Assessment created successfully!");
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message || err?.message || "Failed to create assessment",
      );
    },
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ICreateAssessmentPayload>;
    }) => updateAssessment(id, payload),
    onSuccess: (res, variables) => {
      toast.success(res?.message || "Assessment updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      queryClient.invalidateQueries({ queryKey: ["assessment", variables.id] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message || err?.message || "Failed to update assessment",
      );
    },
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteAssessment(id),
    onSuccess: (res) => {
      toast.success(res?.message || "Assessment deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message || err?.message || "Failed to delete assessment",
      );
    },
  });
}

export function useInviteCandidate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assessmentId,
      payload,
    }: {
      assessmentId: string;
      payload: IInviteCandidatePayload;
    }) => inviteCandidate(assessmentId, payload),
    onSuccess: (res, variables) => {
      toast.success(res?.message || "Candidate invited successfully!");
      queryClient.invalidateQueries({
        queryKey: ["assessment", variables.assessmentId],
      });
      // Invalidate recruiter profile to reflect deducted credit
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message || err?.message || "Failed to invite candidate",
      );
    },
  });
}
