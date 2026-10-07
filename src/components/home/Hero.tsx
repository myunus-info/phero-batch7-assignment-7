import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code2 } from "lucide-react";

export function Hero() {
  return (
    <div className="relative overflow-hidden py-20 md:py-28">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-87.5 w-w-150 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl">
        <div className="inline-flex items-center space-x-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 mb-6">
          <span>Real-time Judge0 Execution Engine</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Evaluate Developer Talent with{" "}
          <span className="bg-linear-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Automated Code Judges
          </span>
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-slate-400 leading-relaxed max-w-2xl mx-auto">
          Create custom coding assessments, grade multi-language solutions against hidden test cases, and hire top
          software engineers with absolute confidence.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register">
            <Button variant="emerald" size="lg" className="gap-2 w-full sm:w-auto font-semibold">
              <span>Start Free Trial</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/problems">
            <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
              <Code2 className="h-4 w-4" />
              <span>Explore Problem Bank</span>
            </Button>
          </Link>
        </div>

        {/* Quick Demo Preview Stats */}
        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-800/80 text-left">
          <div>
            <p className="text-2xl font-bold font-mono text-emerald-400">5+ Langs</p>
            <p className="text-xs text-slate-400 mt-1">JS, TS, Python, C++, Java</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-cyan-400">&lt; 800ms</p>
            <p className="text-xs text-slate-400 mt-1">Average execution latency</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-indigo-400">100% Secure</p>
            <p className="text-xs text-slate-400 mt-1">Isolated sandbox runner</p>
          </div>
          <div>
            <p className="text-2xl font-bold font-mono text-amber-400">Zero Fluff</p>
            <p className="text-xs text-slate-400 mt-1">Auto-scored test verdicts</p>
          </div>
        </div>
      </div>
    </div>
  );
}
