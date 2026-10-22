"use client";

// EXAMPLE: a client component. "use client" means this code also runs in the
// browser, which it needs so it can show errors and a loading state.

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { type AddLinkState, addLink } from "./actions";

const initialState: AddLinkState = { status: "idle" };

export function AddLinkForm() {
  const [state, formAction, pending] = useActionState(addLink, initialState);
  const errors = state.status === "error" ? state.errors : {};
  const values = state.status === "error" ? state.values : {};

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Field id="title" label="Title" error={errors.title}>
        <Input
          id="title"
          name="title"
          defaultValue={values.title}
          placeholder="Workshop 2 slides"
          aria-invalid={Boolean(errors.title)}
        />
      </Field>

      <Field id="url" label="Web address" error={errors.url}>
        <Input
          id="url"
          name="url"
          defaultValue={values.url}
          placeholder="https://"
          aria-invalid={Boolean(errors.url)}
        />
      </Field>

      <Field id="tag" label="Tag" error={errors.tag}>
        <Input
          id="tag"
          name="tag"
          defaultValue={values.tag}
          placeholder="slides"
          aria-invalid={Boolean(errors.tag)}
        />
      </Field>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Checking..." : "Add"}
        </Button>
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {state.status === "success" &&
            `"${state.link.title}" passed every check. A real project would save it now.`}
        </p>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
