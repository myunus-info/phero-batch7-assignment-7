"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { CreditPlans } from "@/components/billing/credit-plans";
import { useGetPaymentHistory, useGetMe } from "@/hooks";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Coins, CreditCard, History } from "lucide-react";

export default function RecruiterBillingPage() {
  const { data: user } = useGetMe();
  const { data: paymentsData, isLoading: isLoadingPayments } = useGetPaymentHistory();

  const credits = user?.recruiterProfile?.credits || 0;
  const payments = paymentsData?.data || [];

  return (
    <RoleGuard allowedRoles={["RECRUITER"]}>
      <div className="space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center space-x-2">
              <CreditCard className="h-6 w-6 text-emerald-500" />
              <span>Credit Wallet & Billing</span>
            </h1>
            <p className="text-sm text-muted-foreground">
              Purchase candidate assessment credits via Stripe. Each candidate invite consumes 1 credit.
            </p>
          </div>

          <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-800 dark:text-cyan-300 font-mono">
            <Coins className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
            <span className="text-lg font-bold">{credits}</span>
            <span className="text-xs text-muted-foreground">Available Credits</span>
          </div>
        </div>

        {/* Credit Packs */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Purchase Credit Packs</h2>
          <CreditPlans />
        </div>

        {/* Payment History */}
        <div className="space-y-4 pt-6 border-t border-border">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Payment Transaction History</h2>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice / ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Credits Added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingPayments ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Loading payment records...
                  </TableCell>
                </TableRow>
              ) : payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No payment transactions recorded yet.
                  </TableCell>
                </TableRow>
              ) : (
                payments.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {p.stripePaymentIntentId || p.id}
                    </TableCell>
                    <TableCell className="font-bold text-foreground whitespace-nowrap">
                      {formatCurrency(p.amount ?? (p.amountInCents || 0) / 100)}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap">
                      +{p.creditsPurchased ?? p.creditsAdded ?? 0} Credits
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {p.status === "COMPLETED" ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          COMPLETED
                        </span>
                      ) : p.status === "PENDING" ? (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                          PENDING
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
                          {p.status}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(p.createdAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </RoleGuard>
  );
}
