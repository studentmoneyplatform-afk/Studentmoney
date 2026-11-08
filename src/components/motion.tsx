"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

function prefersReduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Fires once when the element first enters the viewport. */
function useInView<T extends HTMLElement>(threshold = 0.25) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);

    // Same failsafe as Reveal: never let a number sit at zero because the
    // observer was suspended in a background tab.
    const failsafe = window.setTimeout(() => setInView(true), 2500);

    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [threshold]);

  return { ref, inView };
}

/**
 * Reveals a headline line by line, each line sliding up from behind a mask.
 * Falls back to plain text when motion is reduced.
 */
export function LineReveal({
  lines,
  className = "",
  delay = 0,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.2);
  const [reduced, setReduced] = useState(true);

  useEffect(() => setReduced(prefersReduced()), []);

  return (
    <span ref={ref} className={`block ${className}`}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]">
          <span
            className="block will-change-transform"
            style={
              reduced
                ? undefined
                : {
                    transform: inView ? "translateY(0)" : "translateY(105%)",
                    opacity: inView ? 1 : 0,
                    transition: `transform 0.9s cubic-bezier(0.19,1,0.22,1) ${
                      delay + i * 110
                    }ms, opacity 0.6s ease ${delay + i * 110}ms`,
                  }
            }
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

/** Counts up to a number once it scrolls into view. */
export function Counter({
  to,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1400,
  className = "",
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.5);
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (prefersReduced()) {
      setValue(to);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      // expo-out, so it decelerates into the final number
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      setValue(to * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString("en-NG", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
}

/**
 * An infinite horizontal ticker. The track is duplicated so the loop is
 * seamless; the copy is hidden from screen readers.
 */
export function Marquee({
  children,
  speed = 38,
  reverse = false,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  reverse?: boolean;
  className?: string;
}) {
  const style = {
    "--marquee-duration": `${speed}s`,
  } as CSSProperties;

  return (
    <div
      className={`group relative flex overflow-hidden ${className}`}
      style={style}
      aria-label="Scrolling list"
    >
      <div
        className={`flex min-w-full shrink-0 items-center gap-4 pr-4 ${
          reverse ? "animate-[marquee-reverse_var(--marquee-duration)_linear_infinite]" : "animate-[marquee_var(--marquee-duration)_linear_infinite]"
        } motion-reduce:animate-none`}
      >
        {children}
      </div>
      <div
        aria-hidden="true"
        className={`flex min-w-full shrink-0 items-center gap-4 pr-4 ${
          reverse ? "animate-[marquee-reverse_var(--marquee-duration)_linear_infinite]" : "animate-[marquee_var(--marquee-duration)_linear_infinite]"
        } motion-reduce:hidden`}
      >
        {children}
      </div>
    </div>
  );
}

/** Moves its child slightly against the scroll. Subtle on purpose. */
export function Parallax({
  children,
  strength = 40,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const viewportCentre = window.innerHeight / 2;
      const elementCentre = rect.top + rect.height / 2;
      const distance = (elementCentre - viewportCentre) / window.innerHeight;
      setOffset(Math.max(Math.min(distance, 1), -1) * strength);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [strength]);

  return (
    <div ref={ref} className={className}>
      <div
        className="will-change-transform"
        style={{ transform: `translate3d(0, ${offset}px, 0)` }}
      >
        {children}
      </div>
    </div>
  );
}

/** Card that tilts very slightly toward the cursor. */
export function Tilt({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg) translateY(-3px)`;
  }

  function reset() {
    const el = ref.current;
    if (el) el.style.transform = "";
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={`transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] ${className}`}
    >
      {children}
    </div>
  );
}
