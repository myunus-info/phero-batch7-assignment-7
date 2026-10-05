import { IPaginationParams } from "./api.type";

export type CreditPlanKey = "STARTER" | "GROWTH" | "ENTERPRISE" | "STARTER_PACK" | "PRO_PACK" | "ENTERPRISE_PACK";

export type PaymentStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";

export interface ICreditPlan {
  name: CreditPlanKey;
  title: string;
  credits: number;
  amount: number;
  description: string;
  badge?: string;
  features: string[];
}

export interface ICreateCheckoutSessionPayload {
  planName?: CreditPlanKey;
  planKey?: CreditPlanKey;
}

export interface ICreateCheckoutSessionResponse {
  paymentId: string;
  sessionId: string;
  checkoutUrl: string;
  plan?: {
    name: CreditPlanKey;
    title: string;
    amount: number;
    currency: string;
    credits: number;
  };
}

export interface IPaymentRecord {
  id: string;
  userId: string;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  amount: number;
  amountInCents: number;
  currency: string;
  creditsPurchased: number;
  creditsAdded: number;
  planName: string;
  status: PaymentStatus;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export type IPaymentFilters = IPaginationParams;
