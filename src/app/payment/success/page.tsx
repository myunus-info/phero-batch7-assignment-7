"use client";

import confetti from "canvas-confetti";
import { ArrowRight, CheckCircle2, Coins, Loader2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useVerifyCheckoutSession } from "@/hooks";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const hasTriggeredVerification = useRef(false);

  const {
    mutate: verifySession,
    isPending: isVerifying,
    data: verifyResult,
  } = useVerifyCheckoutSession();

  useEffect(() => {
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore in SSR
    }
  }, []);

  useEffect(() => {
    if (sessionId && !hasTriggeredVerification.current) {
      hasTriggeredVerification.current = true;
      verifySession(sessionId);
    }
  }, [sessionId, verifySession]);

  const creditsAdded = verifyResult?.data?.creditsAdded;

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background text-foreground transition-colors duration-200">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center space-y-6 shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 mx-auto">
          {isVerifying ? (
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          ) : (
            <CheckCircle2 className="h-8 w-8" />
          )}
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {isVerifying ? "Verifying Payment..." : "Payment Successful!"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isVerifying
              ? "We are verifying your transaction with Stripe and crediting your balance..."
              : "Thank you for purchasing credits. Your recruiter account balance has been credited automatically."}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-center justify-center space-x-2 text-cyan-600 dark:text-cyan-400 font-mono text-sm">
          <Coins className="h-5 w-5" />
          <span>
            {creditsAdded
              ? `+${creditsAdded} Assessment Credits Added`
              : "Credits Ready for Candidate Invites"}
          </span>
        </div>

        <div className="pt-2">
          <Link href="/dashboard/recruiter/billing">
            <Button variant="emerald" className="w-full gap-2 font-semibold">
              <span>View Credit Balance</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
