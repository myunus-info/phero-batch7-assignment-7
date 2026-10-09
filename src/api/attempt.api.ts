import apiClient from "@/lib/apiClient";
import {
  IApiResponse,
  IAssessmentResult,
  ICandidateAssessmentItem,
  IFinishAssessmentResponse,
  IStartAttemptResponse,
  ISubmitProblemPayload,
  ISubmitProblemResponse,
} from "@/types";

export function getMyCandidateAssessments() {
  return apiClient<IApiResponse<ICandidateAssessmentItem[]>>("/attempts/my-assessments");
}

export function startAssessmentAttempt(assessmentId: string) {
  return apiClient<IApiResponse<IStartAttemptResponse>>(`/attempts/${assessmentId}/start`, {
    method: "POST",
  });
}

export function submitProblemSolution(assessmentId: string, payload: ISubmitProblemPayload) {
  return apiClient<IApiResponse<ISubmitProblemResponse>>(`/attempts/${assessmentId}/submit-problem`, {
    method: "POST",
    body: payload,
  });
}

export function runProblemCode(assessmentId: string, payload: ISubmitProblemPayload) {
  return apiClient<IApiResponse<ISubmitProblemResponse>>(`/attempts/${assessmentId}/run-code`, {
    method: "POST",
    body: payload,
  });
}

export function finishAssessment(assessmentId: string) {
  return apiClient<IApiResponse<IFinishAssessmentResponse>>(`/attempts/${assessmentId}/finish`, {
    method: "POST",
  });
}

export function getAssessmentResult(assessmentId: string) {
  return apiClient<IApiResponse<IAssessmentResult>>(`/attempts/${assessmentId}/result`);
}
