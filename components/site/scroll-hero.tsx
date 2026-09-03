"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { motion, useMotionTemplate, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Container } from "@/components/site/container";
import { Seal } from "@/components/site/seal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* The reference's opening, rebuilt: the page starts on the photograph
   (later, a video) with only a scroll cue. As the reader scrolls the first
   screen, a tinted panel grows down from the top, its chevron edge leading,
   and the seal, the name, the university, the call, and the buttons come up
   inside it. The panel then rides up with the page like any section.

   Mechanics: a 200svh section with a sticky 100svh stage; framer's useScroll
   gives progress through the section, and the panel's clip-path polygon is
   written from that progress. No scroll hijacking: the wheel moves the page
   exactly as far as it always does. Reduced motion shows the finished
   panel from the start. */

const CHEVRON = 8; // vw, depth of the point

export function ScrollHero({
  image,
  imageAlt,
  video,
}: {
  image: string;
  imageAlt: string;
  /** Optional MP4; when present it plays muted behind the panel. */
  video?: string;
}) {
  const section = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end end"] });

  // Panel descends across the first screen of scrolling. Every mapping is
  // written over the full 0–1 range: framer hands opacity and transform to
  // the browser's native scroll timeline where it can, and keyframes that
  // stop short of 1 would run back to their start over the remainder.
  const reach = useTransform(scrollYProgress, [0, 0.55, 1], [0, 100, 100]);
  const clip = useMotionTemplate`polygon(0 0, 100% 0, 100% calc(${reach}% - ${CHEVRON}vw), 50% ${reach}%, 0 calc(${reach}% - ${CHEVRON}vw))`;
  const contentOpacity = useTransform(scrollYProgress, [0, 0.18, 0.5, 1], [0, 0, 1, 1]);
  const contentY = useTransform(scrollYProgress, [0, 0.18, 0.5, 1], [40, 40, 0, 0]);
  const cueOpacity = useTransform(scrollYProgress, [0, 0.15, 1], [1, 0, 0]);

  const still = reduceMotion ? { clipPath: "none", opacity: 1, y: 0 } : null;

  return (
    <section ref={section} className="relative h-[200svh] bg-[var(--ink)]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* the ground: photograph now, video later */}
        {video ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={video}
            poster={image}
            autoPlay
            muted
            loop
            playsInline
          />
        ) : (
          <Image src={image} alt={imageAlt} fill priority sizes="100vw" className="object-cover object-[50%_40%]" />
        )}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-[var(--ink)]/30 via-transparent to-[var(--ink)]/40" />

        {/* the cue, on the photograph */}
        <motion.a
          href="#we-are"
          style={{ opacity: still ? 0 : cueOpacity }}
          className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[12px] font-bold tracking-[0.2em] text-[var(--frat-cream)] uppercase"
        >
          Scroll for the record
          <ArrowDown className="scroll-cue h-5 w-5 text-[var(--frat-gold-light)]" strokeWidth={2} />
        </motion.a>

        {/* the panel */}
        <motion.div
          style={{ clipPath: still ? "none" : clip }}
          className="absolute inset-0 flex items-center justify-center bg-[var(--frat-green)]/85 text-center"
        >
          <motion.div
            style={still ? { opacity: 1, y: 0 } : { opacity: contentOpacity, y: contentY }}
            className="flex w-full flex-col items-center pt-24 pb-[10vw]"
          >
            <Container className="flex flex-col items-center">
              <Seal className="h-[26vh] w-[26vh] max-h-[17rem] max-w-[17rem] md:h-[32vh] md:w-[32vh]" />
              <h1 className="on-plate mt-2 font-display text-[clamp(2.4rem,6.2vw,5.25rem)] font-bold leading-none tracking-tight text-[var(--frat-cream)] uppercase">
                EMC&sup2; Fraternity
              </h1>
              <p className="on-plate mt-3 font-display text-[clamp(0.95rem,1.7vw,1.35rem)] font-bold tracking-[0.18em] text-[var(--frat-cream)]/95 uppercase">
                University of the Philippines
              </p>
              <p className="on-plate mt-5 font-sans text-[clamp(0.9rem,1.5vw,1.15rem)] font-semibold tracking-[0.2em] text-[var(--frat-gold-light)] uppercase">
                Take the quantum leap
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <Link href="/join" className={cn(buttonVariants({ variant: "white", size: "lg" }))}>
                  Join the brotherhood
                </Link>
                <Link href="/donate" className={cn(buttonVariants({ variant: "outline-light", size: "lg" }))}>
                  Give Back
                </Link>
              </div>
            </Container>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
