"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export function Counter({
  to,
  suffix = "",
  duration = 1.8,
  className,
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame: number;
    // Honor prefers-reduced-motion: show the final figure without counting up.
    if (reduceMotion) {
      frame = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(frame);
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / (duration * 1000), 1);
      // ease-out-quart so the last digits settle slowly, like a meter coming to rest
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(eased * to));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, to, duration, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {value.toLocaleString()}
      {suffix}
    </span>
  );
}
