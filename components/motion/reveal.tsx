"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/* One entrance for everything below the fold: a short rise and fade, once,
   when the block scrolls into view. Quiet enough that nobody notices it as
   an effect; present enough that sections arrive rather than appear. */
const variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "span" | "li";
  /** Kept for call-site compatibility; there is one effect now. */
  effect?: "rise" | "engrave";
}) {
  const Component = motion[as];
  return (
    <Component
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      custom={delay}
    >
      {children}
    </Component>
  );
}
