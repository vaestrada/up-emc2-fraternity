import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { ProjectCard } from "@/components/site/project-card";
import { Reveal } from "@/components/motion/reveal";
import { projects } from "@/lib/content";

export const metadata: Metadata = {
  title: "Projects & Campaigns",
  description: "Community, academic, and outreach campaigns led by the EMC² Fraternity.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="№ 03 — The Ledger"
        title="Works in Service"
        description="From quiz bees to disaster relief — the brotherhood's work in the College of Engineering and beyond."
      />

      <section className="py-24">
        <Container>
          <div className="grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={(i % 3) * 0.08} className="h-full">
                <ProjectCard project={project} index={i} />
              </Reveal>
            ))}
          </div>

          <Reveal className="group mt-20">
            <div className="relative mx-auto aspect-square w-full max-w-xl overflow-hidden border border-[var(--hairline)] md:aspect-[4/3] md:max-w-3xl">
              <Image
                src="/photos/projects-campaigns-card.jpg"
                alt="A retrospective of EMC² Fraternity projects and campaigns"
                fill
                className="object-contain"
                sizes="(min-width: 768px) 700px, 100vw"
              />
            </div>
            <p className="mt-5 text-center font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase">
              Fig. 03 — Projects &amp; campaigns retrospective
            </p>
          </Reveal>

          <Reveal className="mt-16">
            <div className="border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-6 text-center text-sm text-[var(--frat-cream)]/70">
              More campaigns are inscribed every year. Have a project or photos to add to the
              ledger?{" "}
              <a href="/contact" className="font-semibold text-[var(--frat-gold-light)] underline underline-offset-4">
                Send them in
              </a>
              .
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
