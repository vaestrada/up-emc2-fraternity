import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site, legalNameNoPeriod } from "@/lib/content";
import { getAssistanceTotals, getLedgerEntries, peso } from "@/lib/assistance";

export const metadata: Metadata = {
  title: "The Brotherhood Assistance Fund",
  description:
    "A standing fund of the EMC² Fraternity for brods and their families facing hospitalisation, accident, or loss. Requests are private; the ledger is public.",
};

/* Deliberately a programme page, never a case page. It describes the promise,
   not the person: no names, no diagnoses, no photographs of anyone's family.
   PLAN.md D1 and §3, and the reason is not squeamishness — health information
   about a brod, and especially about a brod's spouse or parent, is sensitive
   personal information under RA 10173, and a case page would process it about
   a third party who never consented. */

const COVERS = [
  {
    title: "Hospitalisation",
    body: "A brod, or a brod's spouse, parent, or child, admitted and facing a bill the family did not plan for.",
  },
  {
    title: "Accident",
    body: "The sudden kind of expense that arrives before anyone has had time to think.",
  },
  {
    title: "Bereavement",
    body: "The death of a brod, or of someone a brod is responsible for. Practical help, quickly, without a form to argue with.",
  },
  {
    title: "Calamity",
    body: "Fire, flood, and typhoon. The brotherhood ran relief operations through 2020; this is the standing version of that instinct.",
  },
];

const PRINCIPLES = [
  {
    title: "Requests are private, always",
    body: "A request goes to the board and to nobody else. It never appears on this site, in the directory, or in any list. There is no public case page, no progress bar, no name.",
  },
  {
    title: "Giving is private; honour is opt-in",
    body: "Gifts are arranged directly with the Association. A giver who wishes to be named joins the Roll of Patrons by name and batch. Amounts are never published, for anyone.",
  },
  {
    title: "The ledger is public",
    body: "What was raised, what was disbursed, what remains, and how many brods were helped. No names on either side. Published after every disbursement.",
  },
];

