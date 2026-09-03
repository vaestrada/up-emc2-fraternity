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
  Download,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { Counter } from "@/components/motion/counter";

/* Every mockup on /roadmap lives here, keyed by the roadmap item's title in
   app/roadmap/page.tsx. Three rules keep them honest and consistent:

   1. Shipped items show the real thing (a screenshot, or the actual UI
      re-drawn) and carry a "Live" chip; unbuilt items carry "Concept".
   2. One easing (Apple's ease-out quint) and one spring for everything, so
      a CSS button and a JS phone feel like the same product.
   3. Every mockup is aria-hidden: it decorates the card's real heading and
      body, which already say everything a screen reader needs, and looping
      DOM text would otherwise be announced as noise. */

const EASE = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 300, damping: 30, mass: 0.8 } as const;

function Chip({ label }: { label: string }) {
  return (
    <span className="absolute top-3 right-3 z-10 border border-[var(--frat-gold)]/60 bg-[var(--ink)]/80 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-[var(--frat-gold-light)] uppercase backdrop-blur-sm">
      {label}
    </span>
  );
}

/* The stage every mockup sits on: ink ground, faint drafting grid, hairline
   frame. Tall enough that the object inside reads at arm's length, which the
   previous 320px slot never allowed. */
function Stage({ children, chip }: { children: React.ReactNode; chip: string }) {
  return (
    <div
      aria-hidden="true"
      className="blueprint relative flex h-full min-h-[380px] items-center justify-center overflow-hidden border border-[var(--hairline)] bg-[var(--ink)] p-8 md:min-h-[440px]"
    >
      <Chip label={chip} />
      {children}
    </div>
  );
}

/* Rises into place once, like every Reveal on the site. */
function Rise({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Shipped ─────────────────────────────────────────────────────────────── */

/** The live /portal sign-in, captured from production on 2026-09-03. */
export function PortalScreenshot() {
  return (
    <div className="group relative h-full min-h-[380px] overflow-hidden border border-[var(--hairline)] bg-[var(--ink)] md:min-h-[440px]">
      <Image
        src="/roadmap/portal-sign-in.png"
        alt="The live Member Portal sign-in page"
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover object-left-top transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.02]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-2 border border-[var(--frat-gold)]/15" />
      <Chip label="Live — captured from production" />
    </div>
  );
}

export function DuesMockup() {
  const reduceMotion = useReducedMotion();
  return (
    <Stage chip="Live — the real form">
      <Rise className="w-full max-w-sm border border-[var(--hairline)] bg-[var(--canvas)] p-7">
        <motion.div
          className="flex items-center gap-2 text-[var(--frat-gold-light)]"
          initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ ...SPRING, delay: 0.3 }}
        >
          <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase">Recorded, Brod</p>
        </motion.div>
        <p className="mt-5 font-display text-4xl text-[var(--frat-cream)]">₱500.00</p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/50 uppercase">
          AY 2026&ndash;2027 &middot; GCash &middot; Ref. 1029&hellip;
        </p>
        <div className="mt-6 grid grid-cols-4 gap-2">
          {[Wallet, CreditCard, Building2, Banknote].map((Icon, i) => (
            <motion.div
              key={i}
              initial={reduceMotion ? false : { opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.06, ease: EASE }}
              className={`flex h-11 items-center justify-center border ${i === 0 ? "border-[var(--frat-gold)] bg-[var(--frat-gold)]/10" : "border-[var(--hairline)]"}`}
            >
              <Icon className="h-4 w-4 text-[var(--frat-cream)]/70" strokeWidth={1.5} />
            </motion.div>
          ))}
        </div>
        <p className="mt-5 text-xs leading-relaxed text-[var(--frat-cream)]/50">
          Matched against the Association&rsquo;s own transfer history, then acknowledged by email.
        </p>
      </Rise>
    </Stage>
  );
}

/** The board's queue: three counters settling, then the export line. Figures
    are sample values — the structure is the real /admin. */
