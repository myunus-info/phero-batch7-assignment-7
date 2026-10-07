"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "@tanstack/react-form";
import { useRegister } from "@/hooks/auth.hook";
import { registerSchema } from "@/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Briefcase, Code2, Eye, EyeClosed } from "lucide-react";
import GoogleLoginComponent from "@/components/auth/GoogleLogin";

export function RegisterForm() {
  const searchParams = useSearchParams();
  const roleParam = searchParams.get("role")?.toUpperCase();
  const initialRole: "CANDIDATE" | "RECRUITER" = roleParam === "RECRUITER" ? "RECRUITER" : "CANDIDATE";

  const [showPassword, setShowPassword] = useState(false);
  const registerMutation = useRegister();

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: initialRole,
      companyName: "",
    },
    validators: {
      onSubmit: registerSchema,
    },
    onSubmit: async ({ value }) => {
      registerMutation.mutate({
        name: value.name,
        email: value.email,
        password: value.password,
        role: value.role,
        companyName: value.role === "RECRUITER" ? value.companyName : undefined,
      });
    },
  });

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Create an account</h1>
        <p className="text-sm text-muted-foreground">Join DevJudge as a candidate or hiring team</p>
      </div>

      {/* Role Picker Tabs */}
      <form.Subscribe selector={state => state.values.role}>
        {currentRole => (
          <div className="grid grid-cols-2 gap-3 p-1 rounded-xl bg-muted border border-border">
            <button
              type="button"
              onClick={() => form.setFieldValue("role", "CANDIDATE")}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentRole === "CANDIDATE"
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Code2 className="h-4 w-4" />
              <span>Candidate</span>
            </button>
            <button
              type="button"
              onClick={() => form.setFieldValue("role", "RECRUITER")}
              className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                currentRole === "RECRUITER"
                  ? "bg-cyan-500 text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Briefcase className="h-4 w-4" />
              <span>Recruiter</span>
            </button>
          </div>
        )}
      </form.Subscribe>

      <form
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-4"
      >
        <FieldGroup>
          <form.Field name="name">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Full Name
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="text"
                    placeholder="Ada Lovelace"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="name"
                    disabled={registerMutation.isPending}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="email">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Email
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="name@company.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={e => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    autoComplete="email"
                    disabled={registerMutation.isPending}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Subscribe selector={state => state.values.role}>
            {currentRole =>
              currentRole === "RECRUITER" ? (
                <form.Field name="companyName">
                  {field => {
                    const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                    return (
                      <Field data-invalid={isInvalid}>
                        <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="text"
                          placeholder="Acme Corporation"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={e => field.handleChange(e.target.value)}
                          aria-invalid={isInvalid}
                          autoComplete="organization"
                          disabled={registerMutation.isPending}
                        />
                        {isInvalid && <FieldError errors={field.state.meta.errors} />}
                      </Field>
                    );
                  }}
                </form.Field>
              ) : null
            }
          </form.Subscribe>

          <form.Field name="password">
            {field => {
              const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name} required>
                    Password
                  </FieldLabel>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={e => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      autoComplete="new-password"
                      className="pr-10"
                      disabled={registerMutation.isPending}
                    />
                    <button
                      className="absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground hover:text-foreground transition-colors"
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                    >
                      {showPassword ? <EyeClosed className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <FieldDescription>Must be at least 6 characters long.</FieldDescription>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Subscribe selector={state => state.values.role}>
            {currentRole => (
              <Button
                type="submit"
                variant={currentRole === "RECRUITER" ? "cyan" : "emerald"}
                className="w-full disabled:cursor-not-allowed disabled:pointer-events-auto"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <>
                    <Spinner size="sm" /> Creating Account...
                  </>
                ) : (
                  `Sign Up as ${currentRole === "RECRUITER" ? "Recruiter" : "Candidate"}`
                )}
              </Button>
            )}
          </form.Subscribe>
        </FieldGroup>
      </form>

      {/* Google OAuth Signup */}
      <form.Subscribe selector={state => state.values.role}>
        {currentRole => (
          <div className="flex flex-col items-center justify-center pt-2 space-y-3">
            <div className="relative w-full flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative px-3 bg-background text-xs text-muted-foreground">
                Or sign up with Google as{" "}
                <span
                  className={
                    currentRole === "RECRUITER" ? "text-cyan-500 font-semibold" : "text-emerald-500 font-semibold"
                  }
                >
                  {currentRole === "RECRUITER" ? "Recruiter" : "Candidate"}
                </span>
              </div>
            </div>

            <GoogleLoginComponent role={currentRole} text="signup_with" />
          </div>
        )}
      </form.Subscribe>

      <div className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-emerald-500 hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default RegisterForm;
