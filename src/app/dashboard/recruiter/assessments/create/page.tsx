"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { AssessmentWizard } from "@/components/forms/AssessmentWizard";

export default function CreateAssessmentPage() {
  return (
    <RoleGuard allowedRoles={["RECRUITER"]}>
      <div className="space-y-6">
        <div>
          <Link
            href="/dashboard/recruiter/assessments"
            className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Assessments</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Create Assessment Campaign
          </h1>
          <p className="text-sm text-muted-foreground">
            Configure test parameters, select problem sets, and set benchmark
            cutoffs.
          </p>
        </div>

        <AssessmentWizard />
      </div>
    </RoleGuard>
  );
}
