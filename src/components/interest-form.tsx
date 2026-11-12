"use client";

import { useActionState } from "react";
import { registerInterest, type InterestState } from "@/app/(site)/invite/actions";

const INITIAL: InterestState = { status: "idle", message: "" };

/**
 * One name, one way to reach them. Nothing else is asked, because this is
 * somebody else's data being typed in by the person who referred them, and
 * the fewer fields there are the less of it we are holding on a maybe.
 */
export function InterestForm({
  code,
  partner,
}: {
  code: string;
  partner: string;
}) {
  const [state, action, pending] = useActionState(registerInterest, INITIAL);

  if (state.status === "ok") {
    return (
      <div className="rounded-[1.25rem] border-2 border-success/40 bg-success/5 p-6">
        <p className="font-display text-[1.15rem]">Got it.</p>
        <p className="mt-2 text-[color:var(--ink-2)]">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={action} className="grid gap-4" noValidate>
      <input type="hidden" name="code" value={code} />

      <label className="grid gap-1.5">
        <span className="text-caption font-bold">Your name</span>
        <input
          name="label"
          autoComplete="name"
          required
          className="rounded-[0.9rem] border border-[color:var(--hair-strong)] bg-paper px-4 py-3 outline-none transition-colors focus:border-forest"
        />
      </label>

      <label className="grid gap-1.5">
        <span className="text-caption font-bold">Phone number or email</span>
        <input
          name="contact"
          autoComplete="tel"
          required
          placeholder="08012345678"
          className="rounded-[0.9rem] border border-[color:var(--hair-strong)] bg-paper px-4 py-3 outline-none transition-colors focus:border-forest"
        />
        <span className="text-micro text-[color:var(--ink-3)]">
          One is enough. We pass it to {partner} so they can contact you about this,
          and to the person whose link you used so they know you came through.
        </span>
      </label>

      {state.status === "error" && (
        <p role="alert" className="text-caption font-bold text-[color:var(--color-error)]">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-forest px-6 py-3 font-bold text-[color:var(--on-dark-1)] transition-colors hover:bg-forest-deep disabled:opacity-60"
      >
        {pending ? "Sending…" : "I am interested"}
      </button>
    </form>
  );
}
