import { Code2, ShieldAlert, BarChart3, Coins, Users, CheckCircle } from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Automated Sandbox Testing",
      desc: "Every candidate code submission is securely executed inside isolated containers against your hidden test cases.",
      icon: Code2,
      color: "text-emerald-400",
    },
    {
      title: "Adaptive MCQ & Coding Suites",
      desc: "Mix algorithm problem-solving with conceptual multiple choice questions in a single unified candidate test.",
      icon: CheckCircle,
      color: "text-cyan-400",
    },
    {
      title: "Anti-Cheating & Integrity",
      desc: "Proctored environment tracks tab switches, copy-paste events, and submission timestamps automatically.",
      icon: ShieldAlert,
      color: "text-amber-400",
    },
    {
      title: "Granular Candidate Analytics",
      desc: "Review time spent per problem, memory efficiency, pass percentages, and full source code replays.",
      icon: BarChart3,
      color: "text-indigo-400",
    },
    {
      title: "Flexible Credit Packages",
      desc: "No long-term contracts. Purchase candidate test credits seamlessly through Stripe when your hiring spikes.",
      icon: Coins,
      color: "text-emerald-400",
    },
    {
      title: "Role-Based Team Portals",
      desc: "Dedicated workspaces tailored specifically for Admins, Hiring Recruiters, and Interviewing Candidates.",
      icon: Users,
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-white">Built for Modern Engineering Hiring</h2>
          <p className="mt-4 text-slate-400 leading-relaxed">
            Everything you need to screen hundreds of engineering candidates without wasting hours of senior
            engineers&apos; time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3 hover:border-slate-700 transition-colors"
              >
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 w-fit">
                  <Icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-bold text-white">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
