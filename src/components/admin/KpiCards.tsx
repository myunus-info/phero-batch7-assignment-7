import { IDashboardStats } from "@/types/admin.type";
import { Users, FileCheck2, DollarSign, Activity } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface KpiCardsProps {
  stats: IDashboardStats;
}

export function KpiCards({ stats }: KpiCardsProps) {
  const totalUsers = stats.totalUsers ?? stats.overview?.totalUsers ?? 0;
  const candidateCount = stats.candidateCount ?? stats.overview?.totalCandidates ?? 0;
  const recruiterCount = stats.recruiterCount ?? stats.overview?.totalRecruiters ?? 0;
  const totalAssessments = stats.totalAssessments ?? stats.overview?.totalAssessments ?? 0;
  const completedAttempts = stats.completedAttempts ?? stats.overview?.totalPassedAttempts ?? 0;
  const totalRevenue = stats.totalRevenueInCents
    ? stats.totalRevenueInCents / 100
    : (stats.revenue?.totalRevenueUSD ?? 0);
  const passRate = stats.overallPassRate ?? stats.overview?.passRate ?? "0";

  const cards = [
    {
      title: "Total Registered Users",
      value: totalUsers.toLocaleString(),
      subtext: `${candidateCount} candidates • ${recruiterCount} recruiters`,
      icon: Users,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Assessments Created",
      value: totalAssessments.toLocaleString(),
      subtext: `${completedAttempts} completed submissions`,
      icon: FileCheck2,
      color: "text-cyan-400",
      bg: "bg-cyan-500/10 border-cyan-500/20",
    },
    {
      title: "Gross Revenue",
      value: formatCurrency(totalRevenue),
      subtext: "Stripe test mode volume",
      icon: DollarSign,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "System Pass Rate",
      value: typeof passRate === "number" ? `${passRate}%` : `${passRate}`,
      subtext: "Average across all technical tests",
      icon: Activity,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{card.title}</span>
              <div className={`p-2 rounded-lg border ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight text-white">{card.value}</p>
              <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
