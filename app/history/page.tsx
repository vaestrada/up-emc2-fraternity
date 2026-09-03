import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ArchivePlates } from "@/components/site/archive-plates";
import { PhotoGallery } from "@/components/site/photo-gallery";
import { site, milestones, founders, demoGalleryPhotos } from "@/lib/content";
import { DEMO_CONTENT } from "@/lib/demo";
import { getApprovedContributions } from "@/lib/contributions";

export const metadata: Metadata = {
  title: "History",
  description: "The history, credo, and honours of the EMC² Fraternity since 1969.",
};

const PLATES = [
  {
    src: "/photos/anniv55-gazebo.jpg",
    alt: "Brods gathered at the gazebo during the 55th Anniversary Celebration",
    figure: "The gazebo, U.P. Diliman",
    caption: "55th Anniversary Celebration, 24 February 2024.",
  },
  {
    src: "/photos/anniv55-stage.jpg",
    alt: "Brods gathered on stage at the 55th Anniversary Celebration",
    figure: "Bahay ng Alumni",
    caption: "Brods of every batch on stage.",
  },
  {
    src: "/photos/anniv55-outdoor.jpg",
    alt: "Brods gathered before Quezon Hall at the 55th Anniversary Celebration",
    figure: "Quezon Hall",
    caption: "The brotherhood, 1967 to 2023 batches.",
  },
];

