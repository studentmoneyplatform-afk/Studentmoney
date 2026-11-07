import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Buttons. Forest or cream only — hibiscus is reserved for money, so it is
 * deliberately not an option here.
 */
export function Button({
  href,
  children,
  variant = "solid",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline" | "cream";
  size?: "md" | "lg";
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-full font-bold transition-colors";
  const sizing = size === "lg" ? "px-8 py-4 text-[1.0625rem]" : "px-6 py-3 text-base";
  const look = {
    solid: "bg-forest text-cream hover:bg-forest-deep",
    outline: "border-2 border-forest text-forest hover:bg-forest hover:text-cream",
    cream: "bg-cream text-forest hover:bg-cream-raised",
  }[variant];

  return (
    <Link href={href} className={`${base} ${sizing} ${look} ${className}`}>
      {children}
    </Link>
  );
}

export function Eyebrow({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "reversed" | "accent";
}) {
  const colour = {
    default: "text-moss",
    reversed: "text-cream/70",
    accent: "text-hibiscus-light",
  }[tone];
  return <p className={`eyebrow ${colour}`}>{children}</p>;
}

export function Section({
  children,
  tone = "cream",
  className = "",
  id,
}: {
  children: ReactNode;
  tone?: "cream" | "forest" | "raised";
  className?: string;
  id?: string;
}) {
  const colour = {
    cream: "bg-cream text-ink",
    raised: "bg-cream-raised text-ink",
    forest: "bg-forest text-cream",
  }[tone];
  return (
    <section id={id} className={`${colour} ${className}`}>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        {children}
      </div>
    </section>
  );
}

export function Card({
  children,
  tone = "raised",
  className = "",
}: {
  children: ReactNode;
  tone?: "raised" | "forest" | "outline" | "ink";
  className?: string;
}) {
  const colour = {
    raised: "bg-cream-raised text-ink",
    outline: "border-2 border-ink/15 text-ink",
    forest: "bg-forest text-cream",
    ink: "bg-ink text-cream",
  }[tone];
  return (
    <div className={`rounded-[var(--radius-card)] p-6 sm:p-8 ${colour} ${className}`}>
      {children}
    </div>
  );
}

export function H2({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2 className={`font-display text-[2rem] sm:text-headline ${className}`}>
      {children}
    </h2>
  );
}

export function Lede({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={`max-w-2xl text-body-lg leading-relaxed ${className}`}>{children}</p>
  );
}

/** Fine print. Every earning claim on this site carries its rule beside it. */
export function FinePrint({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "reversed";
}) {
  return (
    <p
      className={`text-fine leading-relaxed ${
        tone === "reversed" ? "text-cream/70" : "text-moss"
      }`}
    >
      {children}
    </p>
  );
}
