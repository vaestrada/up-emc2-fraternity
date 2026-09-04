import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { NominationForm } from "@/components/site/nomination-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { awards, awardCategories, anniversary } from "@/lib/content";

export const metadata: Metadata = {
  title: "The Anniversary Awards",
  description: `Categories, criteria, and the nomination process for the EMC² Fraternity's ${anniversary.ordinal} Anniversary awards. Nominations open ${awards.opensLabel}.`,
};

/* PLAN §6 requires the panel and the criteria be published BEFORE nominations
   open, so that nobody can say the rules were written around a winner. That is
   why this page exists in September when nominations do not open until
   November: the rules go up first, and the form appears later. */

const PROCESS = [
  {
    n: "01",
    title: "Nomination",
    body: "Any brod may nominate any brod. The nominee need not be the nominator, and in practice almost never is. No fee is charged to nominate.",
  },
  {
    n: "02",
    title: "Screening",
    body: "A committee checks eligibility and evidence against the published criteria before anything reaches a judge. Incomplete nominations are returned, not discarded.",
  },
  {
    n: "03",
    title: "Judging",
    body: "A named panel decides against the criteria on this page. Payment status of any kind is invisible to the judges — the nomination record has no such field.",
  },
  {
    n: "04",
    title: "Announcement",
    body: `Winners are announced ${awards.announcedLabel}, not before. The suspense is the point.`,
  },
];

export default function AwardsPage() {
  return (
    <>
      <PageHero
        eyebrow={`The ${anniversary.ordinal} Anniversary`}
        title="The Anniversary Awards"
        description="The brotherhood has always known who its exemplars are. This is the year it writes them down — against published criteria, judged by a named panel, and read aloud in February."
        image={{
          src: "/photos/anniv55-stage.jpg",
          alt: "Brods of every batch on stage at the 55th Anniversary Celebration",
          caption: "The stage where the citations will be read, February 2027.",
        }}
      />

      {/* Status band: whether nominations are open, in plain words. */}
      <section className="border-b border-[var(--hairline)] bg-[var(--tint)] py-12">
        <Container className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <p className="label label--plain">
              {awards.nominationsOpen ? "Nominations are open" : "Nominations open " + awards.opensLabel}
            </p>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-[var(--fg-muted)]">
              {awards.nominationsOpen
                ? `Nominations close ${awards.closesLabel}. Winners are announced ${awards.announcedLabel}.`
                : `The categories, the criteria, and the panel are published first, so the rules are settled before any name is put forward. Nominations close ${awards.closesLabel}.`}
            </p>
          </div>
          <Link
            href={awards.nominationsOpen ? "#nominate" : "/anniversary"}
            className={cn(buttonVariants({ variant: "default" }))}
          >
            {awards.nominationsOpen ? "Nominate a brod" : "Get told when they open"}
          </Link>
        </Container>
      </section>

      {/* The categories */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionLabel>The categories</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">Eight, proposed.</h2>
            <p className="lead mt-6 max-w-2xl">
              The starting set, published for the brotherhood to argue with. The board will
              screen this down before nominations open; launching with all eight would spread
              the field too thin to mean anything.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {awardCategories.map((c, i) => (
              <Reveal key={c.slug} delay={0.04 * i}>
                <article id={c.slug} className="h-full scroll-mt-28 rounded-card bg-[var(--tint)] p-8">
                  <h3 className="font-sans text-[22px] font-bold leading-tight text-[var(--fg)]">{c.title}</h3>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-muted)]">{c.who}</p>
                  <ul className="mt-5 space-y-2 border-t border-[var(--hairline)] pt-4">
                    {c.criteria.map((crit) => (
                      <li key={crit} className="grid grid-cols-[0.6rem_1fr] gap-3 text-[14px] leading-relaxed text-[var(--fg-muted)]">
                        <span aria-hidden className="mt-[0.5em] h-1.5 w-1.5 rotate-45 rounded-[1px] bg-[var(--frat-gold)]" />
                        <span>{crit}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The process */}
      <section className="border-t border-[var(--hairline)] bg-[var(--tint)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[0.8fr_1.4fr] md:gap-16">
          <Reveal>
            <SectionLabel>How it is decided</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">Four steps, published.</h2>
          </Reveal>
          <div className="border-t border-[var(--hairline)]">
            {PROCESS.map((s, i) => (
              <Reveal key={s.n} delay={0.05 * i}>
                <div className="grid grid-cols-[3rem_1fr] gap-6 border-b border-[var(--hairline)] py-6">
                  <span className="stat text-[2rem]">{s.n}</span>
                  <div>
                    <h3 className="font-sans text-[20px] font-bold leading-snug text-[var(--fg)]">{s.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg-muted)]">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The panel */}
      <section className="border-t border-[var(--hairline)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.4fr] md:gap-16">
          <Reveal>
            <SectionLabel>The panel</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">Named before, not after.</h2>
          </Reveal>
          <div>
            {awards.panel.length > 0 ? (
              <ul className="border-t border-[var(--hairline)]">
                {awards.panel.map((j) => (
                  <Reveal key={j.name}>
                    <li className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--hairline)] py-5">
                      <span className="font-sans text-[19px] font-bold text-[var(--fg)]">{j.name}</span>
                      <span className="caption">
                        {j.role}
                        {j.batch ? ` · ${j.batch}` : ""}
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ul>
            ) : (
              <Reveal>
                <div className="border-l-2 border-[var(--frat-gold)]/50 pl-6">
                  <p className="label label--plain">Being appointed</p>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--fg-muted)]">
                    The judging panel is being appointed by the board and will be named here in
                    full — with their roles — before a single nomination is accepted. An award
                    judged by an anonymous panel is worth less than no award at all.
                  </p>
                </div>
              </Reveal>
            )}
          </div>
        </Container>
      </section>

      {/* Nominate, or the honest closed state */}
      <section id="nominate" className="scroll-mt-24 border-t border-[var(--hairline)] py-20 md:py-28">
        <Container className={cn(awards.nominationsOpen && "grid gap-12 md:grid-cols-[0.85fr_1.15fr] md:items-start md:gap-16")}>
          <div>
            <Reveal>
              <SectionLabel>{awards.nominationsOpen ? "Nominate" : "Not yet open"}</SectionLabel>
              <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">
                {awards.nominationsOpen ? "Put a brod forward." : `Nominations open ${awards.opensLabel}.`}
              </h2>
              <p className="lead mt-6 max-w-xl">
                {awards.nominationsOpen
                  ? "You do not need permission, a committee seat, or a long acquaintance. You need a case."
                  : "Put your name on the 58th Anniversary list and you will be told the day nominations open, along with everyone else on it."}
              </p>
            </Reveal>
            {!awards.nominationsOpen ? (
              <Reveal delay={0.1}>
                <div className="mt-9 flex flex-wrap gap-3">
                  <Link href="/anniversary" className={cn(buttonVariants({ variant: "default" }))}>
                    Join the 58th list
                  </Link>
                  <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>
                    Suggest a category
                  </Link>
                </div>
                <p className="mt-8 max-w-xl text-[15px] leading-relaxed text-[var(--fg-muted)]">
                  Already know who you want to nominate? Good — that is the point of publishing
                  the criteria this early. Start gathering the evidence now; the strongest
                  nominations are never written the week they are due.
                </p>
              </Reveal>
            ) : null}
          </div>

          {awards.nominationsOpen ? (
            <Reveal delay={0.08}>
              <NominationForm />
            </Reveal>
          ) : null}
        </Container>
      </section>
    </>
  );
}
