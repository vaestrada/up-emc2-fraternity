"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  CheckCircle2,
  Wallet,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  Signal,
  BatteryFull,
  Bell,
  Users,
  Home,
  Sparkles,
  Send,
} from "lucide-react";

// Apple's own signature easing — decelerated, no overshoot. Used everywhere
// in this file so every mockup feels like it belongs to the same product.
const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 300, damping: 30, mass: 0.8 } as const;

/** Small "this is a concept, not a live feature" chip for not-yet-built mockups. */
function ConceptChip() {
  return (
    <span className="absolute top-3 right-3 z-10 border border-[var(--frat-gold)]/60 bg-[var(--ink)]/80 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-[var(--frat-gold-light)] uppercase backdrop-blur-sm">
      Concept
    </span>
  );
}

function LiveChip({ label }: { label: string }) {
  return (
    <span className="absolute top-3 right-3 z-10 border border-[var(--frat-gold)]/60 bg-[var(--ink)]/80 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-[var(--frat-gold-light)] uppercase backdrop-blur-sm">
      {label}
    </span>
  );
}

// aria-hidden: purely decorative — the animated/looping content here duplicates
// what the card's real heading and body copy already say to screen readers,
// and constantly-changing DOM text from the loop would otherwise be announced
// as noise.
const FrameShell = ({ children, concept = true }: { children: React.ReactNode; concept?: boolean }) => (
  <div
    aria-hidden="true"
    className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden border border-[var(--hairline)] bg-[var(--ink)] p-6"
  >
    {concept ? <ConceptChip /> : null}
    {children}
  </div>
);

/** Real screenshot of the live /portal sign-in — genuinely shipped, not a mockup. */
export function PortalScreenshot() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden border border-[var(--hairline)]">
      {/* The source is 1400px wide but this card slot is roughly a third of that,
          so let next/image size it down rather than shipping the full screenshot
          to every device. */}
      <Image
        src="/quantum-leap/demo-portal-screenshot.jpg"
        alt="The live Member Portal sign-in screen"
        fill
        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 90vw"
        className="object-cover object-top"
      />
      <LiveChip label="Live — real screenshot" />
    </div>
  );
}

export function DuesMockup() {
  const reduceMotion = useReducedMotion();
  return (
    <FrameShell concept={false}>
      <LiveChip label="Live — real UI" />
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="w-full max-w-xs border border-[var(--hairline)] bg-[var(--canvas)] p-6"
      >
        <motion.div
          className="flex items-center gap-2 text-[var(--frat-gold-light)]"
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.3 }}
        >
          <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase">Recorded</p>
        </motion.div>
        <p className="mt-4 font-display text-2xl text-[var(--frat-cream)]">₱500.00</p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/50 uppercase">
          AY 2025&ndash;2026 &middot; GCash
        </p>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {[Wallet, CreditCard, Building2, Banknote].map((Icon, i) => (
            <motion.div
              key={i}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: EASE }}
              className={`flex h-9 items-center justify-center border ${i === 0 ? "border-[var(--frat-gold)] bg-[var(--frat-gold)]/10" : "border-[var(--hairline)]"}`}
            >
              <Icon className="h-4 w-4 text-[var(--frat-cream)]/70" strokeWidth={1.5} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </FrameShell>
  );
}

