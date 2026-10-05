import { Loader2 } from "lucide-react";

export default function AuthLoading({ label = "Authenticating session..." }: { label?: string }) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-slate-100">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="size-8 animate-spin text-emerald-400" />
        <p className="text-sm font-medium text-slate-400">{label}</p>
      </div>
    </div>
  );
}
