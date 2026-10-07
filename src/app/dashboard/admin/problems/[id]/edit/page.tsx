"use client";

import { use, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useGetProblemById, useDeleteProblem } from "@/hooks";
import { ProblemForm } from "@/components/forms/ProblemForm";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-dialog";
import { ArrowLeft, Edit3, Trash2 } from "lucide-react";

export default function RecruiterEditProblemPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { data: problemData, isLoading } = useGetProblemById(resolvedParams.id);
  const deleteMutation = useDeleteProblem();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const problem = problemData?.data;

  const handleDelete = () => {
    if (!problem) return;
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!problem) return;
    deleteMutation.mutate(problem.id, {
      onSuccess: () => {
        setDeleteModalOpen(false);
        router.push("/dashboard/recruiter/problems");
      },
    });
  };

  if (isLoading) {
    return (
      <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
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
      <RoleGuard allowedRoles={["RECRUITER", "ADMIN"]}>
        <div className="p-8 text-center space-y-4">
          <p className="text-slate-400">Problem not found or could not be loaded.</p>
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
            <Button variant="ghost" size="sm" className="gap-2 text-slate-400 hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Problem Details</span>
            </Button>
          </Link>

          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete Problem</span>
          </Button>
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Edit3 className="h-6 w-6 text-cyan-400" />
            <span>Edit Problem: {problem.title}</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Update problem details, difficulty, points, execution limits, and test cases.
          </p>
        </div>

        <ProblemForm
          mode="edit"
          initialProblem={problem}
          redirectPath={`/dashboard/recruiter/problems/${problem.id}`}
        />

        <DeleteConfirmationModal
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          itemType="problem"
          itemName={problem?.title}
          isLoading={deleteMutation.isPending}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </RoleGuard>
  );
}
