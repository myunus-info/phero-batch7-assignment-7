"use client";

import { FieldGroup, Field, FieldLabel, FieldDescription, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export interface StepBasicsProps {
  form: any;
  onNext: () => void;
}

export function StepBasics({ form, onNext }: StepBasicsProps) {
  return (
    <div className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground">Assessment Information</h2>

      <FieldGroup>
        <form.Field name="title">
          {(field: any) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} required>
                  Title
                </FieldLabel>
                <Input
                  id={field.name}
                  name={field.name}
                  placeholder="e.g. Senior Frontend Engineer Technical Screen"
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <form.Field name="durationMinutes">
            {(field: any) => (
              <Field>
                <FieldLabel htmlFor={field.name} required>
                  Duration (Minutes)
                </FieldLabel>
                <FieldDescription>Maximum time allowed once a candidate begins.</FieldDescription>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={15}
                  max={240}
                  value={field.state.value}
                  onChange={e => field.handleChange(Number(e.target.value))}
                  required
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="passingMarks">
            {(field: any) => (
              <Field>
                <FieldLabel htmlFor={field.name} required>
                  Passing Marks (%)
                </FieldLabel>
                <FieldDescription>Minimum percentage to mark candidate as Passed.</FieldDescription>
                <Input
                  id={field.name}
                  name={field.name}
                  type="number"
                  min={1}
                  max={100}
                  value={field.state.value}
                  onChange={e => field.handleChange(Number(e.target.value))}
                  required
                />
              </Field>
            )}
          </form.Field>
        </div>

        <form.Field name="description">
          {(field: any) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name} required>
                  Description & Instructions
                </FieldLabel>
                <Textarea
                  id={field.name}
                  name={field.name}
                  rows={4}
                  placeholder="Please complete all questions before the timer expires. You may submit code multiple times."
                  value={field.state.value}
                  onChange={e => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                  required
                />
                {isInvalid && <FieldError errors={field.state.meta.errors} />}
              </Field>
            );
          }}
        </form.Field>
      </FieldGroup>

      <div className="flex justify-end pt-4">
        <form.Subscribe
          selector={(state: any) => ({
            title: state.values.title,
            description: state.values.description,
          })}
        >
          {({ title, description }: { title: string; description: string }) => (
            <Button
              variant="emerald"
              disabled={!title?.trim() || !description?.trim()}
              onClick={onNext}
              className="gap-2"
            >
              <span>Next: Select Problems</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </form.Subscribe>
      </div>
    </div>
  );
}

export default StepBasics;
