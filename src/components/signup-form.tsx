"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitSignup, type SignupState } from "@/app/join/actions";
import { FinePrint } from "@/components/ui";

const INITIAL: SignupState = { status: "idle", message: "" };

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 inline-flex items-center justify-center rounded-full bg-cream px-8 py-4 text-[1.0625rem] font-bold text-forest transition-colors hover:bg-cream-raised disabled:opacity-60"
    >
      {pending ? "Sending…" : label}
    </button>
  );
}

export function SignupForm({
  audience = "student",
  label = "Get your link",
}: {
  audience?: "student" | "business";
  label?: string;
}) {
  const [state, action] = useActionState(submitSignup, INITIAL);

  return (
    <form action={action} className="grid gap-4" noValidate>
      <input type="hidden" name="audience" value={audience} />

      <Field name="full_name" label="Your full name" autoComplete="name" required />
      <Field
        name="phone"
        label="WhatsApp number"
        type="tel"
        autoComplete="tel"
        hint="This is where your campaigns arrive."
        required
      />
      <Field
        name="university"
        label={audience === "business" ? "Business name" : "University"}
        autoComplete="organization"
      />
      <Field name="email" label="Email (optional)" type="email" autoComplete="email" />

      {audience === "business" && (
        <label className="grid gap-1.5">
          <span className="font-bold text-cream">What do you need?</span>
          <textarea
            name="note"
            rows={3}
            className="rounded-2xl border-2 border-[color:var(--color-rule-reversed)] bg-forest-deep px-4 py-3 text-cream placeholder:text-cream/40"
          />
        </label>
      )}

      <Submit label={label} />

      {state.status !== "idle" && (
        <p
          role="status"
          aria-live="polite"
          className={`rounded-2xl px-4 py-3 font-bold ${
            state.status === "ok"
              ? "bg-cream text-forest"
              : "bg-error text-cream"
          }`}
        >
          {state.message}
        </p>
      )}

      <FinePrint tone="reversed">
        We use your number to send campaigns and earning updates on WhatsApp, and you
        can stop them at any time. Joining is free and does not guarantee any income.
      </FinePrint>
    </form>
  );
}

function Field({
  name,
  label,
  type = "text",
  hint,
  required,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  hint?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="grid gap-1.5">
      <span className="font-bold text-cream">
        {label}
        {required && <span className="sr-only"> (required)</span>}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        aria-describedby={hint ? `${name}-hint` : undefined}
        className="rounded-full border-2 border-[color:var(--color-rule-reversed)] bg-forest-deep px-5 py-3.5 text-cream placeholder:text-cream/40"
      />
      {hint && (
        <span id={`${name}-hint`} className="text-fine text-cream/70">
          {hint}
        </span>
      )}
    </label>
  );
}
