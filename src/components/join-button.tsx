"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { joinOpportunity, type JoinState } from "@/app/dashboard/actions";

const INITIAL: JoinState = { status: "idle", message: "" };

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-forest px-5 py-2.5 text-caption font-bold text-[color:var(--on-dark-1)] transition-colors hover:bg-forest-deep disabled:opacity-60"
    >
      {pending ? "Joining…" : label}
    </button>
  );
}

export function JoinButton({ slug, label = "Join and get my link" }: { slug: string; label?: string }) {
  const [state, action] = useActionState(joinOpportunity, INITIAL);

  return (
    <form action={action} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="slug" value={slug} />
      <Submit label={label} />
      {state.status !== "idle" && (
        <p
          role="status"
          aria-live="polite"
          className={`text-caption font-bold ${
            state.status === "ok" ? "text-[color:var(--color-success)]" : "text-[color:var(--color-error)]"
          }`}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
