"use client";

import { motion, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

const effects: Record<"rise" | "engrave", Variants> = {
  rise: {
    hidden: { opacity: 0, y: 28 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] },
    }),
  },
  // blur-to-sharp, like an inscription coming into focus — for ceremonial titles
  engrave: {
    hidden: { opacity: 0, y: 14, filter: "blur(10px)" },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.3, delay, ease: [0.22, 1, 0.36, 1] },
    }),
  },
};

export function Reveal({
  children,
  className,
  delay = 0,
  as = "div",
  effect = "rise",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "p" | "h1" | "h2" | "h3" | "span" | "li";
  effect?: "rise" | "engrave";
}) {
  const Component = motion[as];
  return (
    <Component
      className={cn(className)}
      variants={effects[effect]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
    >
      {children}
    </Component>
  );
}
