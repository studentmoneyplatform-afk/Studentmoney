import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Shared primitives in the Stormm language: cream ground, deep green
 * surfaces, one bright green accent, generous radii and soft shadows.
 *
 * Prop names are unchanged from the previous system so every page inherits
 * the new look without being rewritten.
 */

type Surface = "paper" | "paper-2" | "cream" | "forest";

const SURFACE: Record<Surface, string> = {
  paper: "bg-paper text-ink",
  "paper-2": "bg-paper-2 text-ink",
  cream: "bg-cream text-ink",
  forest: "bg-forest text-paper",
};

export function Section({
  children,
  tone = "paper",
  className = "",
  id,
  width = "default",
}: {
  children: ReactNode;
  tone?: Surface;
  className?: string;
  id?: string;
  width?: "default" | "wide" | "narrow";
}) {
  const max = { default: "max-w-[82rem]", wide: "max-w-[90rem]", narrow: "max-w-3xl" }[width];

  return (
    <section id={id} className={`${SURFACE[tone]} ${className}`}>
      <div className={`mx-auto w-full ${max} px-5 py-16 sm:px-8 sm:py-24`}>{children}</div>
    </section>
  );
}

export function Button({
  href,
  children,
  variant = "solid",
  size = "md",
  className = "",
  arrow = true,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
  arrow?: boolean;
}) {
  const sizing = {
    sm: "px-4 py-2 text-caption",
    md: "px-5 py-2.5 text-[0.9375rem]",
    lg: "px-7 py-3.5 text-[1.0625rem]",
  }[size];

  const look = {
    solid: "bg-forest text-paper hover:bg-forest-deep",
    ghost: "border border-forest/30 text-forest hover:border-forest hover:bg-green-wash/60",
    light: "bg-paper text-forest hover:bg-white",
  }[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-extrabold transition-all duration-200 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-0.5 ${sizing} ${look} ${className}`}
    >
      {children}
      {arrow && <span aria-hidden="true">→</span>}
    </Link>
  );
}

/** The small uppercase label above a heading. */
export function Eyebrow({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "reversed";
}) {
  return (
    <p
      className={`text-[0.75rem] font-extrabold uppercase tracking-[0.14em] ${
        tone === "reversed" ? "text-green-bright" : "text-green"
      }`}
    >
      {children}
    </p>
  );
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`font-display text-[clamp(1.875rem,3.1vw,2.75rem)] ${className}`}>
      {children}
    </h2>
  );
}

export function Lede({
  children,
  className = "",
  tone = "default",
}: {
  children: ReactNode;
  className?: string;
  tone?: "default" | "reversed";
}) {
  return (
    <p
      className={`max-w-2xl text-[1.0625rem] leading-relaxed sm:text-lead ${
        tone === "reversed" ? "text-paper/80" : "text-ink/75"
      } ${className}`}
    >
      {children}
    </p>
  );
}

export function Card({
  children,
  tone = "paper",
  className = "",
  interactive = false,
  id,
}: {
  children: ReactNode;
  tone?: Surface | "outline";
  className?: string;
  interactive?: boolean;
  id?: string;
}) {
  const look =
    tone === "forest"
      ? "bg-forest text-paper"
      : tone === "cream"
        ? "bg-cream ring-1 ring-ink/5"
        : tone === "outline"
          ? "border border-ink/12 bg-paper/60"
          : tone === "paper-2"
            ? "bg-paper-2 ring-1 ring-ink/5"
            : "bg-paper shadow-[0_18px_44px_-30px_rgba(18,32,26,0.6)] ring-1 ring-ink/5";

  return (
    <div
      id={id}
      className={`rounded-[1.75rem] p-6 sm:p-7 ${look} ${
        interactive
          ? "transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] hover:-translate-y-1"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

export function FinePrint({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "reversed";
}) {
  return (
    <p
      className={`text-caption leading-relaxed ${
        tone === "reversed" ? "text-paper/60" : "text-ink/55"
      }`}
    >
      {children}
    </p>
  );
}

export function Chip({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "forest";
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[0.75rem] font-extrabold ${
        tone === "forest"
          ? "bg-green/25 text-green-bright"
          : "bg-green-wash text-forest"
      }`}
    >
      {children}
    </span>
  );
}

/** An accent word with the hand-drawn underline from the hero. */
export function Underlined({ children }: { children: ReactNode }) {
  return (
    <span className="relative inline-block text-green">
      {children}
      <svg
        aria-hidden="true"
        viewBox="0 0 190 20"
        className="absolute -bottom-1.5 left-0 w-[112%]"
        fill="none"
      >
        <path
          d="M4 13C40 5 128 2 186 9"
          stroke="var(--color-green)"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
