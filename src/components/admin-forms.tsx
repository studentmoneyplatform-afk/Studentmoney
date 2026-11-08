"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  recordPayment,
  reviewReferral,
  saveOpportunity,
  setVerified,
  type AdminState,
} from "@/app/admin/actions";

const INITIAL: AdminState = { status: "idle", message: "" };

function Submit({ label, tone = "solid" }: { label: string; tone?: "solid" | "quiet" | "danger" }) {
  const { pending } = useFormStatus();
  const look = {
    solid: "bg-forest text-[color:var(--on-dark-1)] hover:bg-forest-deep",
    quiet: "border border-[color:var(--hair-strong)] hover:border-[color:var(--ink-1)]",
    danger: "border border-[color:var(--color-error)] text-[color:var(--color-error)] hover:bg-error/5",
  }[tone];
  return (
    <button
      type="submit"
      disabled={pending}
      className={`rounded-full px-4 py-2 text-caption font-bold transition-colors disabled:opacity-60 ${look}`}
    >
      {pending ? "Working…" : label}
    </button>
  );
}

function Message({ state }: { state: AdminState }) {
  if (state.status === "idle") return null;
  return (
    <p
      role="status"
      aria-live="polite"
      className={`mt-2 text-caption font-bold ${
        state.status === "ok"
          ? "text-[color:var(--color-success)]"
          : "text-[color:var(--color-error)]"
      }`}
    >
      {state.message}
    </p>
  );
}

/** Approve, or reject with a reason the student will read. */
export function ReviewControls({ id }: { id: string }) {
  const [state, action] = useActionState(reviewReferral, INITIAL);

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="id" value={id} />
      <input
        name="reason"
        placeholder="Reason, if rejecting"
        className="min-w-[12rem] flex-1 rounded-full border border-[color:var(--hair-strong)] bg-paper px-4 py-2 text-caption"
      />
      <button
        type="submit"
        name="decision"
        value="approved"
        className="rounded-full bg-forest px-4 py-2 text-caption font-bold text-[color:var(--on-dark-1)] transition-colors hover:bg-forest-deep"
      >
        Approve
      </button>
      <button
        type="submit"
        name="decision"
        value="rejected"
        className="rounded-full border border-[color:var(--color-error)] px-4 py-2 text-caption font-bold text-[color:var(--color-error)] transition-colors hover:bg-error/5"
      >
        Reject
      </button>
      <Message state={state} />
    </form>
  );
}

export function PaymentForm({
  participationId,
  outstanding,
}: {
  participationId: string;
  outstanding: number;
}) {
  const [state, action] = useActionState(recordPayment, INITIAL);

  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="participation_id" value={participationId} />
      <input
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        max={outstanding}
        defaultValue={outstanding > 0 ? outstanding.toFixed(2) : ""}
        className="w-28 rounded-full border border-[color:var(--hair-strong)] bg-paper px-4 py-2 text-caption"
        aria-label="Amount in dollars"
      />
      <input
        name="rate"
        type="number"
        step="1"
        placeholder="₦ rate"
        className="w-24 rounded-full border border-[color:var(--hair-strong)] bg-paper px-3 py-2 text-caption"
        aria-label="Naira rate"
      />
      <input
        name="reference"
        placeholder="Reference"
        className="w-36 rounded-full border border-[color:var(--hair-strong)] bg-paper px-4 py-2 text-caption"
        aria-label="Payment reference"
      />
      <Submit label="Record" />
      <Message state={state} />
    </form>
  );
}

export function VerifyToggle({ studentId, verified }: { studentId: string; verified: boolean }) {
  const [state, action] = useActionState(setVerified, INITIAL);

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="student_id" value={studentId} />
      <input type="hidden" name="verified" value={verified ? "false" : "true"} />
      <Submit label={verified ? "Remove verification" : "Verify"} tone={verified ? "danger" : "solid"} />
      <Message state={state} />
    </form>
  );
}

export function OpportunityForm({
  slug,
  name,
  partner,
  summary,
  whatYouDo,
  status,
}: {
  slug: string;
  name: string;
  partner: string;
  summary: string;
  whatYouDo: string;
  status: string;
}) {
  const [state, action] = useActionState(saveOpportunity, INITIAL);

  return (
    <form action={action} className="grid gap-3">
      <input type="hidden" name="slug" value={slug} />
      <Field name="name" label="Name" defaultValue={name} />
      <Field name="partner" label="Partner" defaultValue={partner} />
      <Field name="summary" label="Summary" defaultValue={summary} textarea />
      <Field name="what_you_do" label="What the student does" defaultValue={whatYouDo} textarea />
      <label className="grid gap-1.5">
        <span className="text-micro font-bold uppercase tracking-widest text-[color:var(--ink-3)]">
          Status
        </span>
        <select
          name="status"
          defaultValue={status}
          className="rounded-[var(--radius-md)] border border-[color:var(--hair-strong)] bg-paper px-4 py-2.5 text-caption"
        >
          <option value="live">Live</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
        </select>
      </label>
      <div className="mt-2 flex items-center gap-3">
        <Submit label="Save" />
        <Message state={state} />
      </div>
    </form>
  );
}

function Field({
  name,
  label,
  defaultValue,
  textarea,
}: {
  name: string;
  label: string;
  defaultValue: string;
  textarea?: boolean;
}) {
  const cls =
    "rounded-[var(--radius-md)] border border-[color:var(--hair-strong)] bg-paper px-4 py-2.5 text-caption";
  return (
    <label className="grid gap-1.5">
      <span className="text-micro font-bold uppercase tracking-widest text-[color:var(--ink-3)]">
        {label}
      </span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={3} className={cls} />
      ) : (
        <input name={name} defaultValue={defaultValue} className={cls} />
      )}
    </label>
  );
}
