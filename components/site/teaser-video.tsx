"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX, Play } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Vertical teaser player. Autoplays muted and looping like a feed video, with a
 * sound toggle since the cut carries its own audio bed.
 *
 * Under prefers-reduced-motion it does not autoplay: the poster frame holds and
 * playback waits for an explicit press, per the system's motion rules.
 */
export function TeaserVideo({
  src,
  poster,
  className,
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);
  // Lazy initializer runs during render, not as a setState-in-effect side
  // effect — matchMedia is safe here since this component only ever renders
  // client-side ("use client" + no SSR usage on this page).
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const toggleSound = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    // A muted autoplaying video may still be paused on some mobile browsers;
    // unmuting is a user gesture, so it is a valid moment to start playback.
    if (!v.muted && v.paused) void v.play();
  };

  const start = () => {
    const v = videoRef.current;
    if (!v) return;
    void v.play();
    setStarted(true);
  };

  return (
    <div
      className={cn(
        "group relative border border-[var(--hairline)] bg-[var(--ink)]",
        className
      )}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        autoPlay={!reduced}
        preload="metadata"
        aria-label="Quantum Leap Sports Series, Pickleball 2026 teaser"
        className="block w-full"
      />

      {reduced && !started ? (
        <button
          type="button"
          onClick={start}
          aria-label="Play the teaser"
          className="absolute inset-0 grid place-items-center bg-[var(--ink)]/45 transition-colors hover:bg-[var(--ink)]/25"
        >
          <span className="flex items-center gap-3 border border-[var(--frat-gold)]/60 bg-[var(--ink)]/80 px-5 py-3 label">
            <Play className="h-3.5 w-3.5" aria-hidden />
            Play teaser
          </span>
        </button>
      ) : null}

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute the teaser" : "Mute the teaser"}
        aria-pressed={!muted}
        className="absolute right-3 bottom-3 flex items-center gap-2 border border-[var(--frat-gold)]/50 bg-[var(--ink)]/75 px-3 py-2 label backdrop-blur-sm transition-colors hover:border-[var(--frat-gold-light)] hover:bg-[var(--ink)]/90"
      >
        {muted ? (
          <VolumeX className="h-3.5 w-3.5" aria-hidden />
        ) : (
          <Volume2 className="h-3.5 w-3.5" aria-hidden />
        )}
        {muted ? "Sound off" : "Sound on"}
      </button>
    </div>
  );
}
