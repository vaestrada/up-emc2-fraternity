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
        eyebrow="Projects and campaigns"
        title="Works in Service"
        description="From quiz bees to disaster relief: the brotherhood's work in the College of Engineering and beyond."
      />

      <section className="py-24">
        <Container>
          <div className="border-t border-[var(--hairline)]">
            {projects.map((project, i) => (
              <Reveal key={project.slug} delay={(i % 4) * 0.06}>
                <div
                  id={project.slug}
                  className="grid scroll-mt-28 grid-cols-[2.5rem_1fr] items-baseline gap-x-4 border-b border-[var(--hairline)] py-7 md:grid-cols-[3.5rem_1fr_12rem] md:gap-x-8"
                >
                  <span className="caption tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                      <h2 className="font-sans text-[22px] font-bold leading-snug text-[var(--fg)] md:text-3xl">
                        {project.title}
                      </h2>
                      {project.year ? (
                        <span className="label">
                          {project.year}
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-[var(--fg)]/65">
                      {project.description}
                    </p>
                    <p className="caption mt-2 md:hidden">
                      {project.category}
                    </p>
                  </div>
                  <span className="hidden caption md:block md:justify-self-end">
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
      <section className="border-y border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <p className="label">
              From the archive
            </p>
            <h2 className="mt-7 max-w-3xl display text-[2rem] md:text-[2.75rem]">
              Fifteen years of work, on one sheet.
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--fg)]/70">
              Sixteen photographs from the brotherhood&rsquo;s own campaigns, Kalye Tunes at the
              U.P. Fair through to the COVID-19 relief operations. Open it full size.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            {/* aria-label rather than leaning on the image's alt: with an image
                inside a link the alt becomes the link text, which here is a long
                sentence that never says the link opens a new tab (WCAG 3.2.5).
                This states the action and the context change; the alt below still
                describes the sheet itself if the image fails to load. */}
            <a
              href="/photos/projects-campaigns-card.jpg"
              target="_blank"
              rel="noreferrer"
              aria-label="Open the full-size Projects and Campaigns retrospective sheet (opens in a new tab)"
              className="mx-auto block w-full max-w-2xl border border-[var(--hairline)] transition-colors hover:border-[var(--fg)]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--frat-gold-light)]"
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
            <div className="max-w-2xl border-l-2 border-[var(--frat-gold)]/50 pl-6 text-[15px] leading-relaxed text-[var(--fg)]/70">
              More campaigns are inscribed every year. Have a project or photos to add to the
              ledger?{" "}
              <a href="/contribute" className="font-semibold text-[var(--brand)] underline underline-offset-4">
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
