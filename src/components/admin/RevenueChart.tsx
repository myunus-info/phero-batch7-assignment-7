"use client";

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface RevenueChartProps {
  data?: { month: string; revenue: number }[];
}

const DEFAULT_DATA = [
  { month: "Jan", revenue: 1200 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2400 },
  { month: "Apr", revenue: 3100 },
  { month: "May", revenue: 4200 },
  { month: "Jun", revenue: 5800 },
];

export function RevenueChart({ data = DEFAULT_DATA }: RevenueChartProps) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-white">Monthly Revenue</h3>
        <p className="text-xs text-slate-400">Stripe volume processed from recruiter credit packs (USD)</p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
            <YAxis stroke="#64748b" fontSize={12} tickFormatter={val => `$${val}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              formatter={value => [`$${value}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
