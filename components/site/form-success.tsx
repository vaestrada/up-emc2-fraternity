"use client";

import { motion, useReducedMotion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Shared success state for every form on the site (pledge, dues, contribute).
 * A checkmark that pops in with spring physics — the one moment a form
 * interaction deserves a little delight, kept in one place so it stays
 * consistent everywhere it's used.
 */
export function FormSuccess({ title, body }: { title: string; body: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <Card role="status" aria-live="polite" className="flex flex-col items-center justify-center p-12 text-center">
      <motion.div
        initial={reduceMotion ? false : { scale: 0.4, opacity: 0, rotate: -8 }}
        animate={{ scale: 1, opacity: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20, mass: 0.7 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--frat-gold)]/15"
      >
        <CheckCircle2 className="h-7 w-7 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
      </motion.div>
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15, ease: EASE }}
        className="mt-5 font-serif text-2xl font-semibold text-[var(--frat-cream)]"
      >
        {title}
      </motion.p>
      <motion.p
        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.28, ease: EASE }}
        className="mt-3 max-w-sm text-sm text-[var(--frat-cream)]/70"
      >
        {body}
      </motion.p>
    </Card>
  );
}
