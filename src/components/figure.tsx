import { existsSync } from "node:fs";
import { join } from "node:path";

/**
 * A photo slot.
 *
 * The site is designed around student photography that does not exist yet, so
 * a slot whose file is missing renders the brief for the shot it wants
 * instead. A missing photo should read as a brief, not as a broken page.
 *
 * Existence is checked on the server, so there is no flash of a broken image
 * and no JavaScript is needed. Drop files into /public/photos; in production
 * the check runs at build time, so rebuild after adding one.
 */
export function Figure({
  src,
  alt,
  brief,
  ratio = "4/5",
  className = "",
  priority = false,
  rounded = "xl",
}: {
  src?: string;
  alt: string;
  brief: string;
  ratio?: "4/5" | "3/4" | "1/1" | "16/9" | "3/2" | "9/16";
  className?: string;
  priority?: boolean;
  rounded?: "lg" | "xl" | "full" | "none";
}) {
  const radius = {
    lg: "rounded-[var(--radius-lg)]",
    xl: "rounded-[var(--radius-xl)]",
    full: "rounded-full",
    none: "",
  }[rounded];

  const present =
    typeof src === "string" &&
    src.startsWith("/") &&
    existsSync(join(process.cwd(), "public", src));

  return (
    <div
      className={`relative overflow-hidden bg-cream ${radius} ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {present ? (
        // next/image cannot express "render nothing if the file is absent",
        // and these slots must survive a missing photo. Existence is already
        // confirmed above, so a plain img is correct here.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 grid place-items-center p-5">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(135deg,var(--accent-wash),var(--color-cream-deep))]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-3 rounded-[inherit] border border-dashed border-[color:var(--ink-4)]"
          />
          <div className="relative max-w-[18rem] text-center">
            <svg
              width="26"
              height="26"
              viewBox="0 0 24 24"
              fill="none"
              className="mx-auto text-[color:var(--ink-3)]"
              aria-hidden="true"
            >
              <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
              <circle cx="8.5" cy="10" r="1.8" stroke="currentColor" strokeWidth="1.4" />
              <path d="M3 17l5.2-4.4a2 2 0 0 1 2.6 0L21 20" stroke="currentColor" strokeWidth="1.4" />
            </svg>
            <p className="mt-2.5 text-caption font-bold leading-snug text-[color:var(--ink-2)]">
              {brief}
            </p>
            <p className="mt-1 text-micro uppercase tracking-widest text-[color:var(--ink-4)]">
              {ratio} · drop in /public/photos
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
