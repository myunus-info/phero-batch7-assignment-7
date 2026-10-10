import apiClient from "@/lib/apiClient";
import type {
  IApiResponse,
  ICreateCheckoutSessionPayload,
  ICreateCheckoutSessionResponse,
  IPaymentFilters,
  IPaymentRecord,
  IVerifyCheckoutSessionResponse,
} from "@/types";

export function createCheckoutSession(payload: ICreateCheckoutSessionPayload) {
  return apiClient<IApiResponse<ICreateCheckoutSessionResponse>>(
    "/payments/create-checkout-session",
    {
      method: "POST",
      body: payload,
    },
  );
}

export function verifyCheckoutSession(sessionId: string) {
  return apiClient<IApiResponse<IVerifyCheckoutSessionResponse>>(
    "/payments/verify-session",
    {
      method: "POST",
      body: { sessionId },
    },
  );
}

export function getPaymentHistory(params?: IPaymentFilters) {
  return apiClient<IApiResponse<IPaymentRecord[]>>("/payments/my-history", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
