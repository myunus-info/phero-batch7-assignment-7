import Link from "next/link";
import Logo from "@/assets/svg/Logo";

export function PublicFooter() {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Logo className="h-7 w-auto" />
              <span className="font-mono text-lg font-bold tracking-tight text-white">
                Dev<span className="text-emerald-400">Judge</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated code judge & technical interview platform. Real-time code execution, MCQ testing, and
              proctoring analytics.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/problems" className="hover:text-emerald-400 transition-colors">
                  Problem Bank
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-emerald-400 transition-colors">
                  Pricing Plans
                </Link>
              </li>
              <li>
                <Link href="/recruiter" className="hover:text-emerald-400 transition-colors">
                  Recruiter Suite
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Roles</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Admin Portal
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-emerald-400 transition-colors">
                  Candidate Arena
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono">
                  v1.0.0 Production
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} DevJudge. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono">Powered by Judge0 & Next.js App Router</p>
        </div>
      </div>
    </footer>
  );
}
