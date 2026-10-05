import apiClient from "@/lib/apiClient";
import {
  IApiResponse,
  IAssessment,
  IAssessmentCandidate,
  IAssessmentFilters,
  ICreateAssessmentPayload,
  IInviteCandidatePayload,
} from "@/types";

export function getAllAssessments(params?: IAssessmentFilters) {
  return apiClient<IApiResponse<IAssessment[]>>("/assessments", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}

export function getAssessmentById(id: string) {
  return apiClient<IApiResponse<IAssessment>>(`/assessments/${id}`);
}

export function createAssessment(payload: ICreateAssessmentPayload) {
  return apiClient<IApiResponse<IAssessment>>("/assessments", {
    method: "POST",
    body: payload,
  });
}

export function updateAssessment(id: string, payload: Partial<ICreateAssessmentPayload>) {
  return apiClient<IApiResponse<IAssessment>>(`/assessments/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function deleteAssessment(id: string) {
  return apiClient<IApiResponse<IAssessment>>(`/assessments/${id}`, {
    method: "DELETE",
  });
}

export function inviteCandidate(assessmentId: string, payload: IInviteCandidatePayload) {
  return apiClient<IApiResponse<IAssessmentCandidate>>(`/assessments/${assessmentId}/invite`, {
    method: "POST",
    body: payload,
  });
}
