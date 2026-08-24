import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CinematicHero } from "@/components/site/cinematic-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { RsvpForm } from "@/components/site/rsvp-form";
import { AnniversarySeal } from "@/components/site/anniversary-seal";
import { ArchivePlates } from "@/components/site/archive-plates";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { anniversary, association, site, FOUNDING_YEAR } from "@/lib/content";

export const metadata: Metadata = {
  title: `The ${anniversary.ordinal} Anniversary`,
  description: `${anniversary.month} at ${anniversary.venue}, U.P. Diliman — the ${anniversary.ordinal} Anniversary of the EMC² Fraternity. Save the date.`,
};

/* The Association's own photographs of the 55th. Captions name the 55th
   explicitly — these document the last gathering, not the coming one. */
const ARCHIVE_PLATES = [
  {
    src: "/photos/anniv55-group-stage.jpg",
    alt: "Brods gathered on stage at the 55th Anniversary Celebration",
    figure: "Plate I — On Stage",
    caption: "Brods of every batch on stage, 55th Anniversary Celebration, U.P. Diliman.",
  },
  {
    src: "/photos/anniv55-group-gazebo.jpg",
    alt: "Brods gathered at the gazebo during the 55th Anniversary Celebration",
    figure: "Plate II — The Gazebo",
    caption: "The gathering at the gazebo, between the programme and the long conversations after.",
  },
  {
    src: "/photos/anniv55-group-outdoor.jpg",
    alt: "Brods gathered outdoors at the 55th Anniversary Celebration",
    figure: "Plate III — Grounds",
    caption: "On the grounds at Diliman — fifty-five years of the brotherhood in one frame.",
  },
];

/* What the committee is preparing. Each carries an honest status line: the
   point of publishing six months early is the warm list, and a list built on
   things that turn out not to exist is worse than no list at all.

   Each also carries a still-life. The images are generated (ATTRIBUTION.md)
   and depict objects, never the fraternity, never its members, never the
   venue — a trophy that bears no engraving, a programme with a blank cover.
   They exist to give a reader something to catch on before the words, and
   they are deliberately contemporary: this is an engineering and physical
   sciences brotherhood, not an antiquarian society. */
const PROGRAMME = [
  {
    image: "/anniversary/awards.jpg",
    title: "The Awards",
    body: "Honouring brods whose work has carried the fraternity's name — in engineering, in public service, in the academe, and in the brotherhood itself.",
    status: "Categories being screened · nominations open toward the end of the year",
  },
  {
    image: "/anniversary/sponsorship.jpg",
    title: "Sponsorship",
    body: "Partner companies, many of them led or founded by brods, underwriting the evening in exchange for a place in its record.",
    status: "Prospectus in preparation · asks go out before corporate budgets close",
  },
  {
    image: "/anniversary/souvenir.jpg",
    title: "The Souvenir Programme",
    body: "A printed and permanent digital record of the evening, carrying greetings and advertisements from alumni firms.",
    status: "Rate card being set",
  },
  {
    image: "/anniversary/merch.jpg",
    title: "Anniversary Merchandise",
    body: "Commemorative pieces made to order for the evening — produced against what is actually pre-ordered, never against a hope.",
    status: "Designs not yet commissioned",
  },
  {
    image: "/anniversary/reunions.jpg",
    title: "Batch Reunions",
    body: "Batches gathering within the larger evening, so a night of five hundred still leaves room for the twelve people you actually came to see.",
    status: "Batch organisers being identified",
  },
  {
    image: "/anniversary/assistance.jpg",
    title: "The Brotherhood Assistance Fund",
    body: "A standing fund for brods and their families facing hospitalisation, accident, or loss — launched alongside the anniversary rather than after it.",
    status: "Being established with the Alumni Association",
  },
];

