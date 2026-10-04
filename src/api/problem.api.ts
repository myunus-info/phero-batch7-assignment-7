import apiClient from "@/lib/apiClient";
import { IApiResponse, ICreateProblemPayload, IProblem, IProblemFilters } from "@/types";

export function getAllProblems(params?: IProblemFilters) {
  return apiClient<IApiResponse<IProblem[]>>("/problems", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getProblemById(id: string) {
  return apiClient<IApiResponse<IProblem>>(`/problems/${id}`);
}

export function createProblem(payload: ICreateProblemPayload) {
  return apiClient<IApiResponse<IProblem>>("/problems", {
    method: "POST",
    body: payload,
  });
}

export function updateProblem(id: string, payload: Partial<ICreateProblemPayload>) {
  return apiClient<IApiResponse<IProblem>>(`/problems/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteProblem(id: string) {
  return apiClient<IApiResponse<IProblem>>(`/problems/${id}`, {
    method: "DELETE",
  });
}
