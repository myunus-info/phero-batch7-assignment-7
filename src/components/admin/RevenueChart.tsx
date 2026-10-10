"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

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
    <div className="rounded-xl border border-border bg-card p-6 space-y-4 shadow-sm transition-colors duration-200">
      <div>
        <h3 className="text-base font-semibold text-foreground">
          Monthly Revenue
        </h3>
        <p className="text-xs text-muted-foreground">
          Stripe volume processed from recruiter credit packs (USD)
        </p>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-border"
            />
            <XAxis
              dataKey="month"
              stroke="currentColor"
              className="text-muted-foreground"
              fontSize={12}
            />
            <YAxis
              stroke="currentColor"
              className="text-muted-foreground"
              fontSize={12}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
              formatter={(value) => [`$${value}`, "Revenue"]}
            />
            <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
