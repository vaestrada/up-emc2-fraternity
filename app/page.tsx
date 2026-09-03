import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { BrodCard } from "@/components/site/brod-card";
import { SealDrawing } from "@/components/site/seal-drawing";
import { YearScale } from "@/components/site/year-scale";
import { Chronicle, type Chapter } from "@/components/site/chronicle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FOUNDING_YEAR, site, association, anniversary, projects, prominentBrods, bulletin } from "@/lib/content";
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

const body = "prose-archive text-[17px] leading-[1.7]";

export default function Home() {
  const brods = withoutDemo(prominentBrods).slice(0, 2);

  /* The record as chapters, in the order the timeline rail runs. */
  const chapters: Chapter[] = [
    {
      id: "founding",
      figure: String(FOUNDING_YEAR),
      kicker: "The founding",
      title: "Ten scholars, one college.",
      children: (
        <>
          <p className="lead">
            Founded in {FOUNDING_YEAR} by ten scholars of the University, the EMC&sup2; Fraternity is
            an exclusive Engineering and Physical Sciences brotherhood dedicated to excellence in
            education and to service to the country.
          </p>
          <p className={cn(body, "mt-6")}>
            Through its years as a fraternal organisation based in the College of Engineering, it
            has distinguished itself through endeavours that uplift the welfare of the University
            studentry and the wider community, and has become a moulding ground for student leaders
            and young exemplars in Engineering and the Sciences.
          </p>
          <dl className="mt-10 border-t border-[var(--hairline)]">
            {FACTS.map((f) => (
              <div key={f.term} className="grid grid-cols-[9rem_1fr] gap-4 border-b border-[var(--hairline)] py-4 md:grid-cols-[11rem_1fr]">
                <dt className="caption pt-0.5">{f.term}</dt>
                <dd className="text-[15px] text-[var(--frat-cream)]/85">{f.detail}</dd>
              </div>
            ))}
          </dl>
        </>
      ),
    },
    {
      id: "credo",
      figure: "Credo",
      kicker: "The credo",
      title: "Four lines every brod can say from memory.",
      children: (
        <div className="space-y-3">
          {CREDO_LINES.map((line, i) => (
            <p
              key={line}
              className={cn(
                "font-serif text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.2] text-[var(--frat-cream)]",
                i === 0 ? "font-semibold" : "font-medium text-[var(--frat-cream)]/75"
              )}
            >
              {line}
            </p>
          ))}
          <p className="caption pt-6">{site.tagline}</p>
        </div>
      ),
    },
    {
      id: "honour",
      figure: "1983",
      kicker: "The honour",
      title: "Most Outstanding Student Organisation.",
      children: (
        <>
          <p className="lead">
            In the University&rsquo;s Diamond Jubilee year, the fraternity was adjudged one of the
            Most Outstanding Student Organisations of the University of the Philippines.
          </p>
          <p className={cn(body, "mt-6")}>
            Fourteen years after its founding, and still the standard the brotherhood measures
            itself against.
          </p>
        </>
      ),
    },
    {
      id: "work",
      figure: "Works",
      kicker: "The work",
      title: "Projects and campaigns in service.",
      children: (
        <>
          <div className="border-t border-[var(--hairline)]">
            {projects.slice(0, 5).map((project, i) => (
              <Link
                key={project.slug}
                href={`/projects#${project.slug}`}
                className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-4 border-b border-[var(--hairline)] py-5 transition-colors hover:bg-[var(--frat-cream)]/[0.03]"
              >
                <span className="caption tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-serif text-2xl font-semibold leading-snug text-[var(--frat-cream)] transition-colors group-hover:text-[var(--frat-gold-light)]">
                    {project.title}
                  </span>
                  <span className="caption mt-1 block">{project.category}</span>
                </span>
              </Link>
            ))}
          </div>
          <Link href="/projects" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "mt-8")}>
            All projects
          </Link>
        </>
      ),
    },
    {
      id: "fifty-fifth",
      figure: "2024",
      kicker: "The 55th",
      title: "Fifty-five years, in one afternoon.",
      children: (
        <>
          <p className="lead">
            On 24 February 2024, brods across every generation gathered at Bahay ng Alumni, U.P.
            Diliman, to mark fifty-five years of the brotherhood.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { src: "/photos/anniv55-stage.jpg", alt: "Brods of every batch on stage at the 55th Anniversary Celebration", caption: "On stage, Bahay ng Alumni." },
              { src: "/photos/anniv55-gazebo.jpg", alt: "Brods gathered at the gazebo during the 55th Anniversary Celebration", caption: "The gazebo, U.P. Diliman." },
            ].map((p) => (
              <figure key={p.src}>
                <div className="relative aspect-[3/2] overflow-hidden border border-[var(--hairline)] bg-[var(--ink)]">
                  <Image src={p.src} alt={p.alt} fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover" />
                </div>
                <figcaption className="caption mt-2">{p.caption}</figcaption>
              </figure>
            ))}
          </div>
          <Link href="/history" className="mt-8 inline-block text-[15px] text-[var(--frat-gold-light)] underline underline-offset-[6px] decoration-[var(--frat-gold)]/40 transition-colors hover:text-[var(--frat-cream)]">
            Read the history
          </Link>
        </>
      ),
    },
    {
      id: "fifty-eighth",
      figure: String(anniversary.year),
      kicker: `The ${anniversary.ordinal}`,
      title: `${anniversary.month}, ${anniversary.venue}, U.P. Diliman.`,
      children: (
        <>
          <p className="lead">Save the date. Every batch, in one room, fifty-eight years on.</p>
          <p className={cn(body, "mt-6")}>
            The awards, sponsorships, souvenir programme, and tickets open later in the year.
            Everyone on the save-the-date list hears first.
          </p>
          <Link href="/anniversary" className={cn(buttonVariants({ variant: "accent" }), "mt-8")}>
            Put your name down
          </Link>
        </>
      ),
    },
  ];

  return (
    <>
      {/* ── The Plate ─────────────────────────────────────────────────────
          One photograph, developing from engraving to colour; the seal
          drawing itself beside the name. */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        <div className="plate-drift absolute inset-0">
          <Image
            src="/photos/anniv55-outdoor.jpg"
            alt="Brods of every batch gathered before Quezon Hall at the 55th Anniversary Celebration, U.P. Diliman"
            fill
            priority
            sizes="100vw"
            className="plate-image object-cover object-[50%_38%]"
          />
          <div aria-hidden className="plate-ink absolute inset-0" />
          <div aria-hidden className="plate-hatch absolute inset-0" />
        </div>
        <div aria-hidden className="absolute inset-0 bg-[var(--ink)]/30" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-[72%] bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/70 to-transparent" />

        <SealDrawing className="absolute top-28 right-6 hidden h-[34vh] w-auto md:block lg:right-12" />

        <Container className="relative pt-44 pb-16 md:pb-24">
          <p className="hero-reveal label on-plate" style={delay(0)}>
            University of the Philippines · College of Engineering · Est. {FOUNDING_YEAR}
          </p>
          <h1
            className="hero-reveal on-plate mt-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] leading-[1] text-[var(--frat-cream)]"
            style={delay(0.08)}
          >
            EMC&sup2; Fraternity
          </h1>
          <p className="hero-reveal lead on-plate mt-7 max-w-xl" style={delay(0.16)}>
            An exclusive brotherhood of Engineering and the Physical Sciences. {site.motto}
          </p>
          <div className="hero-reveal mt-10 flex flex-wrap items-center gap-6" style={delay(0.24)}>
            <Link href="/donate" className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
              Give Back
            </Link>
            <a
              href="#founding"
              className="text-[15px] text-[var(--frat-cream)]/80 underline underline-offset-[6px] decoration-[var(--frat-cream)]/30 transition-colors hover:text-[var(--frat-cream)] hover:decoration-[var(--frat-cream)]"
            >
              Read the record
            </a>
          </div>
          <p className="caption hero-reveal mt-12 md:absolute md:right-6 md:bottom-10 md:mt-0 md:max-w-xs md:text-right lg:right-12" style={delay(0.3)}>
            The 55th Anniversary Celebration, Quezon Hall, U.P. Diliman, 24 February 2024.
          </p>
        </Container>
      </section>

      {/* ── The rail, then the record as chapters ──────────────────────── */}
      <YearScale />
      <div className="border-b border-[var(--hairline)] py-8 md:py-16">
        <Chronicle chapters={chapters} />
      </div>

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
          <Container className="grid gap-10 md:grid-cols-[1fr_1.7fr] md:gap-20">
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
