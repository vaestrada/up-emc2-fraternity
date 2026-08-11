import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
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

      {/* Fig. 03 — the real retrospective collage.
          This was a full-bleed scroll video until a mobile audit showed why that
          was the wrong treatment: the hero videos are object-cover, so a portrait
          phone only ever sees the middle ~26% of the frame, which sliced this
          card's header and every caption mid-word ("...ECTS AND CAMP..."). A
          text-dense sheet has to be shown whole, not panned across. Contained and
          tappable at native resolution reads on every screen — and the project
          names are the point. */}
      <section className="blueprint border-y border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              Fig. 03 — Projects &amp; Campaigns Retrospective
            </p>
            <h2 className="mt-6 max-w-3xl font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              Fifteen Years of Work, On One Sheet
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--frat-cream)]/70">
              Sixteen photographs from the brotherhood&rsquo;s own campaigns — Kalye Tunes at the
              U.P. Fair through to the COVID-19 relief operations. Tap to open it full size.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <a
              href="/photos/projects-campaigns-card.jpg"
              target="_blank"
              rel="noreferrer"
              className="group mx-auto block w-full max-w-2xl border border-[var(--hairline)] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[var(--frat-gold)]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--frat-gold-light)]"
            >
              {/* next/image for the on-page render so phones fetch a resized copy
                  rather than the full 1080² sheet; the anchor above still points at
                  the untouched original, which is what makes it worth opening. */}
              <Image
                src="/photos/projects-campaigns-card.jpg"
                alt="Retrospective sheet of sixteen photographs from EMC² Fraternity projects and campaigns, including Kalye Tunes at the U.P. Fair, the Mathrix quiz bee, Kanalan bowling, Pautakan, the Thinking Space study lounge at Melchor Hall, Oplan Pag-ibig outreach, and COVID-19 relief operations"
                width={1080}
                height={1080}
                sizes="(min-width: 768px) 672px, 100vw"
                className="h-auto w-full"
              />
            </a>
          </Reveal>
        </Container>
      </section>

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
