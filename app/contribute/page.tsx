import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ContributeForm } from "@/components/site/contribute-form";

export const metadata: Metadata = {
  title: "Add to the Record",
  description:
    "Alumni and friends of the EMC² Fraternity can submit memories, photographs, brod news, and history for the archive.",
};

const STEPS = [
  {
    n: "01",
    title: "You submit",
    body: "A memory, a photograph, a brod's news, a milestone we missed, or a correction, in your own words. No polish needed.",
  },
  {
    n: "02",
    title: "We curate",
    body: "The Alumni Association reviews every submission, checks the details, and shapes it into the archive's voice.",
  },
  {
    n: "03",
    title: "It is inscribed",
    body: "Approved entries take their place in the record: the timeline, the citations, the projects, the gallery.",
  },
];

export default function ContributePage() {
  return (
    <>
      <PageHero
        eyebrow="Contributions"
        title="Add to the Record"
        description="The archive is written by the brotherhood. Send us what you carry, the stories, photographs, and history only you have, and we will take care of inscribing it."
      />

      <section className="py-20 md:py-28">
        <Container className="grid gap-14 md:grid-cols-[0.9fr_1.1fr] md:items-start md:gap-20">
          <div>
            <Reveal>
              <SectionLabel>How it works</SectionLabel>
            </Reveal>
            <div className="mt-8 border-t border-[var(--hairline)]">
              {STEPS.map((s, i) => (
                <Reveal key={s.n} delay={0.06 + i * 0.05}>
                  <div className="grid grid-cols-[2.5rem_1fr] gap-5 border-b border-[var(--hairline)] py-6">
                    <span className="caption tabular-nums">{s.n}</span>
                    <div>
                      <p className="font-sans text-[22px] font-bold leading-snug text-[var(--fg)]">{s.title}</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg)]/70">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.3}>
              <p className="lead mt-10 text-[var(--fg)]/80">
                Every generation holds a piece of the record. This is how it comes home.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ContributeForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