export function CheckoutMockup() {
  const reduceMotion = useReducedMotion();
  const METHODS = [
    { icon: Wallet, label: "GCash" },
    { icon: Smartphone, label: "Maya" },
    { icon: CreditCard, label: "Card" },
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setActive((a) => (a + 1) % METHODS.length), 1800);
    return () => clearInterval(id);
  }, [reduceMotion, METHODS.length]);

  return (
    <FrameShell>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="w-full max-w-xs border border-[var(--hairline)] bg-[var(--canvas)] p-6"
      >
        <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--frat-gold)] uppercase">Pay Dues</p>
        <p className="mt-2 font-display text-3xl text-[var(--frat-cream)]">₱500.00</p>
        <div className="mt-5 space-y-2">
          {METHODS.map(({ icon: Icon, label }, i) => {
            const isActive = i === active;
            return (
              <motion.div
                key={label}
                animate={{
                  borderColor: isActive ? "var(--frat-gold)" : "var(--hairline)",
                  backgroundColor: isActive ? "rgba(195,143,14,0.1)" : "rgba(0,0,0,0)",
                }}
                transition={{ duration: 0.4, ease: EASE }}
                className="flex items-center gap-3 border px-4 py-3"
              >
                <Icon className="h-4 w-4 text-[var(--frat-cream)]/80" strokeWidth={1.5} />
                <span className="text-sm text-[var(--frat-cream)]/80">{label}</span>
                <AnimatePresence>
                  {isActive ? (
                    <motion.span
                      layoutId="checkout-dot"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={SPRING}
                      className="ml-auto h-2 w-2 rounded-full bg-[var(--frat-gold)]"
                    />
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
        <motion.div
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          transition={SPRING}
          className="mt-5 flex h-11 items-center justify-center bg-[var(--frat-gold)] font-mono text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase"
        >
          Pay ₱500.00
        </motion.div>
      </motion.div>
    </FrameShell>
  );
}

export function NewsletterMockup() {
  const reduceMotion = useReducedMotion();
  const ITEMS = [
    { Icon: Sparkles, text: "New citation inscribed — a brod recognized for public service." },
    { Icon: Bell, text: "Save the date — the Association’s next gathering." },
    { Icon: Send, text: "A gentle dues reminder, only if yours has lapsed." },
  ];
  return (
    <FrameShell>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="w-full max-w-sm border border-[var(--hairline)] bg-[var(--canvas)]"
      >
        <div className="border-b border-[var(--hairline)] p-4">
          <p className="font-mono text-[9px] tracking-[0.15em] text-[var(--frat-cream)]/50 uppercase">
            From: EMC² Fraternity Alumni Association
          </p>
          <p className="mt-1 font-display text-lg text-[var(--frat-cream)]">The Quarterly Dispatch</p>
        </div>
        <div className="space-y-4 p-4">
          {ITEMS.map(({ Icon, text }, i) => (
            <motion.div
              key={text}
              initial={reduceMotion ? false : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.15, ease: EASE }}
              className="flex items-start gap-3"
            >
              <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
              <p className="text-xs leading-relaxed text-[var(--frat-cream)]/70">{text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </FrameShell>
  );
}

// ---------------------------------------------------------------------------
// Companion App — an animated phone that cycles through three real screens,
// iOS-style page transitions (slide + fade), a story-style progress bar, and
// a bottom nav whose active icon tracks the current screen. Loops on a timer;
// prefers-reduced-motion holds on the first screen instead of cycling.
// ---------------------------------------------------------------------------

const APP_SCREENS = ["directory", "dues", "notification"] as const;
type AppScreen = (typeof APP_SCREENS)[number];

function DirectoryScreen() {
  return (
    <motion.div
      key="directory"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="absolute inset-0 flex flex-col"
    >
      <div className="mt-2 flex items-center gap-1.5 border-b border-[var(--hairline)] px-3 pb-2">
        <div className="h-3 w-3 rounded-full bg-[var(--frat-gold)]" />
        <p className="font-mono text-[7px] tracking-[0.15em] text-[var(--frat-cream)] uppercase">Directory</p>
      </div>
      <div className="space-y-1.5 px-2 py-2">
        {["Villareal, M.", "Castillo, R.", "Manalo, J."].map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.3, ease: EASE }}
            className="flex items-center gap-1.5 border border-[var(--hairline)] px-1.5 py-1"
          >
            <div className="h-3.5 w-3.5 shrink-0 rounded-full bg-[var(--frat-gold)]/30" />
            <span className="truncate text-[6px] text-[var(--frat-cream)]/70">{name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function DuesScreen() {
  return (
    <motion.div
      key="dues"
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING, delay: 0.2 }}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--frat-gold)]/15"
      >
        <CheckCircle2 className="h-5 w-5 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
      </motion.div>
      <p className="mt-2 font-mono text-[7px] tracking-[0.15em] text-[var(--frat-cream)] uppercase">Dues Recorded</p>
      <p className="mt-1 font-display text-sm text-[var(--frat-gold-light)]">₱500.00</p>
    </motion.div>
  );
}

function NotificationScreen() {
  return (
    <motion.div key="notification" className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 10, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={SPRING}
        className="mx-2 flex items-start gap-1.5 border border-[var(--hairline)] bg-[var(--ink)] p-2 shadow-lg"
      >
        <Bell className="mt-0.5 h-3 w-3 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
        <div className="min-w-0">
          <p className="font-mono text-[6px] tracking-[0.1em] text-[var(--frat-cream)] uppercase">EMC² Portal</p>
          <p className="mt-0.5 truncate text-[6px] text-[var(--frat-cream)]/70">Gathering announced — Sat, 6PM</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function CompanionAppMockup() {
  const reduceMotion = useReducedMotion();
  const [screen, setScreen] = useState<AppScreen>("directory");

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => {
      setScreen((s) => APP_SCREENS[(APP_SCREENS.indexOf(s) + 1) % APP_SCREENS.length]);
    }, 2600);
    return () => clearInterval(id);
  }, [reduceMotion]);

  const screenIndex = APP_SCREENS.indexOf(screen);

  return (
    <FrameShell>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative h-72 w-36 overflow-hidden rounded-[1.75rem] border-4 border-[var(--frat-cream)]/15 bg-[var(--canvas)] shadow-2xl"
      >
        <div className="flex items-center justify-between px-3 pt-2 text-[var(--frat-cream)]/70">
          <span className="font-mono text-[7px]">9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="h-2.5 w-2.5" strokeWidth={2} />
            <BatteryFull className="h-2.5 w-2.5" strokeWidth={2} />
          </div>
        </div>

        {/* Story-style progress bar tracking which screen is live */}
        <div className="mt-1.5 flex gap-1 px-3">
          {APP_SCREENS.map((s, i) => (
            <div key={s} className="h-[2px] flex-1 overflow-hidden rounded-full bg-[var(--hairline)]">
              <motion.div
                className="h-full bg-[var(--frat-gold)]"
                initial={false}
                animate={{ width: i < screenIndex ? "100%" : i === screenIndex ? "100%" : "0%" }}
                transition={i === screenIndex ? { duration: reduceMotion ? 0 : 2.5, ease: "linear" } : { duration: 0.3 }}
              />
            </div>
          ))}
        </div>

        <div className="relative mt-1.5 h-[calc(100%-84px)]">
          <AnimatePresence mode="wait">
            {screen === "directory" ? <DirectoryScreen /> : screen === "dues" ? <DuesScreen /> : <NotificationScreen />}
          </AnimatePresence>
        </div>

        <div className="absolute right-0 bottom-0 left-0 flex items-center justify-around border-t border-[var(--hairline)] bg-[var(--ink)] py-1.5">
          <Home
            className="h-3 w-3"
            strokeWidth={1.5}
            style={{ color: screen === "directory" || screen === "dues" ? "var(--frat-gold-light)" : "var(--frat-cream)" }}
          />
          <Users className="h-3 w-3 text-[var(--frat-cream)]/40" strokeWidth={1.5} />
          <motion.div animate={screen === "notification" ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.5 }}>
            <Bell
              className="h-3 w-3"
              strokeWidth={1.5}
              style={{ color: screen === "notification" ? "var(--frat-gold-light)" : "rgba(242,236,220,0.4)" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </FrameShell>
  );
}

// ---------------------------------------------------------------------------
// AI-Native Archive — a looping chat demo: question fades in, a three-dot
// "thinking" indicator plays, then the answer streams in word by word before
// the whole exchange resets to the next question. All timed off one
// useEffect state machine so it's fully deterministic and reduced-motion-safe.
// ---------------------------------------------------------------------------

const QA_PAIRS = [
  {
    q: "Who from Batch ’99-A is in engineering consultancy?",
    a: "Engr. Andres Buenaventura Lim, ’99-A — Managing Director of an engineering consultancy.",
    source: "Citations Register",
  },
  {
    q: "Any brods working in renewable energy?",
    a: "Engr. Marcus Andres Villareal, ’95-A — founding partner of a solar and rural-electrification firm.",
    source: "Citations Register",
  },
];

function TypingDots() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-[var(--frat-gold-light)]/70"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: EASE }}
        />
      ))}
    </div>
  );
}