export default async function AssistancePage() {
  const totals = await getAssistanceTotals();
  const entries = await getLedgerEntries();
  const endowed = totals.entries > 0;

  return (
    <>
      <PageHero
        eyebrow="A standing programme"
        title="The Brotherhood Assistance Fund"
        description="When a brod or a brod's family is in trouble, the brotherhood should not have to be assembled from scratch each time. This is the standing answer: a fund, a private way to ask, and a public account of every peso."
        image={{
          src: "/photos/anniv55-gazebo.jpg",
          alt: "Brods of every batch at the 55th Anniversary Celebration",
          caption: "Service and Sacrifice — the second line of the credo.",
        }}
      />

      {/* The ledger, first. It is the thing that earns a second gift. */}
      <section className="border-b border-[var(--hairline)] py-16 md:py-20">
        <Container>
          <Reveal>
            <SectionLabel>The ledger</SectionLabel>
          </Reveal>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { label: "Raised", value: peso(totals.raised) },
              { label: "Disbursed", value: peso(totals.disbursed) },
              { label: "Balance", value: peso(totals.balance) },
              { label: "Brods assisted", value: String(totals.brodsAssisted) },
            ].map((s, i) => (
              <Reveal key={s.label} delay={0.05 * i}>
                <div className="rounded-card bg-[var(--tint)] p-7">
                  <p className="stat text-[2.5rem]">{s.value}</p>
                  <p className="caption mt-2">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            {endowed ? (
              <div className="mt-10 border-t border-[var(--hairline)]">
                {entries.map((e, i) => (
                  <div
                    key={`${e.entry_date}-${i}`}
                    className="grid grid-cols-[6.5rem_1fr_auto] items-baseline gap-4 border-b border-[var(--hairline)] py-4"
                  >
                    <span className="caption tabular-nums">
                      {new Date(e.entry_date).toLocaleDateString("en-PH", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[15px] text-[var(--fg)]/80">
                      {e.note ?? (e.direction === "raised" ? "Contribution received" : "Assistance disbursed")}
                    </span>
                    <span
                      className={cn(
                        "text-[15px] font-semibold tabular-nums",
                        e.direction === "raised" ? "text-[var(--brand)]" : "text-[var(--fg)]/70"
                      )}
                    >
                      {e.direction === "raised" ? "+" : "−"}
                      {peso(e.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-10 max-w-2xl border-l-2 border-[var(--frat-gold)]/50 pl-6">
                <p className="label label--plain">Not yet endowed</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg)]/70">
                  The fund is being established with the {legalNameNoPeriod}. These figures are
                  zero because nothing has been raised or disbursed yet, and they will stay honest:
                  every entry appears here, dated, from the first peso. Nothing on this page is a
                  projection.
                </p>
              </div>
            )}
          </Reveal>
        </Container>
      </section>

      {/* What it covers */}
      <section className="border-b border-[var(--hairline)] bg-[var(--tint)] py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionLabel>What it covers</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">
              The four asks that come most often.
            </h2>
            <p className="lead mt-6 max-w-2xl">
              These are the requests that already reach the brotherhood, spread across group chats,
              with no record and no follow-through. The fund exists to catch them.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {COVERS.map((c, i) => (
              <Reveal key={c.title} delay={0.05 * i}>
                <div className="h-full rounded-card bg-[var(--paper)] p-8">
                  <h3 className="font-sans text-[22px] font-bold leading-tight text-[var(--fg)]">{c.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-muted)]">{c.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* How it works — the three principles */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">
              Private to ask. Public to account for.
            </h2>
          </Reveal>
          <div className="border-t border-[var(--hairline)]">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.title} delay={0.05 * i}>
                <div className="grid gap-2 border-b border-[var(--hairline)] py-6 md:grid-cols-[15rem_1fr] md:gap-8">
                  <h3 className="font-sans text-[19px] font-bold leading-snug text-[var(--fg)]">{p.title}</h3>
                  <p className="text-[15px] leading-relaxed text-[var(--fg-muted)]">{p.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The two doors */}
      <section className="py-20 md:py-28">
        <Container className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-card bg-[var(--tint)] p-8 md:p-10">
              <SectionLabel>If you need help</SectionLabel>
              <h2 className="display mt-6 text-[2rem]">Ask the board.</h2>
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-[var(--fg-muted)]">
                Sign in to the Portal and tell the board what has happened, in your own words.
                It goes to them and to nobody else — not to the directory, not to this site, not to
                any list. If you are not on the Portal yet, message the fraternity directly and
                someone will help you rather than send you to a form.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/portal/assistance" className={cn(buttonVariants({ variant: "default" }))}>
                  Request assistance
                </Link>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(buttonVariants({ variant: "outline" }))}
                >
                  Message the fraternity
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="on-dark flex h-full flex-col rounded-card bg-[var(--ink)] p-8 md:p-10">
              <SectionLabel>If you can give</SectionLabel>
              <h2 className="display mt-6 text-[2rem] text-[var(--frat-cream)]">Endow it.</h2>
              <p className="mt-5 flex-1 text-[15px] leading-relaxed text-[var(--frat-cream)]/75">
                A fund that exists only when something has already gone wrong is not a fund. What
                makes this work is brods who give before the call comes, and a monthly pledge is
                worth many times a single gift because it is what lets the board answer quickly.
                Every peso appears in the ledger above.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/donate" className={cn(buttonVariants({ variant: "white" }))}>
                  Give to the fund
                </Link>
                <Link href="/contact" className={cn(buttonVariants({ variant: "outline-light" }))}>
                  Talk to the Association
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>

        <Container className="mt-10">
          <Reveal>
            <p className="caption max-w-3xl">
              Gifts are received and acknowledged by the {legalNameNoPeriod}. The Association is
              not currently an accredited donee institution, so gifts are not tax-deductible, and
              this page will not say otherwise until that changes. Requests and gifts are handled
              under the Philippine Data Privacy Act of 2012.{" "}
              <Link href="/privacy" className="text-[var(--brand)] underline underline-offset-4">
                How we handle your information
              </Link>
              .
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
