import { Spinner } from "@/components/ui/spinner";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center space-y-3 bg-[#090d16] text-slate-400">
      <Spinner size="lg" />
      <p className="font-mono text-xs">Loading DevJudge...</p>
    </div>
  );
}
