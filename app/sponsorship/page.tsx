import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { SponsorForm } from "@/components/site/sponsor-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  sponsorship,
  sponsorTiers,
  souvenirAdRates,
  anniversary,
  FOUNDING_YEAR,
  legalNameNoPeriod,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Sponsorship and the Souvenir Programme",
  description: `Sponsorship packages and souvenir programme advertising for the EMC² Fraternity's ${anniversary.ordinal} Anniversary, ${anniversary.month} at ${anniversary.venue}, U.P. Diliman.`,
};

const peso = (n: number) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);

/* PLAN §5 ranks souvenir-programme advertisements and sponsorship packages as
   the two largest revenue lines, and §4 is blunt about timing: corporate
   budgets close in December–January, so an ask landing in December has
   already missed. Hence a prospectus that exists in September. */

const AUDIENCE = [
  { figure: "490", label: "Brods on record, 1967 to 2023 batches" },
  { figure: String(anniversary.year - FOUNDING_YEAR), label: "Years of the brotherhood at U.P. Diliman" },
  { figure: "Feb 2027", label: `${anniversary.venue}, College of Fine Arts` },
  { figure: "Twice", label: "The programme is printed, then kept as a permanent digital record" },
];

export default function SponsorshipPage() {
  const indicative = !sponsorship.ratesApproved;

  return (
    <>
      <PageHero
        eyebrow="Partnership"
        title="Sponsorship and the Souvenir Programme"
        description={`An engineering brotherhood of the University of the Philippines gathers every batch in one room in ${anniversary.month}. This is how a company stands beside it.`}
        image={{
          src: "/photos/anniv55-outdoor.jpg",
          alt: "Brods of every batch gathered before Quezon Hall",
          caption: "The 55th Anniversary Celebration, U.P. Diliman.",
        }}
      />

      {/* Who is in the room */}
      <section className="border-b border-[var(--hairline)] py-16 md:py-20">
        <Container>
          <Reveal>
            <SectionLabel>Who is in the room</SectionLabel>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {AUDIENCE.map((a, i) => (
              <Reveal key={a.label} delay={0.05 * i}>
                <div className="h-full rounded-card bg-[var(--tint)] p-7">
                  <p className="stat text-[2.25rem]">{a.figure}</p>
                  <p className="mt-3 text-[14px] leading-relaxed text-[var(--fg-muted)]">{a.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.25}>
            <p className="prose-archive mt-10 text-[17px] leading-[1.7]">
              Engineers, scientists, founders, public servants, and professors, across six decades
              of batches — and the companies many of them lead. A sponsor is not buying an
              impression here; they are standing beside a name their own senior people recognise.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Sponsorship tiers */}
      <section className="border-b border-[var(--hairline)] bg-[var(--tint)] py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionLabel>Sponsorship</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">Four ways in.</h2>
            <p className="lead mt-6 max-w-2xl">
              The same inventory carries across the anniversary and the Quantum Leap Sports Series,
              so a partner who takes a tier is visible more than once in the year.
            </p>
            {indicative ? (
              <p className="mt-6 max-w-2xl border-l-2 border-[var(--frat-gold)]/50 pl-5 text-[15px] leading-relaxed text-[var(--fg-muted)]">
                <strong className="text-[var(--fg)]">These figures are indicative.</strong> The
                Association&rsquo;s treasurer sets the final rate card; the structure below is what
                the committee is proposing. Nothing here is a quotation.
              </p>
            ) : null}
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {sponsorTiers.map((t, i) => (
              <Reveal key={t.slug} delay={0.04 * i}>
                <article className="flex h-full flex-col rounded-card bg-[var(--paper)] p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="font-sans text-[22px] font-bold leading-tight text-[var(--fg)]">{t.name}</h3>
                    <span className="caption whitespace-nowrap">{t.limit}</span>
                  </div>
                  <p className="stat mt-4 text-[2rem]">
                    {t.amount === null ? "On application" : peso(t.amount)}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2 border-t border-[var(--hairline)] pt-5">
                    {t.benefits.map((b) => (
                      <li key={b} className="grid grid-cols-[0.6rem_1fr] gap-3 text-[14px] leading-relaxed text-[var(--fg-muted)]">
                        <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[var(--frat-gold)]" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Souvenir programme rate card */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          <Reveal>
            <SectionLabel>The souvenir programme</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">Printed, then kept.</h2>
            <p className="lead mt-6">
              Every guest takes one home, and it is published afterwards as a permanent digital
              record of the evening. An advertisement is read twice: once on the night, and then
              for as long as the record stands.
            </p>
            <p className="prose-archive mt-6 text-[15px] leading-relaxed">
              Greetings from a brod or a batch sit alongside company pages. Many of the strongest
              pages each year are not advertisements at all — they are a batch buying a page to
              greet their own.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="border-t border-[var(--hairline)]">
              {souvenirAdRates.map((a) => (
                <div key={a.slug} className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--hairline)] py-5">
                  <span>
                    <span className="block text-[17px] font-semibold text-[var(--fg)]">{a.placement}</span>
                    {a.note ? <span className="caption mt-1 block">{a.note}</span> : null}
                  </span>
                  <span className="text-[19px] font-semibold tabular-nums text-[var(--fg)]">
                    {a.amount === null ? "On application" : peso(a.amount)}
                  </span>
                </div>
              ))}
            </div>
            <p className="caption mt-5">
              {sponsorship.deadlineLabel}. Artwork specifications and the print deadline are sent
              with the prospectus.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Enquiry */}
      <section className="py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start md:gap-16">
          <div>
            <Reveal>
              <SectionLabel>Talk to the committee</SectionLabel>
              <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">Start a conversation.</h2>
              <p className="lead mt-6">
                Nothing here is a commitment. Tell the committee what interests you and someone
                will send the full prospectus.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="prose-archive mt-8 text-[15px] leading-relaxed">
                Sponsorship and advertising are received and receipted by the {legalNameNoPeriod},
                which is SEC-registered. The Association is not currently an accredited donee
                institution, so these are commercial placements rather than tax-deductible
                donations, and this page will not say otherwise until that changes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/anniversary" className={cn(buttonVariants({ variant: "outline" }))}>
                  About the anniversary
                </Link>
                <Link href="/contact" className={cn(buttonVariants({ variant: "ghost" }))}>
                  Contact the Association
                </Link>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <SponsorForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
