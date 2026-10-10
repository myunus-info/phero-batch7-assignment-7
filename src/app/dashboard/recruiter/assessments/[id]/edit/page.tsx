"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { AssessmentWizard } from "@/components/forms/AssessmentWizard";
import { useGetAssessmentById } from "@/hooks";

export default function EditAssessmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data: assessmentData, isLoading } = useGetAssessmentById(
    resolvedParams.id,
  );
  const assessment = assessmentData?.data;

  return (
    <RoleGuard allowedRoles={["RECRUITER"]}>
      <div className="space-y-6">
        <div>
          <Link
            href={`/dashboard/recruiter/assessments/${resolvedParams.id}`}
            className="inline-flex items-center space-x-1 text-xs text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Assessment</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Edit Assessment Campaign
          </h1>
          <p className="text-sm text-muted-foreground">
            Update test configuration, problem set, and candidate passing
            benchmarks.
          </p>
        </div>

        {isLoading ? (
          <div className="py-16 text-center text-muted-foreground">
            Loading assessment details...
          </div>
        ) : assessment ? (
          <AssessmentWizard initialData={assessment} isEditing={true} />
        ) : (
          <div className="py-16 text-center text-muted-foreground">
            Assessment not found.
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
