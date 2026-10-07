import { Spinner } from "@/components/ui/spinner";

export default function GlobalLoading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center space-y-3 bg-background text-muted-foreground transition-colors duration-200">
      <Spinner size="lg" />
      <p className="font-mono text-xs">Loading DevJudge...</p>
    </div>
  );
}
