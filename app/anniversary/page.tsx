import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { RsvpForm } from "@/components/site/rsvp-form";
import { AnniversarySeal } from "@/components/site/anniversary-seal";
import { ArchivePlates } from "@/components/site/archive-plates";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { anniversary, site, FOUNDING_YEAR, legalNameNoPeriod } from "@/lib/content";

export const metadata: Metadata = {
  title: `The ${anniversary.ordinal} Anniversary`,
  description: `${anniversary.month} at ${anniversary.venue}, U.P. Diliman. The ${anniversary.ordinal} Anniversary of the EMC² Fraternity. Save the date.`,
};

/* The Association's own photographs of the 55th, captioned as the 55th so
   nobody mistakes them for a preview of an evening that has not happened. */
const ARCHIVE_PLATES = [
  {
    src: "/photos/anniv55-stage.jpg",
    alt: "Brods gathered on stage at the 55th Anniversary Celebration",
    figure: "On stage, Bahay ng Alumni",
    caption: "Brods of every batch, 55th Anniversary Celebration, 24 February 2024.",
  },
  {
    src: "/photos/anniv55-gazebo.jpg",
    alt: "Brods gathered at the gazebo during the 55th Anniversary Celebration",
    figure: "The gazebo",
    caption: "Between the programme and the long conversations after.",
  },
  {
    src: "/photos/anniv55-outdoor.jpg",
    alt: "Brods gathered before Quezon Hall at the 55th Anniversary Celebration",
    figure: "Quezon Hall",
    caption: "Fifty-five years of the brotherhood in one frame.",
  },
];

/* What the committee is preparing, each with an honest status. */
const PROGRAMME: { title: string; body: string; status: string; href?: string }[] = [
  {
    title: "The Awards",
    body: "Honouring brods whose work has carried the fraternity's name in engineering, public service, the academe, and the brotherhood itself.",
    status: "Categories, criteria, and the process are published. Nominations open November 2026.",
    href: "/awards",
  },
  {
    title: "Sponsorship",
    body: "Partner companies, many led or founded by brods, underwriting the evening in exchange for a place in its record.",
    status: "Prospectus in preparation. Asks go out before corporate budgets close.",
  },
  {
    title: "The Souvenir Programme",
    body: "A printed and permanent digital record of the evening, carrying greetings and advertisements from alumni firms.",
    status: "Rate card being set.",
  },
  {
    title: "Anniversary Merchandise",
    body: "Commemorative pieces made to order for the evening, produced against what is pre-ordered.",
    status: "Designs not yet commissioned.",
  },
  {
    title: "Batch Reunions",
    body: "Batches gathering within the larger evening, so a night of five hundred still leaves room for the twelve people you came to see.",
    status: "Batch organisers being identified.",
  },
  {
    title: "The Brotherhood Assistance Fund",
    body: "A standing fund for brods and their families facing hospitalisation, accident, or loss, launched alongside the anniversary.",
    status: "Being established with the Alumni Association.",
  },
];

