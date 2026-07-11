import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { site, milestones } from "@/lib/content";

export const metadata: Metadata = {
  title: "History",
  description: "The history, credo, and honors of the EMC² Fraternity since 1969.",
};

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="Vol. I — Since 1969"
        title="The Archive"
        description="Equality, Service, and Brotherhood at the U.P. College of Engineering since 1969."
      />

      <section className="py-24">
        <Container className="grid gap-16 md:grid-cols-2 md:items-start">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                The Founding
              </p>
              <p className="mt-6 leading-relaxed text-[var(--frat-cream)]/60">{site.about}</p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="mt-10 border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-6 text-sm text-[var(--frat-cream)]/70">
                <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold-light)] uppercase">
                  Entry pending — full founding story
                </p>
                <p className="mt-3 leading-relaxed">
                  The complete written history — the ten founding scholars by name, the founding
                  chapter&rsquo;s story, and the early years — is being gathered from official
                  records and will be inscribed here.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="border border-[var(--hairline)] bg-[var(--ink)] p-10 text-center">
              <p className="font-serif text-3xl leading-relaxed text-[var(--frat-cream)] italic">
                &ldquo;{site.credo}&rdquo;
              </p>
              <p className="mt-6 font-mono text-[10px] tracking-[0.3em] text-[var(--frat-gold)] uppercase">
                The Credo
              </p>
              <div className="mx-auto my-8 h-px w-16 bg-[var(--hairline)]" />
              <p className="font-serif text-xl text-[var(--frat-cream)]/80">{site.mission}</p>
              <p className="mt-4 font-mono text-[10px] tracking-[0.3em] text-[var(--frat-gold)] uppercase">
                Alumni Association Mission
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Timeline */}
      <section className="blueprint border-y border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <h2 className="text-center font-display text-3xl text-[var(--frat-cream)] md:text-4xl">
              Milestones
            </h2>
          </Reveal>
          <div className="mx-auto mt-16 max-w-2xl space-y-14 border-l border-[var(--frat-gold)]/40 pl-10">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.08} className="relative">
                <div className="absolute top-3 -left-[45px] h-2.5 w-2.5 rotate-45 bg-[var(--frat-gold)]" />
                <p className="font-display text-4xl font-semibold text-[var(--frat-gold-light)] md:text-5xl">{m.year}</p>
                <p className="mt-2 font-display text-lg text-[var(--frat-cream)]">{m.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--frat-cream)]/70">{m.detail}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Photo */}
      <section className="py-24">
        <Container>
          <Reveal className="group">
            <div className="relative mx-auto aspect-[3/2] w-full max-w-4xl overflow-hidden border border-[var(--hairline)]">
              <Image
                src="/photos/anniv55-group-stage.jpg"
                alt="Brods gathered for the 55th Anniversary Celebration, February 24, 2024, at Bahay ng Alumni, U.P. Diliman"
                fill
                className="duotone object-cover"
                sizes="(min-width: 1024px) 800px, 100vw"
              />
            </div>
            <p className="mt-5 text-center font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase">
              Fig. 02 — 55th Anniversary Celebration · Bahay ng Alumni · Feb 24 MMXXIV
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
