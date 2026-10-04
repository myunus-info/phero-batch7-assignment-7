import { PublicHeader } from "@/components/layout/public/Header";
import { PublicFooter } from "@/components/layout/public/Footer";
import { Hero } from "@/components/home/Hero";
import { LiveJudgeDemo } from "@/components/home/LiveJudgeDemo";
import { Features } from "@/components/home/Features";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#090d16]">
      <PublicHeader />

      <main className="flex-1">
        <Hero />
        <LiveJudgeDemo />
        <Features />

        {/* Bottom CTA */}
        <div className="py-20 border-t border-slate-800 bg-linear-to-b from-slate-950 to-[#090d16]">
          <div className="container mx-auto px-4 sm:px-6 text-center max-w-3xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Ready to Upgrade Your Engineering Hiring?
            </h2>
            <p className="mt-4 text-slate-400 text-base leading-relaxed">
              Join leading tech teams assessing candidates in real-time with automated code judges. Get
              started in minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register">
                <Button variant="emerald" size="lg" className="gap-2 font-semibold w-full sm:w-auto">
                  <span>Create Recruiter Account</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In with Demo Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
