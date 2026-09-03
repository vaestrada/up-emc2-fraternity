import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { BrodCard } from "@/components/site/brod-card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FOUNDING_YEAR, site, association, projects, prominentBrods, bulletin } from "@/lib/content";
import { withoutDemo } from "@/lib/demo";

// The root layout omits og/twitter title+description so every page self-describes.
// Declaring `openGraph` here REPLACES the layout's openGraph object (Next merges
// it shallowly); the image comes from app/opengraph-image.tsx, which survives.
export const metadata: Metadata = {
  openGraph: {
    description:
      "An exclusive Engineering and Physical Sciences brotherhood, founded in 1969 at the University of the Philippines College of Engineering.",
  },
};

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as React.CSSProperties;

const CREDO_LINES = [
  "Equality is our way of life.",
  "Loyalty and Obedience.",
  "Service and Sacrifice.",
  "Courage and Justice.",
];

const FACTS = [
  { term: "Founded", detail: `${FOUNDING_YEAR}, by ten scholars of the University` },
  { term: "Home", detail: "3rd Floor Lobby, Melchor Hall, U.P. Diliman" },
  { term: "Brods on record", detail: "490, batches 1967 to 2023" },
  { term: "Alumni Association", detail: `${association.legalName}, SEC-registered` },
];

