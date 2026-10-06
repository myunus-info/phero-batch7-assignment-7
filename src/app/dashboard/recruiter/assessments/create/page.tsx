import { RoleGuard } from "@/components/auth/RoleGuard";
import { AssessmentWizard } from "@/components/forms/AssessmentWizard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CreateAssessmentPage() {
  return (
    <RoleGuard allowedRoles={["RECRUITER"]}>
      <div className="space-y-6">
        <div>
          <Link
            href="/recruiter/assessments"
            className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white mb-2"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Assessments</span>
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-white">Create Assessment Campaign</h1>
          <p className="text-sm text-slate-400">
            Configure test parameters, select problem sets, and set benchmark cutoffs.
          </p>
        </div>

        <AssessmentWizard />
      </div>
    </RoleGuard>
  );
}
