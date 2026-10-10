import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-8">
      <Suspense
        fallback={
          <div className="h-96 w-full max-w-md animate-pulse bg-muted rounded-2xl" />
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}