export default function Home() {
  const brods = withoutDemo(prominentBrods).slice(0, 2);
  const years = new Date().getFullYear() - FOUNDING_YEAR;

  return (
    <>
      {/* ── Hero: one photograph, the name, one sentence, one action ───── */}
      <section className="relative flex min-h-[88svh] items-end overflow-hidden">
        <Image
          src="/photos/anniv55-outdoor.jpg"
          alt="Brods of every batch gathered before Quezon Hall at the 55th Anniversary Celebration, U.P. Diliman"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[50%_35%]"
        />
        {/* Two grounds so the text clears AA on any part of the frame. */}
        <div aria-hidden className="absolute inset-0 bg-[var(--ink)]/35" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/70 to-transparent" />

        <Container className="relative pt-44 pb-14 md:pb-20">
          <p className="hero-reveal label" style={delay(0)}>
            University of the Philippines · College of Engineering · Est. {FOUNDING_YEAR}
          </p>
          <h1
            className="hero-reveal mt-6 font-display text-[clamp(2.6rem,6vw,5rem)] leading-[1.04] text-[var(--frat-cream)]"
            style={delay(0.08)}
          >
            EMC&sup2; Fraternity
          </h1>
          <p className="hero-reveal lead mt-6 max-w-xl" style={delay(0.16)}>
            An exclusive brotherhood of Engineering and the Physical Sciences. {site.motto}
          </p>
          <div className="hero-reveal mt-9 flex flex-wrap items-center gap-6" style={delay(0.24)}>
            <Link href="/donate" className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
              Give Back
            </Link>
            <Link
              href="/history"
              className="text-[15px] text-[var(--frat-cream)]/80 underline underline-offset-[6px] decoration-[var(--frat-cream)]/30 transition-colors hover:text-[var(--frat-cream)] hover:decoration-[var(--frat-cream)]"
            >
              Read the history
            </Link>
          </div>
          <p className="caption hero-reveal mt-12 md:absolute md:right-6 md:bottom-8 md:mt-0 md:max-w-xs md:text-right" style={delay(0.3)}>
            The 55th Anniversary Celebration, Quezon Hall, U.P. Diliman, 24 February 2024.
          </p>
        </Container>
      </section>

      {/* ── The Brotherhood ──────────────────────────────────────────────── */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <SectionLabel>The Brotherhood</SectionLabel>
            <h2 className="mt-7 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              Engineered for service, for {years} years.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="lead">
              Founded in {FOUNDING_YEAR} by ten scholars of the University, the EMC&sup2; Fraternity is
              dedicated to excellence in education and to service to the country.
            </p>
            <div className="prose-archive mt-6 text-[17px] leading-[1.7]">
              <p>
                Through its years as a fraternal organisation based in the College of Engineering,
                it has distinguished itself through endeavours that uplift the welfare of the
                University studentry and the wider community, and has become a moulding ground for
                student leaders and young exemplars in Engineering and the Sciences. In 1983 it
                was adjudged one of the Most Outstanding Student Organisations of the University&rsquo;s
                Diamond Jubilee year.
              </p>
            </div>
            <dl className="mt-10 border-t border-[var(--hairline)]">
              {FACTS.map((f) => (
                <div key={f.term} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-[var(--hairline)] py-4 md:grid-cols-[11rem_1fr]">
                  <dt className="caption pt-0.5">{f.term}</dt>
                  <dd className="text-[15px] text-[var(--frat-cream)]/85">{f.detail}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* ── The Credo ────────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--hairline)] bg-[var(--ink)] py-20 md:py-28">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <SectionLabel className="items-center">The Credo</SectionLabel>
          </Reveal>
          <div className="mt-10 space-y-3">
            {CREDO_LINES.map((line, i) => (
              <Reveal key={line} delay={i * 0.08}>
                <p
                  className={cn(
                    "font-serif text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.25] text-[var(--frat-cream)]",
                    i === 0 ? "font-semibold" : "font-medium text-[var(--frat-cream)]/80"
                  )}
                >
                  {line}
                </p>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.35}>
            <p className="caption mt-10">{site.tagline}</p>
          </Reveal>
        </Container>
      </section>

      {/* ── Projects and campaigns ───────────────────────────────────────── */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionLabel>Projects and campaigns</SectionLabel>
              <h2 className="mt-7 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
                Works in service.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/projects" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                All projects
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 border-t border-[var(--hairline)]">
            {projects.slice(0, 5).map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.05}>
                <Link
                  href={`/projects#${project.slug}`}
                  className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-4 border-b border-[var(--hairline)] py-6 transition-colors hover:bg-[var(--frat-cream)]/[0.03] md:grid-cols-[3.5rem_1fr_12rem] md:gap-8"
                >
                  <span className="caption tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-serif text-2xl font-semibold leading-snug text-[var(--frat-cream)] transition-colors group-hover:text-[var(--frat-gold-light)]">
                      {project.title}
                    </span>
                    <span className="mt-1.5 block max-w-xl text-[15px] leading-relaxed text-[var(--frat-cream)]/65">
                      {project.description}
                    </span>
                  </span>
                  <span className="caption col-start-2 md:col-start-auto md:text-right">{project.category}</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Prominent brods ──────────────────────────────────────────────── */}
      <section className="border-b border-[var(--hairline)] bg-[var(--ink)] py-20 md:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionLabel>Prominent brods</SectionLabel>
              <h2 className="mt-7 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
                Excellence, on the record.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/brods" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                All citations
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-2 md:gap-14">
            {brods.map((brod, i) => (
              <Reveal key={brod.slug} delay={i * 0.08}>
                <BrodCard brod={brod} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Notices ──────────────────────────────────────────────────────── */}
      {bulletin.length > 0 ? (
        <section id="bulletin" className="border-b border-[var(--hairline)] py-20 md:py-28">
          <Container className="grid gap-10 md:grid-cols-[1fr_1.5fr] md:gap-20">
            <Reveal>
              <SectionLabel>Notices</SectionLabel>
              <h2 className="mt-7 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
                From the Association.
              </h2>
            </Reveal>
            <div className="border-t border-[var(--hairline)]">
              {bulletin.slice(0, 3).map((item, i) => {
                const inner = (
                  <>
                    <p className="caption">{item.date}</p>
                    <p className="mt-2 font-serif text-2xl font-semibold leading-snug text-[var(--frat-cream)] transition-colors group-hover:text-[var(--frat-gold-light)]">
                      {item.title}
                    </p>
                    {item.body ? (
                      <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-[var(--frat-cream)]/65">{item.body}</p>
                    ) : null}
                  </>
                );
                return (
                  <Reveal key={`${item.date}-${item.title}`} delay={i * 0.05}>
                    {item.href ? (
                      <Link href={item.href} className="group block border-b border-[var(--hairline)] py-6">
                        {inner}
                      </Link>
                    ) : (
                      <div className="border-b border-[var(--hairline)] py-6">{inner}</div>
                    )}
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>
      ) : null}

      {/* ── Patronage ────────────────────────────────────────────────────── */}
      <section className="border-b border-[var(--hairline)] bg-[var(--ink)] py-24 text-center md:py-32">
        <Container className="flex max-w-2xl flex-col items-center">
          <Reveal>
            <SectionLabel className="items-center">Patronage</SectionLabel>
            <h2 className="mt-7 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              Give back to the brotherhood.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="lead mt-6">
              Scholarships, the Thinking Space, relief operations. Every project in the record began
              with a brod who gave.
            </p>
          </Reveal>
          <Reveal delay={0.16}>
            <Link href="/donate" className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-9")}>
              Give Back
            </Link>
          </Reveal>
        </Container>
      </section>

      {/* ── What's next ──────────────────────────────────────────────────── */}
      <section className="py-14">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <Reveal>
            <p className="text-[15px] text-[var(--frat-cream)]/70">
              The Member Portal is open by invitation. A companion app and an archive you can ask
              questions of are the direction.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <Link
              href="/roadmap"
              className="text-[15px] text-[var(--frat-gold-light)] underline underline-offset-[6px] decoration-[var(--frat-gold)]/40 transition-colors hover:text-[var(--frat-cream)]"
            >
              See what&rsquo;s next
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
