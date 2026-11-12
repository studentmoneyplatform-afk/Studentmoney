"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { completeProfile, type ProfileState } from "@/app/welcome/actions";
import { FinePrint } from "@/components/ui";

const INITIAL: ProfileState = { status: "idle", message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex items-center justify-center rounded-full bg-cream px-8 py-4 text-[1.0625rem] font-bold text-forest transition-colors hover:bg-paper-2 disabled:opacity-60"
    >
      {pending ? "Saving…" : "Finish joining"}
    </button>
  );
}

export function ProfileForm({
  defaultName = "",
  defaultUniversity = "",
}: {
  defaultName?: string;
  defaultUniversity?: string;
}) {
  const [state, action] = useActionState(completeProfile, INITIAL);

  return (
    <form action={action} className="grid gap-4" noValidate>
      <Field name="full_name" label="Your full name" defaultValue={defaultName} autoComplete="name" />
      <Field
        name="phone"
        label="WhatsApp number"
        type="tel"
        autoComplete="tel"
        hint="Campaigns and earning updates arrive here."
      />
      <Field
        name="university"
        label="University or organisation"
        defaultValue={defaultUniversity}
        autoComplete="organization"
      />

      <Submit />

      {state.status === "error" && (
        <p role="alert" className="rounded-2xl bg-error px-4 py-3 font-bold text-[color:var(--on-dark-1)]">
          {state.message}
        </p>
      )}

      <FinePrint tone="reversed">
        You can stop marketing messages at any time and still receive the updates about
        money you have earned.
      </FinePrint>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  hint,
  defaultValue,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  hint?: string;
  defaultValue?: string;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-bold text-[color:var(--on-dark-1)]">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        autoComplete={autoComplete}
        aria-describedby={hint ? `${name}-hint` : undefined}
        className="rounded-full border-2 border-[color:var(--hair-reversed)] bg-forest-deep px-5 py-3.5 text-[color:var(--on-dark-1)] placeholder:text-[color:var(--on-dark-1)]/40"
      />
      {hint && (
        <span id={`${name}-hint`} className="text-caption text-[color:var(--on-dark-1)]/70">
          {hint}
        </span>
      )}
    </label>
  );
}
