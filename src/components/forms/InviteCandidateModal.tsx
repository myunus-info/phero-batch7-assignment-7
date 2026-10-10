"use client";

import { useForm } from "@tanstack/react-form";
import { AlertCircle, Calendar, Coins, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useGetMe, useInviteCandidate } from "@/hooks";
import { inviteCandidateSchema } from "@/validations";

interface InviteCandidateModalProps {
  assessmentId: string;
  assessmentTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteCandidateModal({
  assessmentId,
  assessmentTitle,
  open,
  onOpenChange,
}: InviteCandidateModalProps) {
  const { data: user } = useGetMe();
  const credits = user?.recruiterProfile?.credits ?? 0;
  const hasCredits = credits > 0;
  const inviteMutation = useInviteCandidate();

  const form = useForm({
    defaultValues: {
      candidateEmail: "",
      expiresAt: "",
    },
    validators: {
      onSubmit: inviteCandidateSchema,
    },
    onSubmit: async ({ value }) => {
      inviteMutation.mutate(
        {
          assessmentId,
          payload: {
            email: value.candidateEmail,
            candidateEmail: value.candidateEmail,
            expiresAt: value.expiresAt
              ? new Date(value.expiresAt).toISOString()
              : undefined,
          },
        },
        {
          onSuccess: () => {
            form.reset();
            onOpenChange(false);
          },
        },
      );
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogHeader>
          <DialogTitle>Invite Candidate</DialogTitle>
          <DialogDescription>
            Send an assessment invitation for{" "}
            <strong className="text-foreground">{assessmentTitle}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          {hasCredits ? (
            <div className="flex items-center justify-between p-3 mb-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300">
              <div className="flex items-center space-x-2">
                <Coins className="h-4 w-4 shrink-0 text-cyan-600 dark:text-cyan-400" />
                <span>
                  Available Credits:{" "}
                  <strong className="text-foreground">{credits}</strong> (1
                  credit deducted per invite)
                </span>
              </div>
              <Link
                href="/dashboard/recruiter/billing"
                className="underline text-[11px] text-cyan-700 dark:text-cyan-200 hover:underline"
                onClick={() => onOpenChange(false)}
              >
                Buy More
              </Link>
            </div>
          ) : (
            <div className="flex items-start space-x-2 p-3 mb-4 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-700 dark:text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-500 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-foreground">
                  0 Assessment Credits Available
                </p>
                <p className="mt-0.5 text-muted-foreground">
                  You need at least 1 credit to invite candidates.
                </p>
                <Link
                  href="/dashboard/recruiter/billing"
                  className="inline-block mt-2 font-semibold text-cyan-600 dark:text-cyan-400 underline hover:opacity-80"
                  onClick={() => onOpenChange(false)}
                >
                  Purchase Credits in Billing &rarr;
                </Link>
              </div>
            </div>
          )}

          <FieldGroup>
            <form.Field name="candidateEmail">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name} required>
                      Candidate Email
                    </FieldLabel>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-slate-300 z-10" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="candidate@example.com"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        disabled={inviteMutation.isPending || !hasCredits}
                        required
                      />
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="expiresAt">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Invitation Expiration Date (Optional)
                    </FieldLabel>
                    <div className="relative">
                      <Calendar className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-slate-300 z-10" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="datetime-local"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        disabled={inviteMutation.isPending || !hasCredits}
                      />
                    </div>
                    <FieldDescription>
                      Assessment will expire after this date if not completed.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={inviteMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="cyan"
            disabled={inviteMutation.isPending || !hasCredits}
            className="disabled:cursor-not-allowed disabled:pointer-events-auto"
          >
            {inviteMutation.isPending ? (
              <>
                <Spinner size="sm" /> Sending...
              </>
            ) : !hasCredits ? (
              "Insufficient Credits"
            ) : (
              "Send Invitation"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Dialog>
  );
}

export default InviteCandidateModal;
