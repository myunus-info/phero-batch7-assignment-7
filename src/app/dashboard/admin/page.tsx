"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetDashboardStats } from "@/hooks";
import { KpiCards } from "@/components/admin/KpiCards";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { PassRateChart } from "@/components/admin/PassRateChart";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Users, ShieldAlert, ArrowRight } from "lucide-react";

export default function AdminDashboardPage() {
  const { data: statsData, isLoading } = useGetDashboardStats();
  const stats = statsData?.data;

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">System Administration</h1>
            <p className="text-sm text-slate-400">DevJudge platform health, revenue metrics, and user management.</p>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/dashboard/admin/problems/create">
              <Button variant="emerald" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                <span>Create Problem</span>
              </Button>
            </Link>
            <Link href="/dashboard/admin/users">
              <Button variant="outline" size="sm" className="gap-2">
                <Users className="h-4 w-4" />
                <span>Manage Users</span>
              </Button>
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        {isLoading || !stats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 rounded-xl bg-slate-900 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <KpiCards stats={stats} />
        )}

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RevenueChart />
          </div>
          <div>
            <PassRateChart />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/admin/audit-logs"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Security & Audit Logs</h4>
                <p className="text-xs text-slate-400">Review system actions and administrative events</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>

          <Link
            href="/dashboard/admin/problems"
            className="flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Problem Repository</h4>
                <p className="text-xs text-slate-400">Author and manage coding and MCQ test cases</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-400" />
          </Link>
        </div>
      </div>
    </RoleGuard>
  );
}
