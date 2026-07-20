import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { TeaserVideo } from "@/components/site/teaser-video";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Quantum Leap Sports Series",
  description:
    "Energy, Returned. The fraternity's alumni sports series opens with Pickleball on 22 August 2026.",
  openGraph: {
    title: "Quantum Leap Sports Series · Pickleball 2026",
    description:
      "Energy, Returned. The fraternity's alumni sports series opens with Pickleball on 22 August 2026.",
    images: [
      {
        url: "/quantum-leap/pickleball-2026-og.png",
        width: 1200,
        height: 630,
        alt: "Quantum Leap Sports Series · Pickleball 2026. Energy, Returned. 22 August 2026.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/quantum-leap/pickleball-2026-og.png"],
  },
};

// Only facts that have cleared a decision gate appear here. Venue, pricing,
// packages, and the beneficiary entity are deliberately absent: see
// second-brain/04_projects/emc2-fraternity-board-and-pickleball-2026.md.
const FACTS = [
  { k: "Date", v: "22 August 2026", note: "Saturday" },
  { k: "Sport", v: "Pickleball", note: "Edition one" },
  { k: "Venue", v: "Reveal soon", note: "Metro Manila" },
];

const SERIES = [
  { n: "01", sport: "Pickleball", status: "2026" },
  { n: "02", sport: "To be announced", status: "Planned" },
  { n: "03", sport: "To be announced", status: "Planned" },
];

export default function QuantumLeapPage() {
  return (
    <>
      <PageHero
        eyebrow="№ 07 — Quantum Leap"
        title="Energy, Returned."
        description="The fraternity's alumni sports series. One sport at a time, played well, beginning with Pickleball in August 2026."
      />

      {/* ── The plate ─────────────────────────────────────────────── */}
      <section className="border-b border-[var(--hairline)] py-24">
        <Container>
          <div className="grid items-center gap-14 md:grid-cols-[1.1fr_1fr] md:gap-20">
            <Reveal>
              <div className="mx-auto max-w-[420px]">
                <TeaserVideo
                  src="/quantum-leap/pickleball-2026-teaser.mp4"
                  poster="/quantum-leap/pickleball-2026-teaser-poster.jpg"
                />
                <div className="mt-3 flex items-baseline justify-between gap-4">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/50 uppercase">
                    Fig. 01 — First edition teaser
                  </p>
                  <a
                    href="/quantum-leap/pickleball-2026-poster.png"
                    download
                    className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold)] uppercase underline-offset-4 transition-colors hover:text-[var(--frat-gold-light)] hover:underline"
                  >
                    Poster ↓
                  </a>
                </div>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.06] text-[var(--frat-cream)]">
                  One sport.
                  <br />
                  One day.
                  <br />
                  One clear offer.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-md leading-relaxed text-[var(--frat-cream)]/65">
                  A one-day pickleball clinic and social tournament for alumni,
                  their families, and invited guests. Pickleball leads the series
                  because it welcomes complete beginners and seasoned players onto
                  the same court within an afternoon.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 max-w-md leading-relaxed text-[var(--frat-cream)]/65">
                  Programme, venue, and registration follow once each is secured.
                  Nothing is announced before it is certain.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <dl className="mt-10 border-t border-[var(--hairline)]">
                  {FACTS.map((f) => (
                    <div
                      key={f.k}
                      className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-[var(--hairline)] py-4"
                    >
                      <dt className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold)] uppercase">
                        {f.k}
                      </dt>
                      <dd className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-display text-xl text-[var(--frat-cream)]">
                          {f.v}
                        </span>
                        <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/50 uppercase">
                          {f.note}
                        </span>
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ── Why the name ──────────────────────────────────────────── */}
      <section className="blueprint border-b border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              The motto
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-8 max-w-3xl font-serif text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.35] text-[var(--frat-cream)] italic">
              A quantum leap is a jump to a higher energy state. The fraternity is
              named for the equivalence of mass and energy. So the series takes its
              measure from the same physics: energy put in, energy returned.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-8 max-w-xl leading-relaxed text-[var(--frat-cream)]/60">
              Brothers return to the court. Support returns to the brotherhood. The
              ball returns across the net. Three readings, one line.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── The series ────────────────────────────────────────────── */}
      <section className="py-24">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              The series
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(1.8rem,3.2vw,2.7rem)] leading-[1.08] text-[var(--frat-cream)]">
              Pickleball is the first edition, not the whole programme.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--frat-cream)]/65">
              Quantum Leap is built to repeat. If the first edition runs well, the
              series continues into other sports, each one its own edition under the
              same banner.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-14 border-t border-[var(--hairline)]">
              {SERIES.map((e) => (
                <div
                  key={e.n}
                  className="grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 border-b border-[var(--hairline)] py-6 md:gap-x-10"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--frat-gold)]">
                    {e.n}
                  </span>
                  <span
                    className={cn(
                      "font-display text-xl md:text-2xl",
                      e.n === "01"
                        ? "text-[var(--frat-cream)]"
                        : "text-[var(--frat-cream)]/35"
                    )}
                  >
                    {e.sport}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/50 uppercase">
                    {e.status}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.25}>
            <div className="mt-16 flex flex-wrap items-center gap-4">
              <Link
                href="/contact"
                className={cn(buttonVariants({ variant: "accent", size: "sm" }))}
              >
                Ask about the series
              </Link>
              <Link
                href="/donate"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
              >
                Give Back
              </Link>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
