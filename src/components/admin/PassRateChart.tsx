"use client";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

interface PassRateChartProps {
  passCount?: number;
  failCount?: number;
}

export function PassRateChart({ passCount = 76, failCount = 24 }: PassRateChartProps) {
  const data = [
    { name: "Passed", value: passCount, color: "#10b981" },
    { name: "Failed / Incomplete", value: failCount, color: "#ef4444" },
  ];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
      <div>
        <h3 className="text-base font-semibold text-white">Assessment Outcomes</h3>
        <p className="text-xs text-slate-400">Proportion of candidates passing benchmark cutoffs</p>
      </div>

      <div className="h-64 w-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "8px",
                color: "#f8fafc",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={value => <span className="text-xs text-slate-300">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
