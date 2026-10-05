"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMe, googleLoginUser, loginUser, logoutUser, registerUser } from "@/api/auth.api";
import { IGoogleLoginPayload, ILoginPayload, IRegisterPayload } from "@/types";
import { useRouter } from "next/navigation";

export function useGetMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    select: res => res?.data,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ILoginPayload) => loginUser(payload),
    onSuccess: res => {
      toast.success(res.message || "Signed in successfully!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || "Invalid credentials");
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: IRegisterPayload) => registerUser(payload),
    onSuccess: res => {
      toast.success(res.message || "Account registered successfully! Please log in.");
      router.replace("/login");
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || "Registration failed");
    },
  });
}

export function useGoogleOAuth() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IGoogleLoginPayload) => googleLoginUser(payload),
    onSuccess: res => {
      console.log(res);
      toast.success(res.message || "Signed in with Google!");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || "Google sign-in failed");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => logoutUser(),
    onSuccess: () => {
      queryClient.setQueryData(["me"], null);
      queryClient.clear();
      toast.success("Signed out successfully");
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || "Failed to sign out");
    },
  });
}