export default function AnniversaryPage() {
  const years = anniversary.year - FOUNDING_YEAR;

  return (
    <>
      {/* Ambient hero. A modern institute atrium with a luminous ring — no
          people, no real venue, no event. It sets a mood; every fact lives in
          the text over it. The clip is a true seamless loop: one band of light
          travels the ring exactly once, and the wrap point is a continuous
          frame step rather than a cut. See ATTRIBUTION.md. */}
      <CinematicHero
        src="/anniversary/hero.mp4"
        poster="/anniversary/hero-poster.jpg"
        eyebrow={`№ 10 — ${anniversary.month}`}
        title={`The ${anniversary.ordinal} Anniversary`}
        description={`${years} years after ten scholars founded the brotherhood at the U.P. College of Engineering, the brods gather again. The date is set; the programme is being written. Put your name down now — nothing is owed, and everything that follows will reach you first.`}
      />

      {/* Ceremonial band — the seal mounted on an anodised panel with a single
          machined channel of gold light. DESIGN principle 5 keeps gold scarce,
          so the texture appears here and nowhere else. Generated, and
          deliberately depicts nothing. Ornament, not evidence. */}
      <section className="relative isolate overflow-hidden border-b border-[var(--hairline)]">
        <Image
          src="/anniversary/ground-foil.jpg"
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-50"
        />
        {/* Fades the band into the page at both edges and holds contrast
            under the seal — the raw texture is far too bright at its centre. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[var(--canvas)] via-[var(--canvas)]/75 to-[var(--canvas)]"
        />
        <Container className="relative py-20">
          <Reveal>
            <AnniversarySeal className="mx-auto h-40 w-40 md:h-48 md:w-48" />
          </Reveal>
        </Container>
      </section>

      {/* The plate — the three facts a brod needs before anything else. */}
      <section className="py-20">
        <Container>
          <Reveal delay={0.08}>
            <dl className="grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-3">
              <div className="flex flex-col gap-2 bg-[var(--ink)] p-8">
                <dt className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-cream)]/60 uppercase">
                  When
                </dt>
                <dd className="font-display text-2xl text-[var(--frat-cream)]">
                  {anniversary.month}
                </dd>
                {anniversary.date ? null : (
                  <p className="text-[13px] text-[var(--frat-cream)]/50">
                    Exact day to be fixed by the committee.
                  </p>
                )}
              </div>
              <div className="flex flex-col gap-2 bg-[var(--ink)] p-8">
                <dt className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-cream)]/60 uppercase">
                  Where
                </dt>
                <dd className="font-display text-2xl text-[var(--frat-cream)]">
                  {anniversary.venue}
                </dd>
                <p className="text-[13px] leading-relaxed text-[var(--frat-cream)]/50">
                  {anniversary.venueDetail}
                  <br />
                  {anniversary.venueAddress}
                  {anniversary.venueConfirmed ? null : (
                    <>
                      <br />
                      <span className="text-[var(--frat-cream)]/40">Venue held, not yet contracted.</span>
                    </>
                  )}
                </p>
              </div>
              <div className="flex flex-col gap-2 bg-[var(--ink)] p-8">
                <dt className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-cream)]/60 uppercase">
                  Who
                </dt>
                <dd className="font-display text-2xl text-[var(--frat-cream)]">
                  Every brod, every batch
                </dd>
                <p className="text-[13px] leading-relaxed text-[var(--frat-cream)]/50">
                  {FOUNDING_YEAR} to the present, with families and invited guests.
                </p>
              </div>
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* The last gathering — the Association's own photographs of the 55th.
          Real archive, and captioned as the 55th so nobody mistakes it for a
          preview of an evening that has not happened yet. PRODUCT.md rules out
          stock photos of strangers; it rules out invented ones just as firmly. */}
      <section className="border-t border-[var(--hairline)] bg-[var(--ink)] py-24">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              № 10.1 — From the Archive
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              The last time the brotherhood gathered
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-[var(--frat-cream)]/60">
              Three photographs from the 55th Anniversary Celebration at U.P. Diliman, February
              MMXXIV — the Association&rsquo;s own record, not a rendering of what February 2027
              will look like.
            </p>
          </Reveal>
          <div className="mt-14">
            <ArchivePlates plates={ARCHIVE_PLATES} />
          </div>
        </Container>
      </section>

      {/* What's being prepared — honest status on each line. */}
      <section className="blueprint border-y border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              № 10.2 — In Preparation
            </p>
            <h2 className="mt-4 max-w-2xl font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              What the committee is building
            </h2>
            <p className="mt-5 max-w-2xl leading-relaxed text-[var(--frat-cream)]/60">
              Said plainly, with where each one actually stands. Nothing below is open yet, and
              nothing below takes money today.
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-2 lg:grid-cols-3">
            {PROGRAMME.map((item, i) => (
              <Reveal key={item.title} delay={0.05 * i}>
                <article className="group flex h-full flex-col overflow-hidden bg-[var(--ink)]">
                  {/* The hook. Illustrative object, not documentation — the
                      heading and body carry every fact, so this is alt="". */}
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <Image
                      src={item.image}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover opacity-85 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04] group-hover:opacity-100"
                    />
                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-[var(--ink)] to-transparent"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-8 pt-6">
                    <h3 className="font-display text-xl leading-snug text-[var(--frat-cream)]">
                      {item.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--frat-cream)]/65">
                      {item.body}
                    </p>
                    <p className="mt-6 border-t border-[var(--hairline)] pt-4 font-mono text-[10px] leading-relaxed tracking-[0.15em] text-[var(--frat-cream)]/45 uppercase">
                      {item.status}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The RSVP — the entire point of publishing this six months early. */}
      <section className="py-24">
        <Container className="grid gap-14 md:grid-cols-2 md:items-start">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                № 10.3 — Save the Date
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
                Put your name down
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-6 space-y-5 leading-relaxed text-[var(--frat-cream)]/70">
                <p>
                  This is a save-the-date, not a ticket. No payment is taken here and none is owed.
                  What it does is tell the committee how many chairs to plan for, and whom to
                  approach first about the awards, the sponsorships, and the souvenir programme.
                </p>
                <p>
                  Tickets, nominations, and merchandise open later in the year, through the{" "}
                  {association.legalName} — and everyone on this list hears first.
                </p>
                <p className="text-sm text-[var(--frat-cream)]/50">
                  Your details are used only to plan the evening and are handled under the
                  Philippine Data Privacy Act of 2012 (RA 10173). We do not sell or share your
                  information, and we will not email you about the anniversary unless you ask us to.
                </p>
              </div>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/donate"
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                >
                  Give Back
                </Link>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Ask the fraternity on Facebook
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <RsvpForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
