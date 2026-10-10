"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createCheckoutSession,
  getPaymentHistory,
  verifyCheckoutSession,
} from "@/api";
import type { ICreateCheckoutSessionPayload, IPaymentFilters } from "@/types";

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateCheckoutSessionPayload) =>
      createCheckoutSession(payload),
    onSuccess: (res) => {
      console.log(res);
      if (res?.success && res?.data?.checkoutUrl) {
        window.location.href = res.data.checkoutUrl;
      }
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(
        err?.data?.message ||
          err?.message ||
          "Failed to initiate payment session",
      );
    },
  });
}

export function useVerifyCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => verifyCheckoutSession(sessionId),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
      if (res?.data?.creditsAdded) {
        toast.success(
          `Success! Added ${res.data.creditsAdded} credits to your account.`,
        );
      }
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      console.warn(
        "Payment session verify note:",
        err?.data?.message || err?.message,
      );
    },
  });
}

export function useGetPaymentHistory(filters?: IPaymentFilters) {
  return useQuery({
    queryKey: ["payment-history", filters],
    queryFn: () => getPaymentHistory(filters),
  });
}