function StreamingAnswer({ text }: { text: string }) {
  const words = text.split(" ");
  return (
    <p className="mt-2 text-xs leading-relaxed text-[var(--frat-cream)]/80">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, delay: i * 0.045 }}
        >
          {word}{" "}
        </motion.span>
      ))}
    </p>
  );
}

type ChatPhase = "question" | "thinking" | "answering" | "hold";

export function AiArchiveMockup() {
  const reduceMotion = useReducedMotion();
  const [pairIndex, setPairIndex] = useState(0);
  const [phase, setPhase] = useState<ChatPhase>("question");

  useEffect(() => {
    if (reduceMotion) return;
    const durations: Record<ChatPhase, number> = { question: 700, thinking: 1100, answering: 2400, hold: 2200 };
    const order: ChatPhase[] = ["question", "thinking", "answering", "hold"];
    const timer = setTimeout(() => {
      const next = order[(order.indexOf(phase) + 1) % order.length];
      if (next === "question" && phase === "hold") {
        setPairIndex((p) => (p + 1) % QA_PAIRS.length);
      }
      setPhase(next);
    }, durations[phase]);
    return () => clearTimeout(timer);
  }, [phase, reduceMotion]);

  const pair = QA_PAIRS[pairIndex];
  const showAnswer = phase === "answering" || phase === "hold" || reduceMotion;

  return (
    <FrameShell>
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.7, ease: EASE }}
        className="w-full max-w-sm space-y-3"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${pairIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="ml-auto max-w-[80%] border border-[var(--hairline)] bg-[var(--frat-gold)]/10 px-4 py-2.5"
          >
            <p className="text-xs text-[var(--frat-cream)]/85">{pair.q}</p>
          </motion.div>
        </AnimatePresence>

        <motion.div
          layout
          transition={{ duration: 0.3 }}
          className="mr-auto max-w-[85%] border border-[var(--hairline)] bg-[var(--canvas)] px-4 py-3"
        >
          <div className="flex items-center gap-1.5 text-[var(--frat-gold-light)]">
            <Sparkles className="h-3 w-3" strokeWidth={1.5} />
            <span className="font-mono text-[8px] tracking-[0.15em] uppercase">Archive Copilot</span>
          </div>

          {!showAnswer && (phase === "thinking" || (!reduceMotion && phase === "question")) ? <TypingDots /> : null}

          {showAnswer ? (
            <>
              <StreamingAnswer key={`a-${pairIndex}`} text={pair.a} />
              <motion.p
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduceMotion ? 0 : 1.4 }}
                className="mt-2 font-mono text-[8px] tracking-[0.15em] text-[var(--frat-gold)]/70 uppercase"
              >
                Source: {pair.source}
              </motion.p>
            </>
          ) : null}
        </motion.div>
      </motion.div>
    </FrameShell>
  );
}
