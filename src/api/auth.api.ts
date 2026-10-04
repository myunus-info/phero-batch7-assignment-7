import apiClient from "@/lib/apiClient";
import {
  IApiResponse,
  IAuthUser,
  IGoogleLoginPayload,
  ILoginPayload,
  ILoginResponse,
  IRegisterPayload,
  IUserProfile,
} from "@/types";

export function loginUser(payload: ILoginPayload) {
  return apiClient<IApiResponse<ILoginResponse>>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

export function registerUser(payload: IRegisterPayload) {
  return apiClient<IApiResponse<{ user: IAuthUser }>>("/auth/register", {
    method: "POST",
    body: payload,
  });
}

export function googleLoginUser(payload: IGoogleLoginPayload) {
  return apiClient<IApiResponse<ILoginResponse>>("/auth/google", {
    method: "POST",
    body: payload,
  });
}

export function logoutUser() {
  return apiClient<IApiResponse<null>>("/auth/logout", {
    method: "POST",
  });
}

export function refreshToken(token?: string) {
  return apiClient<IApiResponse<{ accessToken: string }>>("/auth/refresh-token", {
    method: "POST",
    body: token ? { refreshToken: token } : {},
  });
}

export function getMe() {
  return apiClient<IApiResponse<IUserProfile>>("/users/me");
}
