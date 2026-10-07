"use client";

import { use } from "react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetProblemById } from "@/hooks/problem.hook";
import { ProblemForm } from "@/components/forms/ProblemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit3 } from "lucide-react";

export default function AdminEditProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: problemData, isLoading } = useGetProblemById(resolvedParams.id);
  const problem = problemData?.data;

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <div className="space-y-6 max-w-4xl animate-pulse">
          <div className="h-8 w-40 bg-slate-800 rounded" />
          <div className="h-10 w-64 bg-slate-800 rounded" />
          <div className="h-64 w-full bg-slate-900/60 rounded-xl" />
        </div>
      </RoleGuard>
    );
  }

  if (!problem) {
    return (
      <RoleGuard allowedRoles={["ADMIN"]}>
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-400">Problem not found or could not be loaded.</p>
          <Link href="/dashboard/admin/problems">
            <Button variant="outline" size="sm">
              Back to Problems
            </Button>
          </Link>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/admin/problems">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Problems</span>
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-cyan-400" />
            <span>Edit Problem: {problem.title}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Update problem title, description, difficulty, points, code starter, and test cases.
          </p>
        </div>

        <ProblemForm mode="edit" initialProblem={problem} redirectPath="/dashboard/admin/problems" />
      </div>
    </RoleGuard>
  );
}
