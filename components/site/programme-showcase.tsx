"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { Container } from "@/components/site/container";

export type ShowcaseItem = {
  image: string;
  title: string;
  body: string;
  status: string;
};

const SLIDE_MS = 5000;
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Full-viewport cinematic showcase: one item at a time, large, auto-advancing.
 *
 * The point is restraint of *information*, not of motion — a reader meets one
 * idea per screen instead of a six-card wall. Each slide holds five seconds.
 *
 * Three things make an auto-advancing carousel acceptable rather than hostile:
 *
 * 1. WCAG 2.2.2 (Pause, Stop, Hide) requires a control for anything that
 *    auto-updates. There is a real pause button, and hovering or focusing
 *    anything inside also pauses — so it never yanks a slide away from someone
 *    mid-sentence or mid-tab.
 * 2. prefers-reduced-motion disables autoplay entirely and drops the Ken Burns
 *    drift. The reader advances it themselves, which is the correct default
 *    under DESIGN principle 1 (stillness is the default state).
 * 3. Every slide's text stays in the DOM at all times, only visually hidden.
 *    Screen readers, search engines, and no-JS readers get all six regardless
 *    of which one is currently painted — a carousel must never be the only
 *    route to its own content.
 */
export function ProgrammeShowcase({ items }: { items: ShowcaseItem[] }) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  // Separate from `paused` so a hover doesn't overwrite a deliberate press.
  const [hovering, setHovering] = useState(false);
  const rootRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  const go = useCallback(
    (next: number) => setIndex(((next % items.length) + items.length) % items.length),
    [items.length]
  );

  // Only run while actually on screen — an invisible carousel burning a timer
  // is wasted work, and worse, the reader returns to a slide they never saw.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const running = inView && !paused && !hovering && !reduceMotion;

  useEffect(() => {
    if (!running) return;
    const timer = window.setTimeout(() => go(index + 1), SLIDE_MS);
    return () => window.clearTimeout(timer);
  }, [running, index, go]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  const current = items[index];

  return (
    <section
      ref={rootRef}
      aria-roledescription="carousel"
      aria-label="What the committee is building"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocusCapture={() => setHovering(true)}
      onBlurCapture={() => setHovering(false)}
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden border-y border-[var(--hairline)] bg-[var(--ink)]"
    >
      {/* Imagery. Only the active frame is painted; the text for every slide
          lives in the DOM below regardless. */}
      <AnimatePresence initial={false}>
        <motion.div
          key={current.image}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <motion.div
            className="absolute inset-0"
            initial={reduceMotion ? false : { scale: 1.06 }}
            animate={reduceMotion ? undefined : { scale: 1.14 }}
            transition={{ duration: SLIDE_MS / 1000 + 2, ease: "linear" }}
          >
            <Image
              src={current.image}
              alt=""
              aria-hidden
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Two grounds so cream text clears AA over any frame. */}
      <div aria-hidden className="absolute inset-0 bg-[var(--ink)]/45" />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/80 to-transparent"
      />

      <Container className="relative z-10 pb-16 pt-32 md:pb-20">
        <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
          № 10.2 — In Preparation
        </p>

        {/* aria-live announces the change without stealing focus. */}
        {/* Enter-only, deliberately: no AnimatePresence and no exit.
            mode="wait" would hold the new text hostage to the old one's exit
            animation, so a stalled or interrupted animation leaves the reader
            looking at the previous slide's words under the new slide's number.
            Re-keying the node remounts it, so the text is correct the instant
            the index changes and the animation is pure decoration on top. */}
        <div className="mt-6 min-h-[15rem] md:min-h-[13rem]" aria-live="polite" aria-atomic="true">
          <motion.div
            key={current.title}
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE }}
          >
            <h2 className="max-w-4xl font-display text-[clamp(2.2rem,5.5vw,4.25rem)] leading-[1.05] tracking-tight text-[var(--frat-cream)]">
              {current.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--frat-cream)]/75 md:text-lg">
              {current.body}
            </p>
            <p className="mt-6 font-mono text-[10px] leading-relaxed tracking-[0.2em] text-[var(--frat-gold-light)]/80 uppercase">
              {current.status}
            </p>
          </motion.div>
        </div>

        {/* Controls: a progress rail per slide, plus a real pause button. */}
        <div className="mt-10 flex items-center gap-5">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            aria-pressed={paused}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--frat-gold)]/40 text-[var(--frat-gold-light)] transition-colors hover:border-[var(--frat-gold)] hover:bg-[var(--frat-gold)]/10"
          >
            {paused || reduceMotion ? (
              <Play className="h-3.5 w-3.5" strokeWidth={2} />
            ) : (
              <Pause className="h-3.5 w-3.5" strokeWidth={2} />
            )}
            <span className="sr-only">
              {paused || reduceMotion ? "Play the showcase" : "Pause the showcase"}
            </span>
          </button>

          <ol className="flex flex-1 items-center gap-2 md:gap-3">
            {items.map((item, i) => (
              <li key={item.title} className="flex-1">
                <button
                  type="button"
                  onClick={() => go(i)}
                  aria-current={i === index ? "true" : undefined}
                  /* 44px minimum touch target. PRODUCT.md calls for generous
                     hit targets because much of this audience is in its
                     sixties and seventies; a 1px rule with 12px of padding
                     technically clears WCAG 2.5.8's 24px floor and is still
                     a miserable thing to tap on a phone. */
                  className="group relative flex min-h-[44px] w-full items-center"
                >
                  <span className="block h-px w-full bg-[var(--frat-cream)]/25 transition-colors group-hover:bg-[var(--frat-cream)]/50">
                    <motion.span
                      className="block h-px bg-[var(--frat-gold-light)]"
                      initial={{ width: i < index ? "100%" : "0%" }}
                      animate={{ width: i < index ? "100%" : i === index ? "100%" : "0%" }}
                      transition={
                        i === index && running
                          ? { duration: SLIDE_MS / 1000, ease: "linear" }
                          : { duration: 0.3 }
                      }
                    />
                  </span>
                  <span className="sr-only">
                    Show {item.title} ({i + 1} of {items.length})
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <span className="shrink-0 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/50 tabular-nums">
            {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </div>
      </Container>

      {/* Every slide's content, always in the DOM. A carousel must not be the
          only path to its own text — this is what a screen reader reading
          straight through, a crawler, and a no-JS visitor actually get. */}
      <div className="sr-only">
        <h2>What the committee is building</h2>
        <ul>
          {items.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <p>{item.status}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
