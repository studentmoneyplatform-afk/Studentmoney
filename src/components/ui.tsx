import Link from "next/link";
import type { ReactNode } from "react";

type Surface = "paper" | "paper-2" | "cream" | "forest";

const SURFACE: Record<Surface, string> = {
  paper: "bg-paper text-ink",
  "paper-2": "bg-paper-2 text-ink",
  cream: "bg-cream text-ink",
  forest: "bg-forest text-[color:var(--on-dark-1)]",
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
  const max = {
    default: "max-w-6xl",
    wide: "max-w-7xl",
    narrow: "max-w-3xl",
  }[width];

  return (
    <section id={id} className={`${SURFACE[tone]} ${className}`}>
      <div className={`mx-auto w-full ${max} px-5 py-20 sm:px-8 sm:py-28`}>
        {children}
      </div>
    </section>
  );
}

export function Button({
  href,
  children,
  variant = "solid",
  size = "md",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost" | "light";
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizing = {
    sm: "px-4 py-2 text-caption",
    md: "px-5 py-2.5 text-body",
    lg: "px-7 py-3.5 text-[1.0625rem]",
  }[size];

  const look = {
    solid: "bg-forest text-[color:var(--on-dark-1)] hover:bg-forest-deep",
    ghost:
      "border border-[color:var(--hair-strong)] text-ink hover:border-[color:var(--ink-1)] hover:bg-[color:var(--hair)]",
    light:
      "bg-paper text-forest hover:bg-white",
  }[variant];

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-bold transition-[background-color,border-color,transform] duration-200 ease-[cubic-bezier(0.19,1,0.22,1)] active:translate-y-px ${sizing} ${look} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Eyebrow({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "reversed";
}) {
  return (
    <p
      className={`eyebrow ${
        tone === "reversed"
          ? "text-[color:var(--on-dark-3)]"
          : "text-[color:var(--ink-3)]"
      }`}
    >
      {children}
    </p>
  );
}

export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <h2 className={`font-display text-h2 ${className}`}>{children}</h2>;
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
      className={`max-w-2xl text-lead leading-relaxed ${
        tone === "reversed" ? "text-[color:var(--on-dark-2)]" : "text-[color:var(--ink-2)]"
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
    tone === "outline"
      ? "border border-[color:var(--hair)] bg-white/60"
      : tone === "forest"
        ? "bg-forest text-[color:var(--on-dark-1)]"
        : tone === "cream"
          ? "bg-cream"
          : tone === "paper-2"
            ? "bg-paper-2"
            : "bg-white border border-[color:var(--hair)]";

  return (
    <div
      id={id}
      className={`rounded-[var(--radius-xl)] p-6 sm:p-7 ${look} ${
        interactive ? "lift" : ""
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
        tone === "reversed" ? "text-[color:var(--on-dark-3)]" : "text-[color:var(--ink-3)]"
      }`}
    >
      {children}
    </p>
  );
}

/** A small label chip. Used for categories, never for money. */
export function Chip({ children, tone = "default" }: { children: ReactNode; tone?: "default" | "forest" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-micro font-bold uppercase tracking-wider ${
        tone === "forest"
          ? "bg-forest text-[color:var(--on-dark-1)]"
          : "border border-[color:var(--hair-strong)] text-[color:var(--ink-2)]"
      }`}
    >
      {children}
    </span>
  );
}
