import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { ScrollCinematic } from "@/components/site/scroll-cinematic";
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
          <div className="border-t border-[var(--hairline)]">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={(i % 4) * 0.06}>
                <div
                  id={project.slug}
                  className="group -ml-4 grid scroll-mt-28 grid-cols-[auto_1fr] items-baseline gap-x-6 border-b border-[var(--hairline)] py-8 pl-4 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-l-2 hover:border-l-[var(--frat-gold)] hover:bg-[var(--frat-gold)]/[0.03] md:grid-cols-[auto_1fr_auto] md:gap-x-10"
                >
                  <span className="font-mono text-[11px] tracking-[0.2em] text-[var(--frat-gold)] transition-colors duration-500 group-hover:text-[var(--frat-gold-light)]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h2 className="font-display text-2xl leading-tight text-[var(--frat-cream)] transition-colors duration-500 group-hover:text-[var(--frat-gold-light)] md:text-3xl">
                        {project.title}
                      </h2>
                      {project.year ? (
                        <span className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold-light)] uppercase">
                          {project.year}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[var(--frat-cream)]/70">
                      {project.description}
                    </p>
                    <p className="mt-3 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase md:hidden">
                      {project.category}
                    </p>
                  </div>
                  <span className="hidden font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase md:block md:justify-self-end">
                    {project.category}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Fig. 03 — the same real retrospective collage already on this page,
          brought to life: a slow pan through all sixteen photos, top to
          bottom, exactly as printed. */}
      <ScrollCinematic
        src="/quantum-leap/demo-projects-scroll.mp4"
        poster="/quantum-leap/demo-projects-poster.jpg"
        eyebrow="Fig. 03 — Projects & Campaigns Retrospective"
        title="Fifteen Years of Work, In Motion"
        description="The same sixteen photographs from the brotherhood's projects and campaigns — Kalye Tunes to COVID-19 relief — panned through end to end."
        heightVh={200}
      />

      <section className="border-t border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <div className="border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-6 text-center text-sm text-[var(--frat-cream)]/70">
              More campaigns are inscribed every year. Have a project or photos to add to the
              ledger?{" "}
              <a href="/contribute" className="font-semibold text-[var(--frat-gold-light)] underline underline-offset-4">
                Add it to the record
              </a>
              .
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
