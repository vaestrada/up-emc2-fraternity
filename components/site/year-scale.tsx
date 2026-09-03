"use client";

import { motion, useScroll, useSpring, useReducedMotion } from "framer-motion";
import { Container } from "@/components/site/container";

/* A timeline rail: 1969 at the left edge, the next anniversary at the right,
   one tick per year, the milestone years labelled. A gold line fills across
   it in step with how far the reader has scrolled the page, so reading down
   the page is travelling forward in time. Sticky under the navbar.

   Framer's useScroll gives page progress in every browser; the fill is a
   scaleX transform so it costs nothing to animate. */

const START = 1969;
const END = 2027;
/* Years that get a taller tick. Only the ones with a caption also get text;
   2020 and 2024 sit too close to the right edge to carry words. */
const LABELLED: Record<number, string | null> = {
  1969: "Founded",
  1983: "Most Outstanding",
  2020: null,
  2024: null,
  2027: "The 58th",
};
const TEXT_YEARS = [1969, 1983, 2020, 2027];

export function YearScale() {
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const years = Array.from({ length: END - START + 1 }, (_, i) => START + i);
  const pct = (y: number) => ((y - START) / (END - START)) * 100;

  return (
    <div
      aria-hidden="true"
      className="sticky top-[4.5rem] z-40 border-b border-[var(--hairline)] bg-[var(--canvas)] md:top-20"
    >
      <Container>
        <div className="relative h-14">
          {/* ticks */}
          {years.map((y) => {
            const labelled = y in LABELLED;
            return (
              <span
                key={y}
                className="absolute bottom-0 w-px bg-[var(--frat-cream)]"
                style={{
                  left: `${pct(y)}%`,
                  height: labelled ? "1.25rem" : y % 5 === 0 ? "0.75rem" : "0.375rem",
                  opacity: labelled ? 0.7 : 0.25,
                }}
              />
            );
          })}

          {/* labels */}
          {TEXT_YEARS.map((year) => {
            const label = LABELLED[year];
            const atEnd = year === END;
            return (
              <span
                key={year}
                className="absolute top-2 whitespace-nowrap"
                style={{
                  left: `${pct(year)}%`,
                  transform: atEnd ? "translateX(-100%)" : year === START ? "none" : "translateX(-50%)",
                }}
              >
                <span className="font-display text-[12px] tracking-[0.12em] text-[var(--frat-cream)]">{year}</span>
                {label ? <span className="caption ml-2 hidden text-[11px] md:inline">{label}</span> : null}
              </span>
            );
          })}

          {/* the fill */}
          <motion.span
            className="absolute bottom-0 left-0 h-px w-full origin-left bg-[var(--frat-gold)]"
            style={{ scaleX: reduceMotion ? 1 : progress }}
          />
          <span className="absolute bottom-0 left-0 h-px w-full bg-[var(--hairline)]" style={{ zIndex: -1 }} />
        </div>
      </Container>
    </div>
  );
}
