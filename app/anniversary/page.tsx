import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { CinematicHero } from "@/components/site/cinematic-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { RsvpForm } from "@/components/site/rsvp-form";
import { AnniversarySeal } from "@/components/site/anniversary-seal";
import { ArchivePlates } from "@/components/site/archive-plates";
import { ProgrammeShowcase } from "@/components/site/programme-showcase";
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

   Each also carries a scene. The images are generated (ATTRIBUTION.md) and
   show what the evening could feel like — people, warmth, a room worth being
   in — because an alumnus deciding whether to come needs to picture it, not
   read about it. They carry no EMC² crest, no logo, and no text anywhere in
   frame, so none of them can be mistaken for a photograph of the fraternity
   or of an event that has happened, and the section says so in as many words.
   Same convention /history already uses for its preview imagery. */
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
      {/* The page opens on the showcase rather than on a video: one idea per
          screen, five seconds each, image large enough to carry the feeling.
          The eyebrow and h1 stay fixed above the rotating content so a visitor
          landing cold always knows whose anniversary this is and when — a
          carousel that rotates its own page title tells you nothing.
          Autoplay pauses on focus and on the explicit control, and is off
          entirely under prefers-reduced-motion. */}
      <ProgrammeShowcase
        items={PROGRAMME}
        eyebrow={`№ 10 — ${anniversary.month} · ${anniversary.venue}`}
        title={`The ${anniversary.ordinal} Anniversary`}
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

      {/* A ceremonial beat before the form — a breath, not a second front
          door. The subject is an object on a turntable rather than a crowd:
          it holds up at 1080p where generated faces do not, and one full
          revolution returns to its own first frame, so the loop is exact by
          construction rather than patched. Blank and unengraved, as every
          object on this page is. See ATTRIBUTION.md. */}
      <CinematicHero
        src="/anniversary/hero.mp4"
        poster="/anniversary/hero-poster.jpg"
        as="h2"
        eyebrow="№ 10.3 — The Standard"
        title="Fifty-eight years of the same standard"
        description={`${years} years after ten scholars founded the brotherhood at the U.P. College of Engineering. What gets honoured in February is the work that carried the name since.`}
      />

      {/* The RSVP — the entire point of publishing this six months early. */}
      <section className="py-24">
        <Container className="grid gap-14 md:grid-cols-2 md:items-start">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                № 10.4 — Save the Date
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
