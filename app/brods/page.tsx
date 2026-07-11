import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { BrodCard } from "@/components/site/brod-card";
import { Reveal } from "@/components/motion/reveal";
import { prominentBrods, officers, inMemoriam } from "@/lib/content";

export const metadata: Metadata = {
  title: "Prominent Brods",
  description: "Brods of the EMC² Fraternity recognized for excellence, honor, and service.",
};

export default function BrodsPage() {
  return (
    <>
      <PageHero
        eyebrow="№ 04 — Citations"
        title="Excellence, on the Record"
        description="Brothers who carry the credo into their professions, public service, and the University's alumni community."
      />

      <section className="py-24">
        <Container>
          <div className="grid gap-10 md:grid-cols-2">
            {prominentBrods.map((brod, i) => (
              <Reveal key={brod.slug} delay={i * 0.1}>
                <BrodCard brod={brod} index={i} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-16">
            <div className="border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-6 text-center text-sm text-[var(--frat-cream)]/70">
              This record is just beginning. If your batch has a brod who deserves a citation here —
              in engineering, public service, business, or the arts —{" "}
              <a href="/contact" className="font-semibold text-[var(--frat-gold-light)] underline underline-offset-4">
                nominate them
              </a>
              .
            </div>
          </Reveal>
        </Container>
      </section>

      {/* The Council — current officers */}
      <section className="blueprint border-t border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              № 04.1 — The Council
            </p>
            <h2 className="mt-6 max-w-3xl font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              Those who steward the brotherhood today
            </h2>
          </Reveal>

          {officers.length > 0 ? (
            <div className="mt-12 grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
              {officers.map((officer, i) => (
                <Reveal key={`${officer.role}-${officer.name}`} delay={(i % 3) * 0.08}>
                  <div className="h-full bg-[var(--canvas)] p-6">
                    <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold-light)] uppercase">
                      {officer.role}
                    </p>
                    <p className="mt-3 font-display text-xl text-[var(--frat-cream)]">{officer.name}</p>
                    {officer.batch ? (
                      <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase">
                        Batch {officer.batch}
                      </p>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <Reveal delay={0.1} className="mt-12">
              <div className="border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-6 text-sm leading-relaxed text-[var(--frat-cream)]/70">
                <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold-light)] uppercase">
                  Entry pending — the current council
                </p>
                <p className="mt-3">
                  The roster of the brotherhood&rsquo;s current officers is being confirmed and
                  will be inscribed here.
                </p>
              </div>
            </Reveal>
          )}
        </Container>
      </section>

      {/* In Memoriam */}
      <section className="border-t border-[var(--hairline)] bg-[var(--ink)] py-24">
        <Container className="max-w-3xl text-center">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              In Memoriam
            </p>
            <h2 className="mt-6 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              Brods who have gone ahead
            </h2>
          </Reveal>

          {inMemoriam.length > 0 ? (
            <ul className="mt-12 space-y-6 text-left">
              {inMemoriam.map((m) => (
                <Reveal key={`${m.name}-${m.years ?? ""}`}>
                  <li className="border-b border-[var(--hairline)] pb-6">
                    <p className="font-serif text-2xl text-[var(--frat-cream)]">{m.name}</p>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase">
                      {[m.batch ? `Batch ${m.batch}` : null, m.years].filter(Boolean).join(" · ")}
                    </p>
                    {m.note ? (
                      <p className="mt-3 leading-relaxed text-[var(--frat-cream)]/70">{m.note}</p>
                    ) : null}
                  </li>
                </Reveal>
              ))}
            </ul>
          ) : (
            <Reveal delay={0.1}>
              <p className="mx-auto mt-8 max-w-md font-serif text-xl italic leading-relaxed text-[var(--frat-cream)]/70">
                A place of remembrance is being prepared, so the brothers we have lost are never
                absent from the record.
              </p>
            </Reveal>
          )}
        </Container>
      </section>
    </>
  );
}