export function AdminQueueMockup() {
  const reduceMotion = useReducedMotion();
  const TILES = [
    { label: "58th list", value: 42, note: "31 coming · 8 likely" },
    { label: "Contributions", value: 5, note: "awaiting review" },
    { label: "Pledges", value: 7, note: "2 to acknowledge" },
  ];
  return (
    <Stage chip="Live — sample figures">
      <Rise className="w-full max-w-md border border-[var(--hairline)] bg-[var(--canvas)]">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] px-5 py-3">
          <p className="font-mono text-[9px] tracking-[0.25em] text-[var(--frat-gold)] uppercase">
            The Register &mdash; Moderation
          </p>
          <ShieldCheck className="h-4 w-4 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
        </div>
        <div className="grid grid-cols-3 divide-x divide-[var(--hairline)]">
          {TILES.map((t) => (
            <div key={t.label} className="px-4 py-5">
              <p className="font-mono text-[8px] tracking-[0.2em] text-[var(--frat-cream)]/50 uppercase">{t.label}</p>
              <p className="mt-2 font-display text-3xl text-[var(--frat-gold-light)]">
                <Counter to={t.value} duration={1.4} />
              </p>
              <p className="mt-1 text-[10px] leading-snug text-[var(--frat-cream)]/50">{t.note}</p>
            </div>
          ))}
        </div>
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, x: -10 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 1.2, ease: EASE }}
          className="flex items-center justify-between border-t border-[var(--hairline)] px-5 py-3"
        >
          <span className="flex items-center gap-2 text-xs text-[var(--frat-cream)]/70">
            <FileText className="h-3.5 w-3.5 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
            emc2-anniversary_rsvps-2026-09-03.csv
          </span>
          <motion.span
            animate={reduceMotion ? {} : { y: [0, 3, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: 1.8 }}
            className="flex items-center gap-1 font-mono text-[9px] tracking-[0.2em] text-[var(--frat-gold-light)] uppercase"
          >
            <Download className="h-3 w-3" strokeWidth={1.75} /> CSV
          </motion.span>
        </motion.div>
      </Rise>
    </Stage>
  );
}

/* ── Committed ───────────────────────────────────────────────────────────── */

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
    <Stage chip="Concept — waits on KYB">
      <Rise className="w-full max-w-sm border border-[var(--hairline)] bg-[var(--canvas)] p-7">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--frat-gold)] uppercase">Pay Dues</p>
        <p className="mt-2 font-display text-4xl text-[var(--frat-cream)]">₱500.00</p>
        <div className="mt-6 space-y-2">
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
          className="mt-6 flex h-12 items-center justify-center bg-[var(--frat-gold)] font-mono text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase"
        >
          Pay ₱500.00
        </motion.div>
      </Rise>
    </Stage>
  );
}

export function NewsletterMockup() {
  const reduceMotion = useReducedMotion();
  const ITEMS = [
    { Icon: Sparkles, text: "A new citation inscribed — a brod recognised for public service." },
    { Icon: Bell, text: "Save the date — the 58th Anniversary, February 2027." },
    { Icon: Send, text: "A gentle dues reminder, only if yours has lapsed." },
  ];
  return (
    <Stage chip="Concept">
      <Rise className="w-full max-w-md border border-[var(--hairline)] bg-[var(--canvas)]">
        <div className="border-b border-[var(--hairline)] p-5">
          <p className="font-mono text-[9px] tracking-[0.15em] text-[var(--frat-cream)]/50 uppercase">
            From: EMC² Fraternity Alumni Association
          </p>
          <p className="mt-1 font-display text-xl text-[var(--frat-cream)]">The Quarterly Dispatch</p>
        </div>
        <div className="space-y-4 p-5">
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
              <p className="text-sm leading-relaxed text-[var(--frat-cream)]/70">{text}</p>
            </motion.div>
          ))}
        </div>
      </Rise>
    </Stage>
  );
}

/** Google Doc → Content Log → the archive. Three stations, a token moving
    between them. */
