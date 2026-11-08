"use client";

import { useRef, useState } from "react";

/**
 * A video that costs nothing until someone asks for it.
 *
 * The file is several megabytes and most of this audience is on mobile
 * data, so nothing is fetched on load: the poster is a still image and the
 * video carries preload="none" until the viewer presses play. Autoplaying
 * it would spend their money to decorate our hero.
 *
 * With no src it renders the poster alone, rather than pretending a video
 * is there.
 */
export function HeroVideo({
  src,
  poster,
  label,
  credit,
  ratio = "4/5",
  className = "",
}: {
  src?: string;
  /** A still shown until play is pressed. */
  poster: string;
  label: string;
  credit?: string;
  ratio?: "4/5" | "16/9" | "3/2";
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  async function play() {
    const el = videoRef.current;
    if (!el) return;
    try {
      await el.play();
      setPlaying(true);
    } catch {
      // Autoplay policy or a failed fetch: the poster stays, which is a
      // perfectly good hero on its own.
      setPlaying(false);
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[var(--radius-xl)] bg-cream ${className}`}
      style={{ aspectRatio: ratio.replace("/", " / ") }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt={label}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {src && (
        <>
          <video
            ref={videoRef}
            src={src}
            poster={poster}
            preload="none"
            muted
            loop
            playsInline
            aria-label={label}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              playing ? "opacity-100" : "opacity-0"
            }`}
          />

          {!playing && (
            <button
              type="button"
              onClick={play}
              className="group absolute inset-0 grid place-items-center bg-[linear-gradient(to_top,rgba(22,19,15,0.45),transparent_55%)]"
            >
              <span className="sr-only">Play video: {label}</span>
              <span
                aria-hidden="true"
                className="grid h-16 w-16 place-items-center rounded-full bg-paper/95 shadow-[0_10px_40px_-12px_rgba(22,19,15,0.6)] transition-transform duration-300 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
              >
                <svg width="20" height="22" viewBox="0 0 20 22" fill="none">
                  <path d="M19 11 0.25 21.4V0.6L19 11Z" fill="var(--color-forest)" />
                </svg>
              </span>
              <span
                aria-hidden="true"
                className="absolute bottom-4 left-4 right-4 text-caption font-bold text-[color:var(--on-dark-1)]"
              >
                Watch · plays only when you press
              </span>
            </button>
          )}
        </>
      )}

      {credit && (
        <span className="absolute bottom-2 right-2 rounded-full bg-black/45 px-2.5 py-1 text-[0.625rem] font-bold text-white/90 backdrop-blur-sm">
          {credit}
        </span>
      )}
    </div>
  );
}
