"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useGetAllProblems } from "@/hooks/problem.hook";
import { useCreateAssessment, useUpdateAssessment } from "@/hooks/assessment.hook";
import { assessmentWizardFormSchema } from "@/validations";
import { IAssessment } from "@/types";
import { toast } from "sonner";
import { StepIndicator, StepBasics, StepProblems, StepReview } from "./assessment-wizard";

interface AssessmentWizardProps {
  initialData?: IAssessment;
  isEditing?: boolean;
}

export function AssessmentWizard({ initialData, isEditing = false }: AssessmentWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);

  const { data: problemsData, isLoading: isLoadingProblems } = useGetAllProblems({
    limit: 50,
  });
  const createAssessmentMutation = useCreateAssessment();
  const updateAssessmentMutation = useUpdateAssessment();

  const isSubmitting = createAssessmentMutation.isPending || updateAssessmentMutation.isPending;

  const initialProblemIds =
    initialData?.problems?.map(p => p.problem.id) || initialData?.assessmentProblems?.map(p => p.problem.id) || [];

  const form = useForm({
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      durationMinutes: initialData?.durationMinutes || 60,
      passingMarks:
        initialData?.totalMarks && initialData.passingMarks && initialData.totalMarks > 0
          ? Math.round((initialData.passingMarks / initialData.totalMarks) * 100)
          : initialData?.passingMarks ?? 70,
      selectedProblemIds: initialProblemIds,
    },
    validators: {
      onSubmit: assessmentWizardFormSchema,
    },
    onSubmit: async () => {
      handlePublish();
    },
  });

  const problems = problemsData?.data || [];

  const handlePublish = () => {
    const values = form.state.values;

    if (!values.title || values.title.trim().length < 3) {
      toast.error("Assessment title must be at least 3 characters.");
      setStep(1);
      return;
    }

    if (!values.description || !values.description.trim()) {
      toast.error("Please provide instructions or description for the assessment.");
      setStep(1);
      return;
    }

    const duration = Number(values.durationMinutes);
    if (!duration || duration <= 0) {
      toast.error("Duration must be a positive number in minutes.");
      setStep(1);
      return;
    }

    const passingMarks = Number(values.passingMarks);
    if (!passingMarks || passingMarks <= 0 || passingMarks > 100) {
      toast.error("Passing score must be between 1 and 100 percent.");
      setStep(1);
      return;
    }

    if (!values.selectedProblemIds || values.selectedProblemIds.length === 0) {
      toast.error("Please select at least one problem to include in this assessment.");
      setStep(2);
      return;
    }

    const selectedProblems = problems.filter(p => values.selectedProblemIds.includes(p.id));
    const totalPoints = selectedProblems.reduce((sum, p) => sum + p.points, 0);

    const formattedProblemIds = values.selectedProblemIds.map((id, index) => ({
      problemId: id,
      orderIndex: index + 1,
    }));

    const totalMarks = totalPoints || 100;
    const calculatedPassingMarks = Math.max(1, Math.round((passingMarks / 100) * totalMarks));

    if (isEditing && initialData?.id) {
      updateAssessmentMutation.mutate(
        {
          id: initialData.id,
          payload: {
            title: values.title.trim(),
            description: values.description.trim(),
            durationMinutes: duration,
            passingMarks: calculatedPassingMarks,
            totalMarks: totalMarks,
            problemIds: formattedProblemIds,
          },
        },
        {
          onSuccess: () => {
            router.push(`/dashboard/recruiter/assessments/${initialData.id}`);
          },
        },
      );
    } else {
      createAssessmentMutation.mutate(
        {
          title: values.title.trim(),
          description: values.description.trim(),
          durationMinutes: duration,
          passingMarks: calculatedPassingMarks,
          totalMarks: totalMarks,
          problemIds: formattedProblemIds,
        },
        {
          onSuccess: () => {
            router.push(`/dashboard/recruiter/assessments`);
          },
        },
      );
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      {/* Step Indicator Header */}
      <StepIndicator currentStep={step} onStepClick={setStep} />

      {/* Step 1: Basics */}
      {step === 1 && <StepBasics form={form} onNext={() => setStep(2)} />}

      {/* Step 2: Select Problems */}
      {step === 2 && (
        <StepProblems
          form={form}
          problems={problems}
          isLoadingProblems={isLoadingProblems}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}

      {/* Step 3: Review & Schedule */}
      {step === 3 && (
        <form.Subscribe
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          selector={(state: any) => ({
            values: state.values,
          })}
        >
          {({ values }: { values: typeof form.state.values }) => (
            <StepReview
              values={values}
              problems={problems}
              isEditing={isEditing}
              isSubmitting={isSubmitting}
              onBack={() => setStep(2)}
              onPublish={handlePublish}
            />
          )}
        </form.Subscribe>
      )}
    </div>
  );
}

export default AssessmentWizard;
