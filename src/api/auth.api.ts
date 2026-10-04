import apiClient from "@/lib/apiClient";
import { IApiResponse } from "@/types/api.type";
import { IUserProfile } from "@/types/user.type";

export function getMe() {
  return apiClient<IApiResponse<IUserProfile>>("/users/me");
}

export function logoutUser() {
  return apiClient<IApiResponse<null>>("/auth/logout", {
    method: "POST",
  });
}
