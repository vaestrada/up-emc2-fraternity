import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { roadmap, type RoadmapPhase } from "@/lib/content";
import {
  PortalScreenshot,
  DuesMockup,
  AdminQueueMockup,
  CheckoutMockup,
  NewsletterMockup,
  PipelineMockup,
  CompanionAppMockup,
  AiArchiveMockup,
  LedgerMockup,
} from "@/components/site/roadmap-mockups";

export const metadata: Metadata = {
  title: "What's Next",
  description:
    "Where the fraternity's digital home is headed — what's live, what's committed, and what's still a direction rather than a promise.",
};

const PHASES: { key: RoadmapPhase; number: string; eyebrow: string; title: string; note: string }[] = [
  {
    key: "now",
    number: "09.1",
    eyebrow: "Shipped",
    title: "Live Today",
    note: "Built, deployed, and in use. What you see on the left is the real thing.",
  },
  {
    key: "next",
    number: "09.2",
    eyebrow: "Committed",
    title: "Next",
    note: "Underway. Timing depends on an outside approval or a named volunteer, not on effort.",
  },
  {
    key: "future",
    number: "09.3",
    eyebrow: "Direction",
    title: "Future",
    note: "Where this is built to grow once the fundamentals earn it. Not a promise, not a live product.",
  },
];

/* Each roadmap item gets a visual — a real capture for what's shipped, a
   concept for what isn't. Keyed by title so lib/content.ts stays UI-free. */
const VISUALS: Record<string, React.ReactNode> = {
  "The Member Portal": <PortalScreenshot />,
  "Dues, Recorded Honestly": <DuesMockup />,
  "The Board's Queue": <AdminQueueMockup />,
  "Checkout, Once KYB Clears": <CheckoutMockup />,
  "The Newsletter": <NewsletterMockup />,
  "Publishing from Google Drive": <PipelineMockup />,
  "A Companion App": <CompanionAppMockup />,
  "An AI-Native Archive": <AiArchiveMockup />,
  "The Assistance Fund, Endowed": <LedgerMockup />,
};

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="The Next Quantum Leap"
        title="What's Next"
        description="What is live, what is committed, and what is still a direction, said plainly so nothing here reads as a promise it is not."
      />

      {/* The index — three phases, jump links, counts. A reader lands knowing
          the shape of the whole before scrolling any of it. */}
      <section className="border-b border-[var(--hairline)] bg-[var(--tint)]">
        <Container className="grid md:grid-cols-3">
          {PHASES.map((phase, i) => {
            const count = roadmap.filter((r) => r.phase === phase.key).length;
            return (
              <a
                key={phase.key}
                href={`#${phase.key}`}
                className={cn(
                  "group flex items-baseline justify-between gap-6 px-6 py-7 transition-colors hover:bg-[var(--frat-gold)]/5 md:px-8",
                  i > 0 && "border-t border-[var(--hairline)] md:border-t-0 md:border-l"
                )}
              >
                <span>
                  <span className="label block">
                    {phase.eyebrow}
                  </span>
                  <span className="mt-2 block font-display text-2xl text-[var(--fg)] transition-colors group-hover:text-[var(--brand)]">
                    {phase.title}
                  </span>
                </span>
                <span className="font-display text-4xl text-[var(--brand)]/70">
                  {String(count).padStart(2, "0")}
                </span>
              </a>
            );
          })}
        </Container>
      </section>

      {PHASES.map((phase, phaseIndex) => {
        const items = roadmap.filter((r) => r.phase === phase.key);
        if (items.length === 0) return null;
        return (
          <section
            key={phase.key}
            id={phase.key}
            className={cn(
              "scroll-mt-24 border-t border-[var(--hairline)] py-24",
              phaseIndex % 2 === 1 ? "bg-[var(--tint)]" : ""
            )}
          >
            <Container>
              <Reveal>
                <p className="label">
                  {phase.eyebrow}
                </p>
                <h2 className="mt-7 display text-[2rem] md:text-[2.75rem]">
                  {phase.title}
                </h2>
                <p className="prose-archive mt-6 text-[15px] leading-relaxed">
                  {phase.note}
                </p>
              </Reveal>

              {/* Editorial rows, not a card grid: the visual gets half the
                  width and enough height to be looked at, the text sits
                  beside it, and sides alternate so the eye travels. */}
              <div className="mt-16 space-y-20 md:space-y-24">
                {items.map((item, i) => {
                  const flip = i % 2 === 1;
                  return (
                    <Reveal key={item.title} delay={0.05}>
                      <article className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                        <div className={cn("h-full", flip && "md:order-2")}>{VISUALS[item.title] ?? null}</div>
                        <div className={cn(flip && "md:order-1")}>
                          <p className="label">
                            Entry {phase.number}.{i + 1}
                          </p>
                          <div className="mt-4">
                            <h3 className="font-sans text-[28px] font-bold leading-tight text-[var(--fg)]">
                              {item.title}
                            </h3>
                          </div>
                          <p className="prose-archive mt-5 text-[17px] leading-[1.7]">
                            {item.body}
                          </p>
                          {item.title === "The Member Portal" ? (
                            <Link
                              href="/portal"
                              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-7")}
                            >
                              Enter the Portal
                            </Link>
                          ) : item.title === "Dues, Recorded Honestly" ? (
                            <Link
                              href="/portal/dues"
                              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-7")}
                            >
                              Record your dues
                            </Link>
                          ) : item.title === "The Assistance Fund, Endowed" ? (
                            <Link
                              href="/anniversary"
                              className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-7")}
                            >
                              Read about the fund
                            </Link>
                          ) : null}
                        </div>
                      </article>
                    </Reveal>
                  );
                })}
              </div>
            </Container>
          </section>
        );
      })}

      {/* Build This With Us — the volunteer / give-back path */}
      <section className="border-t border-[var(--hairline)] py-24">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <h2 className="mt-6 display text-[2rem] md:text-[2.75rem]">
              None of this gets built alone.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-[var(--fg)]/70">
              This site, like the brotherhood itself, is built by whoever shows up. If you have a
              photograph from the archive, a citation worth adding, a correction, or the time and skill
              to help build what is above, the brotherhood needs it.
            </p>
            <p className="lead mt-4">
              Add to the record. Or help build the next one.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/contribute" className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
              Add to the Archive
            </Link>
            <Link href="/contact" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Offer to Help Build
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