export default async function HistoryPage() {
  const contributed = await getApprovedContributions();
  return (
    <>
      <PageHero
        eyebrow="Since 1969"
        title="The History"
        description="Equality, Service, and Brotherhood at the U.P. College of Engineering for more than half a century."
        image={{
          src: "/photos/anniv55-gazebo.jpg",
          alt: "Brods gathered at the gazebo during the 55th Anniversary Celebration",
          caption: "The 55th Anniversary Celebration, U.P. Diliman, 24 February 2024.",
        }}
      />

      {/* The founding */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <SectionLabel>The founding</SectionLabel>
            <h2 className="mt-7 display text-[2rem] md:text-[2.75rem]">
              Ten scholars, one college.
            </h2>
          </Reveal>
          <div>
            <Reveal delay={0.08}>
              <p className="lead">{site.about.split(". ")[0]}.</p>
              <div className="prose-archive mt-6 text-[17px] leading-[1.7]">
                <p>{site.about.split(". ").slice(1).join(". ")}</p>
              </div>
            </Reveal>
            <Reveal delay={0.14}>
              <div className="mt-10 border-l-2 border-[var(--frat-gold)]/50 pl-6">
                <p className="label">Entry pending</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg)]/70">
                  The complete written history, the ten founding scholars by name, and the early
                  years are being gathered from official records.{" "}
                  <a href="/contribute" className="text-[var(--brand)] underline underline-offset-4">
                    Have records to share?
                  </a>
                </p>
              </div>
            </Reveal>
            {founders.length > 0 ? (
              <Reveal delay={0.2}>
                <div className="mt-10">
                  <p className="label">The ten founding scholars</p>
                  <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {founders.map((f) => (
                      <li key={f.name} className="text-[15px] text-[var(--fg)]">
                        {f.name}
                        {f.note ? <span className="block text-[var(--fg)]/60">{f.note}</span> : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
          </div>
        </Container>
      </section>

      {/* The credo and the mission */}
      <section className="border-b border-[var(--hairline)] bg-[var(--tint)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-2 md:gap-20">
          <Reveal>
            <SectionLabel>The credo</SectionLabel>
            <p className="mt-7 font-serif text-2xl font-medium leading-snug text-[var(--fg)] md:text-3xl">
              &ldquo;{site.credo}&rdquo;
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <SectionLabel>The Alumni Association&rsquo;s mission</SectionLabel>
            <p className="mt-7 font-serif text-2xl font-medium leading-snug text-[var(--fg)]/85 md:text-3xl">
              {site.mission}
            </p>
          </Reveal>
        </Container>
      </section>

      {/* Milestones */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <SectionLabel>Milestones</SectionLabel>
            <h2 className="mt-7 display text-[2rem] md:text-[2.75rem]">
              The record so far.
            </h2>
          </Reveal>
          <div className="border-t border-[var(--hairline)]">
            {milestones.map((m, i) => (
              <Reveal key={m.year} delay={i * 0.04}>
                <div className="grid grid-cols-[5rem_1fr] gap-6 border-b border-[var(--hairline)] py-6 md:grid-cols-[7rem_1fr] md:gap-10">
                  <p className="font-display text-2xl text-[var(--brand)]">{m.year}</p>
                  <div>
                    <p className="font-sans text-[22px] font-bold leading-snug text-[var(--fg)]">{m.title}</p>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg)]/65">{m.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
            <Reveal delay={milestones.length * 0.04}>
              <div className="py-6">
                <div className="border-l-2 border-[var(--frat-gold)]/50 pl-6">
                  <p className="label">Entries pending</p>
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg)]/70">
                    Four decades of the brotherhood&rsquo;s story are still to be inscribed. If you
                    were there,{" "}
                    <a href="/contribute" className="text-[var(--brand)] underline underline-offset-4">
                      add it to the record
                    </a>
                    .
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* From the archive */}
      <section className="border-b border-[var(--hairline)] bg-[var(--tint)] py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionLabel>From the archive</SectionLabel>
            <h2 className="mt-7 max-w-2xl display text-[2rem] md:text-[2.75rem]">
              Fifty-five years, in one afternoon.
            </h2>
          </Reveal>
          <div className="mt-12">
            <ArchivePlates plates={PLATES} />
          </div>
        </Container>
      </section>

      {/* Brotherhood life — placeholder gallery, gated by lib/demo.ts */}
      {DEMO_CONTENT ? (
        <section className="border-b border-[var(--hairline)] py-20 md:py-28">
          <Container>
            <Reveal>
              <SectionLabel>Brotherhood life</SectionLabel>
              <h2 className="mt-7 max-w-2xl display text-[2rem] md:text-[2.75rem]">
                A gallery, awaiting the real photographs.
              </h2>
              <p className="prose-archive mt-6 text-[15px] leading-relaxed">
                These scenes are AI-generated placeholders for the outreach, sportsfest, study-lounge,
                and campus gatherings the Association is still collecting photographs of. They are
                sample imagery for this walkthrough, not documentation of any event.{" "}
                <a href="/contribute" className="text-[var(--brand)] underline underline-offset-4">
                  Have real photographs?
                </a>
              </p>
            </Reveal>
            <Reveal delay={0.1} className="mt-12">
              <PhotoGallery photos={demoGalleryPhotos} />
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* For the studentry */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <SectionLabel>For the studentry</SectionLabel>
            <h2 className="mt-7 display text-[2rem] md:text-[2.75rem]">
              Interested in the brotherhood?
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="prose-archive text-[17px] leading-[1.7]">
              EMC&sup2; draws its members from Engineering and the Physical Sciences at the University
              of the Philippines. To learn about the fraternity, its work on campus, and how to get in
              touch, reach out to us directly. We are glad to answer questions.
            </p>
            <a
              href="/contact"
              className="mt-8 inline-flex h-10 items-center border border-[var(--fg)]/30 px-5 font-sans text-[11px] font-medium tracking-[0.14em] text-[var(--fg)] uppercase transition-colors hover:border-[var(--fg)]/70"
            >
              Get in touch
            </a>
          </Reveal>
        </Container>
      </section>

      {/* The contributed record */}
      {contributed.length > 0 ? (
        <section className="border-b border-[var(--hairline)] bg-[var(--tint)] py-20 md:py-28">
          <Container>
            <Reveal>
              <SectionLabel>The contributed record</SectionLabel>
              <h2 className="mt-7 max-w-2xl display text-[2rem] md:text-[2.75rem]">
                Inscribed by the brotherhood.
              </h2>
              <p className="prose-archive mt-6 text-[15px] leading-relaxed">
                Memories, photographs, and history sent in by brods and alumni, curated into the archive.
              </p>
            </Reveal>

            <div className="mt-12 space-y-14">
              {contributed.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 0.06}>
                  <article className="border-t border-[var(--hairline)] pt-8">
                    {c.kind ? <p className="label">{c.kind}</p> : null}
                    <h3 className="mt-3 font-sans text-[22px] font-bold leading-snug text-[var(--fg)] md:text-3xl">{c.title}</h3>
                    <p className="caption mt-2">
                      Contributed by {c.name}
                      {c.batch ? `, Batch ${c.batch}` : ""}
                    </p>
                    <p className="prose-archive mt-5 whitespace-pre-wrap text-[17px] leading-[1.7]">{c.details}</p>
                    {c.photos.length > 0 ? (
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:max-w-3xl">
                        {c.photos.map((url, j) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={j}
                            src={url}
                            alt={`${c.title}, photograph ${j + 1}`}
                            loading="lazy"
                            className="aspect-square w-full border border-[var(--hairline)] object-cover"
                          />
                        ))}
                      </div>
                    ) : null}
                    {c.links ? (
                      <a
                        href={c.links}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-block text-[15px] text-[var(--brand)] underline underline-offset-4"
                      >
                        View source
                      </a>
                    ) : null}
                  </article>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
