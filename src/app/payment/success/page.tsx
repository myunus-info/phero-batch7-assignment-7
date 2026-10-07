"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Coins, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

export default function PaymentSuccessPage() {
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

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background text-foreground transition-colors duration-200">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center space-y-6 shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500 mx-auto">
          <CheckCircle2 className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Payment Successful!</h1>
          <p className="text-sm text-muted-foreground">
            Thank you for purchasing credits. Your recruiter account balance has been credited automatically.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-4 flex items-center justify-center space-x-2 text-cyan-600 dark:text-cyan-400 font-mono text-sm">
          <Coins className="h-5 w-5" />
          <span>Credits Ready for Candidate Invites</span>
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
