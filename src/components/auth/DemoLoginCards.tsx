"use client";

import { useLogin } from "@/hooks";
import { ShieldCheck, Briefcase, Code2, Sparkles } from "lucide-react";

export function DemoLoginCards() {
  const loginMutation = useLogin();

  const handleDemoLogin = (email: string, password: string) => {
    loginMutation.mutate({ email, password });
  };

  const demoAccounts = [
    {
      role: "Admin",
      email: "admin@devjudge.com",
      password: "Admin@123456",
      desc: "Full system & user access, audit logs, revenue",
      icon: ShieldCheck,
      badgeColor: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
    },
    {
      role: "Recruiter",
      email: "recruiter@techcorp.com",
      password: "Recruiter@123456",
      desc: "Create assessments, invite candidates, buy credits",
      icon: Briefcase,
      badgeColor: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
    },
    {
      role: "Candidate",
      email: "candidate@devjudge.com",
      password: "Candidate@123456",
      desc: "Take assessments, live code editor, view results",
      icon: Code2,
      badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-4 w-4 text-emerald-500" />
        <span>One-Click Demo Accounts</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {demoAccounts.map(account => {
          const Icon = account.icon;
          return (
            <button
              key={account.role}
              type="button"
              disabled={loginMutation.isPending}
              onClick={() => handleDemoLogin(account.email, account.password)}
              className="flex flex-col items-start p-3 text-left rounded-lg border border-border bg-muted/40 hover:bg-muted hover:border-emerald-500/30 transition-all group disabled:opacity-50 cursor-pointer"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className={`text-xs px-1.5 py-0.5 rounded border font-medium ${account.badgeColor}`}>
                  {account.role}
                </span>
                <Icon className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
              <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1">{account.desc}</p>
              <span className="mt-2 text-[11px] font-mono text-emerald-500 font-medium group-hover:underline">
                Quick Log In →
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
