"use client";

import { getMe, logoutUser } from "@/api/auth.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useGetMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    select: (res) => res?.data,
    staleTime: 1000 * 60 * 5, // 5 mins
    retry: false,
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
