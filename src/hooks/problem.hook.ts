"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createProblem,
  deleteProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
} from "@/api/problem.api";
import type { ICreateProblemPayload, IProblemFilters } from "@/types";

export function useGetAllProblems(filters?: IProblemFilters) {
  return useQuery({
    queryKey: ["problems", filters],
    queryFn: () => getAllProblems(filters),
  });
}

export function useGetProblemById(id: string) {
  return useQuery({
    queryKey: ["problem", id],
    queryFn: () => getProblemById(id),
    enabled: !!id,
  });
}

export function useCreateProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateProblemPayload) => createProblem(payload),
    onSuccess: (res) => {
      toast.success(res?.message || "Problem created successfully!");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message || err?.message || "Failed to create problem",
      );
    },
  });
}

export function useUpdateProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Partial<ICreateProblemPayload>;
    }) => updateProblem(id, payload),
    onSuccess: (res, variables) => {
      toast.success(res?.message || "Problem updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
      queryClient.invalidateQueries({ queryKey: ["problem", variables.id] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message || err?.message || "Failed to update problem",
      );
    },
  });
}

export function useDeleteProblem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProblem(id),
    onSuccess: (res) => {
      toast.success(res?.message || "Problem deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message || err?.message || "Failed to delete problem",
      );
    },
  });
}
