import Logo from "@/assets/svg/Logo";
import { CheckCircle2, Zap, Terminal } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 py-16 max-w-4xl space-y-12">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Logo className="h-12 w-auto" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">About DevJudge</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Built to make technical screening fast, objective, and unbiased through containerized automated code judging.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-sm">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 w-fit text-emerald-500">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Our Mission</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Eliminate hours of manual code reviews by letting candidates prove their problem-solving ability in live,
            isolated execution sandboxes.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 space-y-3 shadow-sm">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 w-fit text-cyan-500">
            <Terminal className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Execution Engine</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We use Judge0 infrastructure with strict memory and CPU isolation limits to ensure test submissions run
            safely and deterministically.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-8 space-y-4 shadow-sm">
        <h3 className="text-xl font-bold text-foreground">Core Architectural Tenets</h3>
        <ul className="space-y-3 text-sm text-foreground">
          <li className="flex items-center space-x-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Strict Role Separation: Admin, Recruiter, and Candidate isolation.</span>
          </li>
          <li className="flex items-center space-x-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Zero-Trust Security: Hidden test cases are never transmitted to candidate clients.</span>
          </li>
          <li className="flex items-center space-x-3">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>Real-Time Webhooks: Stripe checkout sessions credit organizations instantly.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
