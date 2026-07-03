import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { BrodCard } from "@/components/site/brod-card";
import { Reveal } from "@/components/motion/reveal";
import { prominentBrods } from "@/lib/content";

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
            <div className="border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-6 text-center text-sm text-[var(--frat-cream)]/50">
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
    </>
  );
}