export function PipelineMockup() {
  const reduceMotion = useReducedMotion();
  const STATIONS = ["Google Doc", "Content Log", "The Archive"];
  const [stage, setStage] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setStage((s) => (s + 1) % STATIONS.length), 1700);
    return () => clearInterval(id);
  }, [reduceMotion, STATIONS.length]);

  return (
    <Stage chip="Committed — first run this month">
      <Rise className="w-full max-w-md">
        <div className="relative grid grid-cols-3 gap-3">
          {/* the rail */}
          <div aria-hidden className="absolute top-1/2 right-[16%] left-[16%] h-px -translate-y-1/2 bg-[var(--hairline)]" />
          {STATIONS.map((s, i) => {
            const on = i === stage || reduceMotion;
            return (
              <motion.div
                key={s}
                animate={{
                  borderColor: on ? "var(--frat-gold)" : "var(--hairline)",
                  backgroundColor: on ? "rgba(195,143,14,0.08)" : "var(--canvas)",
                }}
                transition={{ duration: 0.4, ease: EASE }}
                className="relative flex h-28 flex-col items-center justify-center border px-2 text-center"
              >
                <FileText className="h-5 w-5 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
                <p className="mt-3 font-mono text-[9px] tracking-[0.15em] text-[var(--frat-cream)]/80 uppercase">{s}</p>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-5 flex items-center justify-between border border-[var(--hairline)] bg-[var(--canvas)] px-4 py-3">
          <p className="font-mono text-[9px] tracking-[0.15em] text-[var(--frat-cream)]/60 uppercase">
            Status
          </p>
          <AnimatePresence mode="wait">
            <motion.p
              key={stage}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="font-mono text-[9px] tracking-[0.15em] text-[var(--frat-gold-light)] uppercase"
            >
              {["Ready for review", "Approved", "Published"][stage]}
            </motion.p>
          </AnimatePresence>
        </div>
      </Rise>
    </Stage>
  );
}

/* ── Direction ───────────────────────────────────────────────────────────── */

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
      <div className="mt-2 flex items-center gap-2 border-b border-[var(--hairline)] px-4 pb-2">
        <div className="h-3 w-3 rounded-full bg-[var(--frat-gold)]" />
        <p className="font-mono text-[9px] tracking-[0.15em] text-[var(--frat-cream)] uppercase">Directory</p>
      </div>
      <div className="space-y-2 px-3 py-3">
        {["Ison, R. ’84-F", "Salanguit, E. ’03-B", "dela Cruz, J. ’12-A"].map((name, i) => (
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.3, ease: EASE }}
            className="flex items-center gap-2 border border-[var(--hairline)] px-2 py-1.5"
          >
            <div className="h-4 w-4 shrink-0 rounded-full bg-[var(--frat-gold)]/30" />
            <span className="truncate text-[9px] text-[var(--frat-cream)]/75">{name}</span>
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
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--frat-gold)]/15"
      >
        <CheckCircle2 className="h-6 w-6 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
      </motion.div>
      <p className="mt-3 font-mono text-[9px] tracking-[0.15em] text-[var(--frat-cream)] uppercase">Dues Recorded</p>
      <p className="mt-1 font-display text-xl text-[var(--frat-gold-light)]">₱500.00</p>
    </motion.div>
  );
}

function NotificationScreen() {
  return (
    <motion.div key="notification" className="absolute inset-0 overflow-hidden">
      <motion.div
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 12, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={SPRING}
        className="mx-3 flex items-start gap-2 border border-[var(--hairline)] bg-[var(--ink)] p-3 shadow-lg"
      >
        <Bell className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
        <div className="min-w-0">
          <p className="font-mono text-[8px] tracking-[0.1em] text-[var(--frat-cream)] uppercase">EMC² Portal</p>
          <p className="mt-0.5 text-[9px] leading-snug text-[var(--frat-cream)]/70">
            58th Anniversary — tickets open Monday
          </p>
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
    <Stage chip="Concept">
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative h-[22rem] w-[11rem] overflow-hidden rounded-[2rem] border-4 border-[var(--frat-cream)]/15 bg-[var(--canvas)] shadow-2xl"
      >
        <div className="flex items-center justify-between px-4 pt-3 text-[var(--frat-cream)]/70">
          <span className="font-mono text-[9px]">9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="h-3 w-3" strokeWidth={2} />
            <BatteryFull className="h-3 w-3" strokeWidth={2} />
          </div>
        </div>

        <div className="mt-2 flex gap-1 px-4">
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

        <div className="relative mt-2 h-[calc(100%-96px)]">
          <AnimatePresence mode="wait">
            {screen === "directory" ? <DirectoryScreen /> : screen === "dues" ? <DuesScreen /> : <NotificationScreen />}
          </AnimatePresence>
        </div>

        <div className="absolute right-0 bottom-0 left-0 flex items-center justify-around border-t border-[var(--hairline)] bg-[var(--ink)] py-2.5">
          <Home
            className="h-4 w-4"
            strokeWidth={1.5}
            style={{ color: screen === "directory" || screen === "dues" ? "var(--frat-gold-light)" : "rgba(242,236,220,0.4)" }}
          />
          <Users className="h-4 w-4 text-[var(--frat-cream)]/40" strokeWidth={1.5} />
          <motion.div animate={screen === "notification" ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 0.5 }}>
            <Bell
              className="h-4 w-4"
              strokeWidth={1.5}
              style={{ color: screen === "notification" ? "var(--frat-gold-light)" : "rgba(242,236,220,0.4)" }}
            />
          </motion.div>
        </div>
      </motion.div>
    </Stage>
  );
}

