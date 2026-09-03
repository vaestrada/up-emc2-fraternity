import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { BrodCard } from "@/components/site/brod-card";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { prominentBrods, officers, inMemoriam, FOUNDING_YEAR } from "@/lib/content";
import { withoutDemo } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Prominent Brods",
  description: "Brods of the EMC² Fraternity recognised for excellence, honour, and service.",
};

export default function BrodsPage() {
  const brods = withoutDemo(prominentBrods);
  return (
    <>
      <PageHero
        eyebrow="Citations"
        title="Prominent Brods"
        description="Brothers who carry the credo into their professions, public service, and the University's alumni community."
      />

      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container>
          <div className="grid gap-12 md:grid-cols-2 md:gap-14 lg:grid-cols-3">
            {brods.map((brod, i) => (
              <Reveal key={brod.slug} delay={(i % 3) * 0.06}>
                <BrodCard brod={brod} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <div className="max-w-2xl border-l-2 border-[var(--frat-gold)]/50 pl-6">
              <p className="label">Nominations</p>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--frat-cream)]/70">
                This record is just beginning. If your batch has a brod who deserves a citation here,
                in engineering, public service, business, or the arts,{" "}
                <a href="/contribute" className="text-[var(--frat-gold-light)] underline underline-offset-4">
                  submit a citation
                </a>
                .
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* The register */}
      <section className="border-b border-[var(--hairline)] bg-[var(--ink)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <SectionLabel>The register</SectionLabel>
            <h2 className="mt-7 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              Four hundred ninety, and counting.
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="lead">
              The brotherhood&rsquo;s roster runs from the ten founding scholars of {FOUNDING_YEAR} to
              today&rsquo;s active brods: 490 names on record.
            </p>
            <p className="prose-archive mt-6 text-[17px] leading-[1.7]">
              The citations above are the first formal entries in a register the Association is
              still building, batch by batch.
            </p>
          </Reveal>
        </Container>
      </section>

      {/* The council */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <SectionLabel>The council</SectionLabel>
            <h2 className="mt-7 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              Those who steward the brotherhood today.
            </h2>
          </Reveal>
          {officers.length > 0 ? (
            <div className="border-t border-[var(--hairline)]">
              {officers.map((officer, i) => (
                <Reveal key={`${officer.role}-${officer.name}`} delay={i * 0.04}>
                  <div className="grid grid-cols-[1fr_auto] items-baseline gap-6 border-b border-[var(--hairline)] py-5">
                    <div>
                      <p className="font-serif text-xl font-semibold text-[var(--frat-cream)]">{officer.name}</p>
                      <p className="caption mt-1">{officer.role}</p>
                    </div>
                    {officer.batch ? <p className="caption">Batch {officer.batch}</p> : null}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.08}>
              <div className="border-l-2 border-[var(--frat-gold)]/50 pl-6">
                <p className="label">Entry pending</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--frat-cream)]/70">
                  The roster of the brotherhood&rsquo;s current officers is being confirmed and will be
                  inscribed here.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* In memoriam */}
      <section className="border-b border-[var(--hairline)] bg-[var(--ink)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <SectionLabel>In memoriam</SectionLabel>
            <h2 className="mt-7 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              Brods who have gone ahead.
            </h2>
          </Reveal>
          {inMemoriam.length > 0 ? (
            <ul className="border-t border-[var(--hairline)]">
              {inMemoriam.map((m) => (
                <Reveal key={`${m.name}-${m.years ?? ""}`}>
                  <li className="border-b border-[var(--hairline)] py-5">
                    <p className="font-serif text-2xl font-semibold text-[var(--frat-cream)]">{m.name}</p>
                    <p className="caption mt-1">
                      {[m.batch ? `Batch ${m.batch}` : null, m.years].filter(Boolean).join(" · ")}
                    </p>
                    {m.note ? <p className="mt-3 text-[15px] leading-relaxed text-[var(--frat-cream)]/70">{m.note}</p> : null}
                  </li>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal delay={0.08}>
              <p className="lead text-[var(--frat-cream)]/75">
                A place of remembrance is being prepared, so the brothers we have lost are never absent
                from the record.
              </p>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}
