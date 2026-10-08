"use client";

import { use } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetProblemById } from "@/hooks";
import { ProblemForm } from "@/components/forms/ProblemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3 } from "lucide-react";

export default function RecruiterEditProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: problemData, isLoading } = useGetProblemById(resolvedParams.id);
  const problem = problemData?.data;

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
        <div className="space-y-6 max-w-4xl animate-pulse">
          <div className="h-8 w-40 bg-muted rounded" />
          <div className="h-10 w-64 bg-muted rounded" />
          <div className="h-64 w-full bg-muted rounded-xl" />
        </div>
      </RoleGuard>
    );
  }

  if (!problem) {
    return (
      <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
        <div className="p-8 text-center space-y-4">
          <p className="text-muted-foreground">Problem not found or could not be loaded.</p>
          <Link href="/dashboard/recruiter/problems">
            <Button variant="outline" size="sm">
              Back to Problem Studio
            </Button>
          </Link>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link href={`/dashboard/recruiter/problems/${problem.id}`}>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Problem Details</span>
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-cyan-500" />
            <span>Edit Problem: {problem.title}</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update problem details, difficulty, points, execution limits, and test cases.
          </p>
        </div>

        <ProblemForm
          mode="edit"
          initialProblem={problem}
          redirectPath={`/dashboard/recruiter/problems/${problem.id}`}
        />
      </div>
    </RoleGuard>
  );
}