export default function AnniversaryPage() {
  const years = anniversary.year - FOUNDING_YEAR;

  return (
    <>
      <PageHero
        eyebrow={`${anniversary.month} · ${anniversary.venue}, U.P. Diliman`}
        title={`The ${anniversary.ordinal} Anniversary`}
        description={`Save the date. ${years} years after ten scholars founded the brotherhood, every batch gathers in one room.`}
        image={{
          src: "/photos/anniv55-stage.jpg",
          alt: "Brods of every batch on stage at the 55th Anniversary Celebration",
          caption: "The 55th Anniversary Celebration, Bahay ng Alumni, U.P. Diliman, 24 February 2024.",
        }}
      />

      {/* The plate: the three facts a brod needs first, beside the seal. */}
      <section className="border-b border-[var(--hairline)] py-16 md:py-20">
        <Container className="grid items-center gap-10 md:grid-cols-[10rem_1fr] md:gap-16">
          <Reveal>
            <AnniversarySeal className="mx-auto h-36 w-36 md:h-40 md:w-40" />
          </Reveal>
          <Reveal delay={0.08}>
            <dl className="grid border-t border-[var(--hairline)] sm:grid-cols-3">
              <div className="border-b border-[var(--hairline)] py-6 sm:border-r sm:pr-8">
                <dt className="caption">When</dt>
                <dd className="mt-2 font-sans text-[22px] font-bold text-[var(--fg)]">{anniversary.month}</dd>
                {anniversary.date ? null : (
                  <p className="caption mt-1">Exact day to be fixed by the committee.</p>
                )}
              </div>
              <div className="border-b border-[var(--hairline)] py-6 sm:border-r sm:px-8">
                <dt className="caption">Where</dt>
                <dd className="mt-2 font-sans text-[22px] font-bold text-[var(--fg)]">{anniversary.venue}</dd>
                <p className="caption mt-1">
                  {anniversary.venueDetail}, {anniversary.venueAddress}.
                  {anniversary.venueConfirmed ? "" : " Held, not yet contracted."}
                </p>
              </div>
              <div className="border-b border-[var(--hairline)] py-6 sm:pl-8">
                <dt className="caption">Who</dt>
                <dd className="mt-2 font-sans text-[22px] font-bold text-[var(--fg)]">Every brod, every batch</dd>
                <p className="caption mt-1">{FOUNDING_YEAR} to the present, with families and invited guests.</p>
              </div>
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* The programme, as a list with honest status lines. */}
      <section className="border-b border-[var(--hairline)] bg-[var(--tint)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <Reveal>
            <SectionLabel>The programme</SectionLabel>
            <h2 className="mt-7 display text-[2rem] md:text-[2.75rem]">
              What the committee is preparing.
            </h2>
            <p className="prose-archive mt-6 text-[15px] leading-relaxed">
              Published six months early so the brotherhood can shape it. Each line carries where
              it actually stands; nothing here is announced before it is certain.
            </p>
          </Reveal>
          <div className="border-t border-[var(--hairline)]">
            {PROGRAMME.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.04}>
                <div className="grid gap-2 border-b border-[var(--hairline)] py-6 md:grid-cols-[14rem_1fr] md:gap-8">
                  <h3 className="font-sans text-[22px] font-bold leading-snug text-[var(--fg)]">
                    {item.href ? (
                      <Link href={item.href} className="underline-offset-4 transition-colors hover:text-[var(--brand)] hover:underline">
                        {item.title}
                      </Link>
                    ) : (
                      item.title
                    )}
                  </h3>
                  <div>
                    <p className="text-[15px] leading-relaxed text-[var(--fg)]/70">{item.body}</p>
                    <p className="mt-2 text-[13px] text-[var(--brand)]/90">{item.status}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* From the archive. */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionLabel>From the archive</SectionLabel>
            <h2 className="mt-7 max-w-2xl display text-[2rem] md:text-[2.75rem]">
              The last time the brotherhood gathered.
            </h2>
            <p className="prose-archive mt-6 text-[15px] leading-relaxed">
              Three photographs from the 55th Anniversary Celebration at U.P. Diliman, February 2024.
              The Association&rsquo;s own record.
            </p>
          </Reveal>
          <div className="mt-12">
            <ArchivePlates plates={ARCHIVE_PLATES} />
          </div>
        </Container>
      </section>

      {/* The RSVP. */}
      <section className="py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-2 md:items-start md:gap-20">
          <div>
            <Reveal>
              <SectionLabel>Save the date</SectionLabel>
              <h2 className="mt-7 display text-[2rem] md:text-[2.75rem]">
                Put your name down.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="prose-archive mt-6 text-[17px] leading-[1.7]">
                <p>
                  This is a save-the-date, not a ticket. No payment is taken here and none is owed.
                  It tells the committee how many chairs to plan for, and whom to approach first
                  about the awards, the sponsorships, and the souvenir programme.
                </p>
                <p>
                  Tickets, nominations, and merchandise open later in the year through the{" "}
                  {legalNameNoPeriod}. Everyone on this list hears first.
                </p>
              </div>
              <p className="caption mt-6 max-w-md">
                Your details are used only to plan the evening and are handled under the Philippine
                Data Privacy Act of 2012. We do not sell or share your information, and we will not
                email you about the anniversary unless you ask us to.
              </p>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link href="/donate" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                  Give Back
                </Link>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
                >
                  Ask on Facebook
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
