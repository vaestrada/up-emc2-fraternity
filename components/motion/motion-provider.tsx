"use client";

import { MotionConfig } from "framer-motion";

/* reducedMotion="user" makes every framer-motion animation honor
   prefers-reduced-motion (transforms/filters are skipped, opacity still
   settles) — the CSS-only rule in globals.css can't reach JS-driven values. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
