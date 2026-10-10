import apiClient from "@/lib/apiClient";
import type {
  IApiResponse,
  IUpdateProfilePayload,
  IUserProfile,
} from "@/types";

export function getMyProfile() {
  return apiClient<IApiResponse<IUserProfile>>("/users/me");
}

export function updateMyProfile(payload: IUpdateProfilePayload) {
  return apiClient<IApiResponse<IUserProfile>>("/users/me", {
    method: "PATCH",
    body: payload,
  });
}
