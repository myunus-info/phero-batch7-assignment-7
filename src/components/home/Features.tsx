import {
  BarChart3,
  CheckCircle,
  Code2,
  Coins,
  ShieldAlert,
  Users,
} from "lucide-react";

export function Features() {
  const features = [
    {
      title: "Automated Sandbox Testing",
      desc: "Every candidate code submission is securely executed inside isolated containers against your hidden test cases.",
      icon: Code2,
      color: "text-emerald-500",
    },
    {
      title: "Adaptive MCQ & Coding Suites",
      desc: "Mix algorithm problem-solving with conceptual multiple choice questions in a single unified candidate test.",
      icon: CheckCircle,
      color: "text-cyan-500",
    },
    {
      title: "Anti-Cheating & Integrity",
      desc: "Proctored environment tracks tab switches, copy-paste events, and submission timestamps automatically.",
      icon: ShieldAlert,
      color: "text-amber-500",
    },
    {
      title: "Granular Candidate Analytics",
      desc: "Review time spent per problem, memory efficiency, pass percentages, and full source code replays.",
      icon: BarChart3,
      color: "text-indigo-500",
    },
    {
      title: "Flexible Credit Packages",
      desc: "No long-term contracts. Purchase candidate test credits seamlessly through Stripe when your hiring spikes.",
      icon: Coins,
      color: "text-emerald-500",
    },
    {
      title: "Role-Based Team Portals",
      desc: "Dedicated workspaces tailored specifically for Admins, Hiring Recruiters, and Interviewing Candidates.",
      icon: Users,
      color: "text-cyan-500",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold text-foreground">
            Built for Modern Engineering Hiring
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Everything you need to screen hundreds of engineering candidates
            without wasting hours of senior engineers&apos; time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 space-y-3 hover:border-emerald-500/50 shadow-sm transition-colors duration-200"
              >
                <div className="p-3 rounded-lg bg-muted border border-border w-fit">
                  <Icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="text-lg font-bold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
