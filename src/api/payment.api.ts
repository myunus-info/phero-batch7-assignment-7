import apiClient from "@/lib/apiClient";
import {
  IApiResponse,
  ICreateCheckoutSessionPayload,
  ICreateCheckoutSessionResponse,
  IPaymentFilters,
  IPaymentRecord,
} from "@/types";

export function createCheckoutSession(payload: ICreateCheckoutSessionPayload) {
  return apiClient<IApiResponse<ICreateCheckoutSessionResponse>>("/payments/create-checkout-session", {
    method: "POST",
    body: payload,
  });
}

export function getPaymentHistory(params?: IPaymentFilters) {
  return apiClient<IApiResponse<IPaymentRecord[]>>("/payments/my-history", {
    params: params as Record<string, string | number | boolean | undefined>,
  });
}
