import type { Metadata } from "next";
import { Archive } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { ContributeForm } from "@/components/site/contribute-form";

export const metadata: Metadata = {
  title: "Add to the Record",
  description:
    "Alumni and friends of the EMC² Fraternity can submit memories, photos, brod news, and history for the archive.",
};

const STEPS = [
  {
    n: "01",
    title: "You submit",
    body: "A memory, a photo, a brod's news, a milestone we missed, or a correction — in your own words. No polish needed.",
  },
  {
    n: "02",
    title: "We curate",
    body: "The Alumni Association reviews every submission, checks the details, and shapes it into the archive's voice.",
  },
  {
    n: "03",
    title: "It's inscribed",
    body: "Approved entries take their place in the record — the timeline, the citations, the ledger, the gallery.",
  },
];

export default function ContributePage() {
  return (
    <>
      <PageHero
        eyebrow="№ 06 — Contributions"
        title="Add to the Record"
        description="The archive is written by the brotherhood. Send us what you carry — the stories, photos, and history only you have — and we'll take care of inscribing it."
      />

      <section className="py-24">
        <Container className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:items-start">
          <div>
            <Reveal>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
                <Archive className="h-6 w-6 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
              </div>
              <p className="mt-6 font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                How it works
              </p>
            </Reveal>
            <div className="mt-8 space-y-8">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={0.1 + i * 0.08}>
                  <div className="grid grid-cols-[auto_1fr] gap-5">
                    <span className="font-mono text-sm text-[var(--frat-gold)]">{s.n}</span>
                    <div>
                      <p className="font-display text-xl text-[var(--frat-cream)]">{s.title}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[var(--frat-cream)]/70">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.34}>
              <p className="mt-10 font-serif text-xl italic leading-relaxed text-[var(--frat-gold-light)]">
                Every generation holds a piece of the record. This is how it comes home.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <ContributeForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