/* Real facts only, from lib/content.ts — a copilot that answered with
   invented brods would be the wrong first impression of an archive. */
const QA_PAIRS = [
  {
    q: "Who from Batch ’84-F has a citation?",
    a: "Engr. Ronaldo S. “Rannie” Ison, ’84-F — recognised by ASEP as an Outstanding Structural Engineer.",
    source: "Citations register",
  },
  {
    q: "When was the 55th Anniversary held?",
    a: "24 February 2024, at Bahay ng Alumni, U.P. Diliman — brods across generations gathered to mark 55 years.",
    source: "Milestones · 2024",
  },
  {
    q: "What did the brotherhood do during the pandemic?",
    a: "The 2020 COVID-19 Relief Operations — packing and distributing goods to affected communities.",
    source: "The Ledger · Community Outreach",
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
    <p className="mt-2 text-sm leading-relaxed text-[var(--frat-cream)]/80">
      {words.map((word, i) => (
        <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.15, delay: i * 0.045 }}>
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
    const durations: Record<ChatPhase, number> = { question: 700, thinking: 1100, answering: 2600, hold: 2400 };
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
    <Stage chip="Concept">
      <Rise className="w-full max-w-md space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${pairIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="ml-auto max-w-[85%] border border-[var(--hairline)] bg-[var(--frat-gold)]/10 px-4 py-3"
          >
            <p className="text-sm text-[var(--frat-cream)]/85">{pair.q}</p>
          </motion.div>
        </AnimatePresence>

        <motion.div layout transition={{ duration: 0.3 }} className="mr-auto min-h-[7rem] max-w-[90%] border border-[var(--hairline)] bg-[var(--canvas)] px-4 py-3">
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
                transition={{ delay: reduceMotion ? 0 : 1.6 }}
                className="mt-2 font-mono text-[8px] tracking-[0.15em] text-[var(--frat-gold)]/70 uppercase"
              >
                Source: {pair.source}
              </motion.p>
            </>
          ) : null}
        </motion.div>
      </Rise>
    </Stage>
  );
}

/** The transparency ledger: four figures the fund would publish, no names. */
export function LedgerMockup() {
  const reduceMotion = useReducedMotion();
  const ROWS = [
    { label: "Raised", value: 100, amount: "₱—" },
    { label: "Disbursed", value: 62, amount: "₱—" },
    { label: "Balance", value: 38, amount: "₱—" },
  ];
  return (
    <Stage chip="Concept — figures to come">
      <Rise className="w-full max-w-md border border-[var(--hairline)] bg-[var(--canvas)] p-6">
        <p className="font-mono text-[9px] tracking-[0.25em] text-[var(--frat-gold)] uppercase">
          Brotherhood Assistance Fund &mdash; Ledger
        </p>
        <div className="mt-5 space-y-4">
          {ROWS.map((r, i) => (
            <div key={r.label}>
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">{r.label}</span>
                <span className="font-display text-lg text-[var(--frat-cream)]">{r.amount}</span>
              </div>
              <div className="mt-1.5 h-px w-full bg-[var(--hairline)]">
                <motion.div
                  className="h-px bg-[var(--frat-gold-light)]"
                  initial={reduceMotion ? { width: `${r.value}%` } : { width: 0 }}
                  whileInView={{ width: `${r.value}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.3 + i * 0.2, ease: EASE }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 flex items-center justify-between border-t border-[var(--hairline)] pt-4">
          <span className="font-mono text-[9px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">Brods assisted</span>
          <span className="font-display text-2xl text-[var(--frat-gold-light)]">
            <Counter to={4} duration={1.2} />
          </span>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-[var(--frat-cream)]/45">
          Published after every disbursement. Never a name on either side.
        </p>
      </Rise>
    </Stage>
  );
}
