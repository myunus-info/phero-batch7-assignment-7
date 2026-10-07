import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center bg-background text-foreground transition-colors duration-200">
      <div className="p-4 rounded-full bg-muted text-muted-foreground mb-4 border border-border">
        <FileQuestion className="h-10 w-10 text-emerald-500" />
      </div>

      <h1 className="text-4xl font-extrabold text-foreground mb-2 font-mono">404</h1>
      <h2 className="text-xl font-semibold text-foreground mb-2">Page Not Found</h2>
      <p className="text-sm text-muted-foreground max-w-sm mb-6">
        The assessment, problem, or page you were looking for does not exist or has been moved.
      </p>

      <Link href="/">
        <Button variant="emerald" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          <span>Return Home</span>
        </Button>
      </Link>
    </div>
  );
}
