"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getMyProfile, updateMyProfile } from "@/api/user.api";
import { IUpdateProfilePayload } from "@/types";

export function useGetMyProfile() {
  return useQuery({
    queryKey: ["my-profile"],
    queryFn: getMyProfile,
  });
}

export function useUpdateMyProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: IUpdateProfilePayload) => updateMyProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("Profile updated successfully!");
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || "Failed to update profile");
    },
  });
}
