"use client";

import { useForm } from "@tanstack/react-form";
import { useInviteCandidate } from "@/hooks/assessment.hook";
import { inviteCandidateSchema } from "@/validations";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Mail, Calendar, Coins } from "lucide-react";

interface InviteCandidateModalProps {
  assessmentId: string;
  assessmentTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteCandidateModal({ assessmentId, assessmentTitle, open, onOpenChange }: InviteCandidateModalProps) {
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
            expiresAt: value.expiresAt ? new Date(value.expiresAt).toISOString() : undefined,
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
        onSubmit={e => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <DialogHeader>
          <DialogTitle>Invite Candidate</DialogTitle>
          <DialogDescription>
            Send an assessment invitation for <strong className="text-white">{assessmentTitle}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="my-4">
          <div className="flex items-center space-x-2 p-3 mb-4 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-300">
            <Coins className="h-4 w-4 shrink-0" />
            <span>Inviting a candidate consumes 1 Recruiter credit.</span>
          </div>

          <FieldGroup>
            <form.Field name="candidateEmail">
              {field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Candidate Email</FieldLabel>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="email"
                        placeholder="candidate@example.com"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        disabled={inviteMutation.isPending}
                      />
                    </div>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="expiresAt">
              {field => {
                const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Invitation Expiration Date (Optional)</FieldLabel>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                      <Input
                        id={field.name}
                        name={field.name}
                        type="datetime-local"
                        value={field.state.value}
                        onChange={e => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        aria-invalid={isInvalid}
                        className="pl-9"
                        disabled={inviteMutation.isPending}
                      />
                    </div>
                    <FieldDescription>Assessment will expire after this date if not completed.</FieldDescription>
                    {isInvalid && <FieldError errors={field.state.meta.errors} />}
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
            disabled={inviteMutation.isPending}
            className="disabled:cursor-not-allowed disabled:pointer-events-auto"
          >
            {inviteMutation.isPending ? (
              <>
                <Spinner size="sm" /> Sending...
              </>
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
