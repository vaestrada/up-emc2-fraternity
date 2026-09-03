import type { Metadata } from "next";
import Image from "next/image";
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
    "Pickleball opened the fraternity's alumni sports series on 22 August 2026. The next edition follows once it is certain.",
  openGraph: {
    title: "Quantum Leap Sports Series 2026 · Pickleball",
    description:
      "Pickleball opened the fraternity's alumni sports series on 22 August 2026. The next edition follows once it is certain.",
    images: [
      {
        url: "/quantum-leap/pickleball-2026-og.png",
        width: 1200,
        height: 630,
        alt: "Quantum Leap Sports Series 2026, Pickleball. 22 August 2026. Venue to be announced.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/quantum-leap/pickleball-2026-og.png"],
  },
};

// Only facts that have cleared a decision gate appear here. Pricing, packages,
// and the beneficiary entity are deliberately absent: see
// second-brain/04_projects/emc2-fraternity-board-and-pickleball-2026.md.
//
// 22 August 2026 has passed. Until the committee supplies the edition's
// record (venue, turnout, photos — /contribute is the route), the page
// speaks of the first edition in the past tense and of the series ahead in
// the future, and never says "to be announced" about a day that has been.
const FACTS = [
  { k: "Date", v: "22 August 2026", note: "Saturday · Edition one" },
  { k: "Sport", v: "Pickleball", note: "Clinic and social tournament" },
  { k: "Next edition", v: "To be announced", note: "Sport, date, and venue once certain" },
];

const SERIES = [
  { n: "01", sport: "Pickleball", status: "August 2026" },
  { n: "02", sport: "To be announced", status: "Planned" },
  { n: "03", sport: "To be announced", status: "Planned" },
];

export default function QuantumLeapPage() {
  return (
    <>
      <PageHero
        eyebrow="Quantum Leap Sports Series, 2026"
        title="Pickleball"
        description="The first edition of the fraternity's alumni sports series, held 22 August 2026. One sport at a time, played well."
      />

      {/* ── The plate ─────────────────────────────────────────────── */}
      <section className="border-b border-[var(--hairline)] py-24">
        <Container>
          <div className="grid items-center gap-14 md:grid-cols-[1.1fr_1fr] md:gap-20">
            <Reveal>
              <div className="relative border border-[var(--hairline)]">
                <Image
                  src="/quantum-leap/pickleball-2026-poster.png"
                  alt="A pickleball player silhouetted mid-serve at golden hour. Quantum Leap Sports Series 2026: Pickleball. 22 August 2026, Saturday. Venue to be announced."
                  width={2160}
                  height={2700}
                  className="w-full"
                  priority
                />
              </div>
              <div className="mt-3 flex items-baseline justify-between gap-4">
                <p className="caption">
                  Fig. 01 — First edition plate
                </p>
                <a
                  href="/quantum-leap/pickleball-2026-poster.png"
                  download
                  className="label underline-offset-4 transition-colors hover:text-[var(--brand)] hover:underline"
                >
                  Download the plate
                </a>
              </div>
            </Reveal>

            <div>
              <Reveal>
                <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.9rem)] leading-[1.06] text-[var(--fg)]">
                  One sport.
                  <br />
                  One day.
                  <br />
                  One clear offer.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-md leading-relaxed text-[var(--fg)]/65">
                  A one-day pickleball clinic and social tournament for alumni,
                  their families, and invited guests. Pickleball leads the series
                  because it welcomes complete beginners and seasoned players onto
                  the same court within an afternoon.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="mt-4 max-w-md leading-relaxed text-[var(--fg)]/65">
                  The next edition&rsquo;s sport, venue, and registration follow once each is
                  secured. Nothing is announced before it is certain. Were you on the court
                  on the 22nd?{" "}
                  <Link href="/contribute" className="text-[var(--brand)] underline underline-offset-4">
                    Send the photos in
                  </Link>{" "}
                  and the first edition takes its place in the record.
                </p>
              </Reveal>

              <Reveal delay={0.2}>
                <dl className="mt-10 border-t border-[var(--hairline)]">
                  {FACTS.map((f) => (
                    <div
                      key={f.k}
                      className="grid grid-cols-[7rem_1fr] items-baseline gap-4 border-b border-[var(--hairline)] py-4"
                    >
                      <dt className="label">
                        {f.k}
                      </dt>
                      <dd className="flex flex-wrap items-baseline gap-x-3">
                        <span className="font-sans text-[19px] font-bold text-[var(--fg)]">
                          {f.v}
                        </span>
                        <span className="caption">
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

      {/* ── The teaser ────────────────────────────────────────────── */}
      <section className="border-b border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <p className="label">
              The teaser
            </p>
          </Reveal>
          <div className="mt-12 grid items-center gap-14 md:grid-cols-[1fr_1.05fr] md:gap-20">
            <Reveal>
              <div className="mx-auto w-full max-w-[380px]">
                <TeaserVideo
                  src="/quantum-leap/pickleball-2026-teaser.mp4"
                  poster="/quantum-leap/pickleball-2026-teaser-poster.jpg"
                />
              </div>
            </Reveal>
            <div>
              <Reveal>
                <h2 className="font-display text-[clamp(1.8rem,3.2vw,2.7rem)] leading-[1.08] text-[var(--fg)]">
                  First serve, 22 August.
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-md leading-relaxed text-[var(--fg)]/65">
                  Nineteen seconds, shot for the feed ahead of the first edition. Share it
                  with a brod who has not been back to a court in a while. The series
                  continues.
                </p>
              </Reveal>
              <Reveal delay={0.15}>
                <a
                  href="/quantum-leap/pickleball-2026-teaser.mp4"
                  download
                  className={cn(
                    buttonVariants({ variant: "outline", size: "sm" }),
                    "mt-8"
                  )}
                >
                  Download the teaser
                </a>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* ── The series ────────────────────────────────────────────── */}
      <section className="py-24">
        <Container>
          <Reveal>
            <p className="label">
              The series
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-6 max-w-2xl font-display text-[clamp(1.8rem,3.2vw,2.7rem)] leading-[1.08] text-[var(--fg)]">
              Pickleball is the first edition, not the whole programme.
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--fg)]/65">
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
                  <span className="caption tabular-nums">
                    {e.n}
                  </span>
                  <span
                    className={cn(
                      "font-display text-xl md:text-2xl",
                      e.n === "01"
                        ? "text-[var(--fg)]"
                        : "text-[var(--fg)]/35"
                    )}
                  >
                    {e.sport}
                  </span>
                  <span className="caption">
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
