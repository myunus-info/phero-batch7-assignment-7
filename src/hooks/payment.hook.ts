"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createCheckoutSession, getPaymentHistory } from "@/api/payment.api";
import { ICreateCheckoutSessionPayload, IPaymentFilters } from "@/types";

export function useCreateCheckoutSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ICreateCheckoutSessionPayload) => createCheckoutSession(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-history"] });
    },
    onError: (err: { data?: { message?: string }; message?: string }) => {
      toast.error(err?.data?.message || err?.message || "Failed to initiate payment session");
    },
  });
}

export function useGetPaymentHistory(filters?: IPaymentFilters) {
  return useQuery({
    queryKey: ["payment-history", filters],
    queryFn: () => getPaymentHistory(filters),
  });
}
