import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Sparkles, HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { roadmap, type RoadmapPhase } from "@/lib/content";
import {
  PortalScreenshot,
  DuesMockup,
  CheckoutMockup,
  NewsletterMockup,
  CompanionAppMockup,
  AiArchiveMockup,
} from "@/components/site/roadmap-mockups";

export const metadata: Metadata = {
  title: "What's Next",
  description:
    "Where the fraternity's digital home is headed — what's live, what's committed, and what's still a direction rather than a promise.",
};

const PHASES: { key: RoadmapPhase; eyebrow: string; title: string; note: string }[] = [
  {
    key: "now",
    eyebrow: "Shipped",
    title: "Live Today",
    note: "Built, deployed, and in use.",
  },
  {
    key: "next",
    eyebrow: "Committed",
    title: "Next",
    note: "Underway — timing depends on an outside approval, not on effort.",
  },
  {
    key: "future",
    eyebrow: "Direction",
    title: "Future",
    note: "Where this is built to grow, once the fundamentals earn it. Not a promise, not a live product.",
  },
];

// Each roadmap item gets a visual — a real screenshot for what's shipped, a
// concept mockup for what isn't built yet. Keyed by title so lib/content.ts
// stays UI-free.
const VISUALS: Record<string, React.ReactNode> = {
  "The Member Portal": <PortalScreenshot />,
  "Dues, Recorded Honestly": <DuesMockup />,
  "Checkout, Once KYB Clears": <CheckoutMockup />,
  "The Newsletter": <NewsletterMockup />,
  "A Companion App": <CompanionAppMockup />,
  "An AI-Native Archive": <AiArchiveMockup />,
};

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="№ 09 — The Next Quantum Leap"
        title="What's Next"
        description="This site is a beginning, not a finished monument. Here's what's already live, what's committed, and what's still just a direction — said plainly, so nothing here reads as a promise it isn't."
      />

      {PHASES.map((phase, phaseIndex) => {
        const items = roadmap.filter((r) => r.phase === phase.key);
        if (items.length === 0) return null;
        return (
          <section
            key={phase.key}
            className={cn(
              "border-t border-[var(--hairline)] py-20",
              phaseIndex % 2 === 1 ? "bg-[var(--ink)]" : ""
            )}
          >
            <Container>
              <Reveal>
                <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                  {phase.eyebrow}
                </p>
                <h2 className="mt-4 font-display text-3xl text-[var(--frat-cream)] md:text-4xl">
                  {phase.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--frat-cream)]/60">
                  {phase.note}
                </p>
              </Reveal>

              <div className="mt-12 grid gap-8 md:grid-cols-2">
                {items.map((item, i) => (
                  <Reveal key={item.title} delay={(i % 2) * 0.08} className="h-full">
                    <div className="flex h-full flex-col border border-[var(--hairline)] bg-[var(--canvas)]">
                      {VISUALS[item.title] ?? null}
                      <div className="flex flex-1 flex-col gap-3 p-8">
                        <div className="flex items-center gap-3">
                          {phase.key === "now" ? (
                            <CheckCircle2 className="h-5 w-5 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
                          ) : phase.key === "future" ? (
                            <Sparkles className="h-5 w-5 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
                          ) : (
                            <ArrowRight className="h-5 w-5 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
                          )}
                          <h3 className="font-display text-xl text-[var(--frat-cream)]">{item.title}</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--frat-cream)]/70">{item.body}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Container>
          </section>
        );
      })}

      {/* Build This With Us — the volunteer / give-back path */}
      <section className="border-t border-[var(--hairline)] py-24">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
              <HeartHandshake className="h-6 w-6 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
            </div>
            <h2 className="mt-6 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              None of this gets built alone.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-[var(--frat-cream)]/70">
              This site — like the brotherhood itself — is built by whoever shows up. If you have a
              photo from the archive, a citation worth adding, a correction, or the time and skill to
              help build what&rsquo;s above, the brotherhood needs it more than it needs another set of
              good intentions.
            </p>
            <p className="mt-4 font-serif text-lg italic text-[var(--frat-gold-light)]">
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
