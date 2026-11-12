"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

/**
 * Reveals its children as they scroll into view.
 *
 * The hidden state is applied by JS, not CSS, so with JavaScript off or the
 * observer unavailable the content is simply visible. Nothing a reader needs
 * is ever hidden behind an animation that might not run.
 */
export function Reveal({
  children,
  as: Tag = "div",
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  as?: ElementType;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion || !("IntersectionObserver" in window)) return;

    el.dataset.reveal = "armed";

    let observer: IntersectionObserver | null = null;

    const show = () => {
      el.style.transitionDelay = `${delay}ms`;
      el.dataset.reveal = "in";
      observer?.disconnect();
    };

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) show();
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );

    observer.observe(el);

    // Failsafe, for a tab that was in the background when it loaded: observer
    // callbacks can be suspended there, and an element armed but never
    // revealed sits at opacity 0 — content lost to a decoration.
    //
    // It rescues only what is actually on screen. An unconditional timeout
    // reveals the whole page a couple of seconds after load, so every reveal
    // below the fold has already played by the time the reader scrolls to it
    // and the page looks like it has no motion at all.
    const rescue = () => {
      if (el.dataset.reveal === "in") return;
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) show();
    };

    const failsafe = window.setTimeout(rescue, 2500);
    document.addEventListener("visibilitychange", rescue);

    return () => {
      observer?.disconnect();
      window.clearTimeout(failsafe);
      document.removeEventListener("visibilitychange", rescue);
    };
  }, [delay]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
