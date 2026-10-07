import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background text-foreground transition-colors duration-200">
      <div className="max-w-md w-full rounded-2xl border border-border bg-card p-8 text-center space-y-6 shadow-lg">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/20 text-red-500 mx-auto">
          <XCircle className="h-8 w-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Payment Cancelled</h1>
          <p className="text-sm text-muted-foreground">
            No charges were incurred. You can return to your billing page anytime to select another package.
          </p>
        </div>

        <div className="pt-2">
          <Link href="/dashboard/recruiter/billing">
            <Button variant="outline" className="w-full gap-2 font-semibold">
              <ArrowLeft className="h-4 w-4" />
              <span>Return to Billing</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
