"use client";

import { useCreateCheckoutSession } from "@/hooks";
import { Button } from "@/components/ui/button";
import { Check, Coins } from "lucide-react";
import { CreditPlanKey } from "@/types";

interface PlanConfig {
  key: CreditPlanKey;
  name: string;
  price: string;
  credits: number;
  description: string;
  popular?: boolean;
  features: string[];
}

const CREDIT_PLANS: PlanConfig[] = [
  {
    key: "STARTER",
    name: "Starter Pack",
    price: "$29",
    credits: 50,
    description: "Ideal for small teams hiring their first few engineers.",
    features: [
      "50 Candidate Test Credits",
      "Full Code Judge Execution",
      "Automated MCQ Grading",
      "Email Invitation Links",
      "Standard Email Support",
    ],
  },
  {
    key: "GROWTH",
    name: "Growth Plan",
    price: "$79",
    credits: 200,
    popular: true,
    description: "Designed for scaling startups with active technical hiring.",
    features: [
      "200 Candidate Test Credits",
      "Instant Test Case Runner (Judge0)",
      "Detailed Performance Analytics",
      "Custom Problem Bank Support",
      "Priority Support & Export Results",
    ],
  },
  {
    key: "ENTERPRISE",
    name: "Scale Enterprise",
    price: "$199",
    credits: 600,
    description: "For agencies and high-volume recruiting operations.",
    features: [
      "600 Candidate Test Credits",
      "Dedicated Proctoring & Audit Logs",
      "Bulk Candidate Invites",
      "Custom Domain & Branding",
      "24/7 Dedicated Account Manager",
    ],
  },
];

export function CreditPlans() {
  const checkoutMutation = useCreateCheckoutSession();

  const handleBuy = (planKey: CreditPlanKey) => {
    checkoutMutation.mutate({ planKey, planName: planKey });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {CREDIT_PLANS.map(plan => (
        <div
          key={plan.key}
          className={`relative flex flex-col justify-between rounded-2xl border p-6 transition-all duration-200 ${
            plan.popular
              ? "border-emerald-500 bg-card shadow-xl shadow-emerald-500/10 ring-1 ring-emerald-500"
              : "border-border bg-card hover:border-emerald-500/40 shadow-sm"
          }`}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-500 px-3 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
              Most Popular
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{plan.description}</p>
            </div>

            <div className="flex items-baseline space-x-1">
              <span className="text-3xl font-extrabold text-foreground">{plan.price}</span>
              <span className="text-xs text-muted-foreground font-mono">/ one-time</span>
            </div>

            <div className="flex items-center space-x-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <Coins className="h-4 w-4" />
              <span>{plan.credits} Assessment Credits included</span>
            </div>

            <div className="space-y-2 pt-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                What&apos;s included:
              </p>
              <ul className="space-y-2">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center space-x-2 text-xs text-foreground">
                    <Check className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-border">
            <Button
              variant={plan.popular ? "emerald" : "outline"}
              className="w-full"
              onClick={() => handleBuy(plan.key)}
              isLoading={checkoutMutation.isPending}
            >
              Purchase with Stripe
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
