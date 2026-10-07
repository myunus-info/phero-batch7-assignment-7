"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { CreateProblemForm } from "@/components/forms/CreateProblemForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateProblemPage() {
  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6">
        <div>
          <Link
            href="/dashboard/admin/problems"
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Problem Bank</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create New Problem</h1>
          <p className="text-sm text-slate-400">Define executable coding challenges or multiple choice questions.</p>
        </div>

        <CreateProblemForm />
      </div>
    </RoleGuard>
  );
}
