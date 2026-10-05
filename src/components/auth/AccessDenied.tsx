import { ShieldAlert, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AccessDenied({
  title = "Access Restricted",
  message = "You do not have permission to access this portal or resource.",
}: {
  title?: string;
  message?: string;
}) {
  return (
    <div className="flex h-[80vh] w-full items-center justify-center p-6 text-center">
      <div className="flex max-w-md flex-col items-center gap-4 rounded-2xl border border-red-500/20 bg-red-950/20 p-8 text-slate-100 shadow-xl backdrop-blur-sm">
        <div className="rounded-full bg-red-500/10 p-4 text-red-400 ring-1 ring-red-500/30">
          <ShieldAlert className="size-10" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-white">{title}</h1>
        <p className="text-sm leading-relaxed text-slate-400">{message}</p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:bg-slate-700"
        >
          <ArrowLeft className="size-4" /> Return to Home
        </Link>
      </div>
    </div>
  );
}
