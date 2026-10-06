"use client";

import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { ProblemForm } from "@/components/forms/ProblemForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileCode2 } from "lucide-react";

export default function RecruiterCreateProblemPage() {
  return (
    <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/recruiter/problems">
            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Studio</span>
            </Button>
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileCode2 className="h-6 w-6 text-emerald-400" />
            <span>Create New Problem</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Author an executable coding problem with automated test cases or multiple-choice questions.
          </p>
        </div>

        <ProblemForm mode="create" redirectPath="/dashboard/recruiter/problems" />
      </div>
    </RoleGuard>
  );
}
