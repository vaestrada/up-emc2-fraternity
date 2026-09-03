"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

/* Scrollytelling: the record told as chapters. The left column is sticky
   and shows the chapter's year and kicker; the right column scrolls. An
   IntersectionObserver with a band through the middle of the viewport
   decides which chapter is current, and the year crossfades when it
   changes. On small screens the year sits inside each chapter instead. */

export type Chapter = {
  id: string;
  figure: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function Chronicle({ chapters }: { chapters: Chapter[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = refs.current.indexOf(entry.target as HTMLElement);
            if (index >= 0) setActive(index);
          }
        }
      },
      // A thin band 45% down the viewport: a chapter is current while that
      // band lies inside it.
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = chapters[active];

  return (
    <Container className="grid gap-10 md:grid-cols-[1fr_1.7fr] md:gap-20">
      {/* the sticky column */}
      <div className="hidden md:block">
        <div className="sticky top-44 min-h-[40vh]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={current.id}
              initial={reduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE }}
            >
              <p className="label">{current.kicker}</p>
              <p className="mt-6 font-display text-[clamp(4rem,9vw,8rem)] leading-none text-[var(--frat-cream)]">
                {current.figure}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* the chapter index */}
          <ol className="mt-12 space-y-2">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  className={cn(
                    "flex items-baseline gap-4 text-[13px] transition-colors",
                    i === active ? "text-[var(--frat-gold-light)]" : "text-[var(--frat-cream)]/45 hover:text-[var(--frat-cream)]/80"
                  )}
                >
                  <span className="font-display tabular-nums">{c.figure}</span>
                  <span>{c.kicker}</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* the chapters */}
      <div>
        {chapters.map((c, i) => (
          <section
            key={c.id}
            id={c.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className={cn("scroll-mt-40 py-16 md:min-h-[70vh] md:py-24", i > 0 && "border-t border-[var(--hairline)]")}
          >
            <div className="md:hidden">
              <p className="label">{c.kicker}</p>
              <p className="mt-4 font-display text-5xl text-[var(--frat-cream)]">{c.figure}</p>
            </div>
            <h2 className="mt-6 font-display text-3xl leading-tight text-[var(--frat-cream)] md:mt-0 md:text-4xl">
              {c.title}
            </h2>
            <div className="mt-8">{c.children}</div>
          </section>
        ))}
      </div>
    </Container>
  );
}
