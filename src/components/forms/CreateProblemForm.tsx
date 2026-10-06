"use client";

import { ProblemForm } from "./ProblemForm";

export function CreateProblemForm({
  redirectPath = "/dashboard/recruiter/problems",
}: {
  redirectPath?: string;
} = {}) {
  return <ProblemForm mode="create" redirectPath={redirectPath} />;
}

export default CreateProblemForm;
