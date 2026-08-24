"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

/**
 * Full-bleed video hero. The video is ambient — muted, looping, decorative —
 * so it carries no controls and no information: every fact is in the text
 * mounted over it.
 *
 * Under prefers-reduced-motion the video never loads at all and the poster
 * holds instead. That is stricter than pausing it, and deliberately so: DESIGN
 * principle 1 makes stillness the default state, and a poster frame is a
 * complete experience here rather than a degraded one.
 */
export function CinematicHero({
  src,
  poster,
  eyebrow,
  title,
  description,
  fullHeight = false,
  as = "h1",
}: {
  src: string;
  poster: string;
  eyebrow: string;
  title: string;
  description?: string;
  /** Fill the viewport. svh, not vh — mobile browser chrome otherwise
      pushes the CTA below the fold on exactly the phones most brods use. */
  fullHeight?: boolean;
  /** Heading level. A page gets exactly one h1, so when this renders as a
      band partway down a page that already has one, it must step down. */
  as?: "h1" | "h2";
}) {
  const Heading = as;
  const videoRef = useRef<HTMLVideoElement>(null);
  // Lazy initializer rather than an effect, so the very first paint already
  // knows whether motion is wanted and we never fetch the file needlessly.
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Pause while offscreen — an ambient loop nobody can see is just battery.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduced) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.05 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <section className={cn(
        "relative isolate flex items-end overflow-hidden border-b border-[var(--hairline)]",
        fullHeight ? "min-h-[100svh]" : "min-h-[86vh]"
      )}>
      {/* Poster always renders: it is the reduced-motion experience, and the
          first frame under the video while it buffers. */}
      <Image
        src={poster}
        alt=""
        aria-hidden
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />

      {reduced ? null : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden
          tabIndex={-1}
        />
      )}

      {/* Two grounds, not one: a full wash to hold contrast everywhere, and a
          bottom ramp so the text block sits on near-solid ink. WCAG AA on the
          body copy depends on both. */}
      <div aria-hidden className="absolute inset-0 bg-[var(--ink)]/55" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-4/5 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/85 to-transparent"
      />

      <Container className="relative w-full pb-20 pt-44">
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold-light)] uppercase">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <Heading className="mt-6 max-w-3xl font-display text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-[var(--frat-cream)]">
            {title}
          </Heading>
        </Reveal>
        {description ? (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--frat-cream)]/75">
              {description}
            </p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
