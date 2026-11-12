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

    let observer: IntersectionObserver | null = null;

    const show = () => {
      setInView(true);
      observer?.disconnect();
    };

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) show();
      },
      { threshold },
    );
    observer.observe(el);

    // Same rescue as Reveal, and for the same reason: a number must never sit
    // at zero because the observer was suspended in a background tab. It only
    // fires for what is on screen, so a counter below the fold still counts up
    // when the reader actually reaches it.
    const rescue = () => {
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
  innerClassName = "",
}: {
  children: ReactNode;
  /** Pixels of travel. Negative moves the child with the scroll instead. */
  strength?: number;
  className?: string;
  /**
   * Classes for the moving div. It carries a transform, which makes it the
   * containing block for any absolutely positioned child and gives it an
   * auto height — so anything sized in percentages inside needs its height
   * restored here.
   */
  innerClassName?: string;
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
        className={`will-change-transform ${innerClassName}`}
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

/**
 * A scroll-linked progress bar for a long document.
 *
 * Tracks how far through `targetId` the reader has scrolled. Deliberately
 * has no transition: it should follow the scroll exactly rather than easing
 * behind it, which reads as lag. Decorative, so it is hidden from screen
 * readers — a screen reader already knows its position in the document.
 */
export function ReadingProgress({
  targetId,
  className = "",
}: {
  targetId: string;
  className?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      // A document shorter than the viewport has nothing to track: it is
      // either entirely ahead of you or entirely read.
      if (travel <= 0) {
        setProgress(rect.bottom <= window.innerHeight ? 1 : 0);
        return;
      }
      setProgress(Math.min(Math.max(-rect.top / travel, 0), 1));
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
  }, [targetId]);

  return (
    <div
      aria-hidden="true"
      className={`h-[3px] w-full overflow-hidden rounded-full bg-[color:var(--hair)] ${className}`}
    >
      <div
        className="h-full origin-left rounded-full bg-green will-change-transform"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

/**
 * A document index that follows the reader.
 *
 * The active entry is whichever section heading has last passed the top of
 * the viewport, and a rail slides to it rather than snapping, so the eye can
 * follow the move. Anchors are plain links: with JavaScript off the index
 * still navigates, it just stops highlighting.
 */
export function SectionIndex({
  items,
  className = "",
}: {
  items: { id: string; label: string }[];
  className?: string;
}) {
  const [active, setActive] = useState(0);
  const [marker, setMarker] = useState({ top: 0, height: 0 });
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      let current = 0;
      items.forEach((item, i) => {
        const el = document.getElementById(item.id);
        // 160px clears the sticky header, so a heading counts as "being
        // read" once it reaches the top of the readable area.
        if (el && el.getBoundingClientRect().top <= 160) current = i;
      });
      setActive(current);
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
  }, [items]);

  useEffect(() => {
    const el = listRef.current?.children[active] as HTMLElement | undefined;
    if (el) setMarker({ top: el.offsetTop, height: el.offsetHeight });
  }, [active, items]);

  return (
    <nav aria-label="On this page" className={className}>
      <p className="text-[0.75rem] font-extrabold uppercase tracking-[0.14em] text-green">
        On this page
      </p>

      <div className="relative mt-5">
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[2px] rounded-full bg-[color:var(--hair)]"
        />
        <span
          aria-hidden="true"
          className="absolute left-0 top-0 w-[2px] rounded-full bg-green transition-[transform,height] duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] motion-reduce:transition-none"
          style={{ transform: `translateY(${marker.top}px)`, height: `${marker.height}px` }}
        />

        <ol ref={listRef}>
          {items.map((item, i) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={i === active ? "true" : undefined}
                className={`flex gap-3 py-2 pl-5 pr-2 text-[0.9375rem] transition-colors duration-300 ${
                  i === active
                    ? "font-bold text-forest"
                    : "text-[color:var(--ink-3)] hover:text-forest"
                }`}
              >
                <span className="money text-[0.8125rem] tabular-nums opacity-70">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{item.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
