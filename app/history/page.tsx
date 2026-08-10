import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { site, milestones, founders, demoGalleryPhotos } from "@/lib/content";
import { getApprovedContributions } from "@/lib/contributions";
import { PhotoGallery } from "@/components/site/photo-gallery";
import { ScrollCinematic } from "@/components/site/scroll-cinematic";

export const metadata: Metadata = {
  title: "History",
  description: "The history, credo, and honors of the EMC² Fraternity since 1969.",
};

export default async function HistoryPage() {
  const contributed = await getApprovedContributions();
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
                  records and will be inscribed here.{" "}
                  <a href="/contribute" className="font-semibold text-[var(--frat-gold-light)] underline underline-offset-4">
                    Have records to share?
                  </a>
                </p>
              </div>
            </Reveal>

            {founders.length > 0 ? (
              <Reveal delay={0.2}>
                <div className="mt-10">
                  <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-gold)] uppercase">
                    The Ten — Founding Scholars
                  </p>
                  <ul className="mt-5 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                    {founders.map((f) => (
                      <li key={f.name} className="text-sm text-[var(--frat-cream)]">
                        {f.name}
                        {f.note ? (
                          <span className="block text-[var(--frat-cream)]/60">{f.note}</span>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ) : null}
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
            <Reveal delay={milestones.length * 0.08} className="relative">
              <div className="absolute top-3 -left-[45px] h-2.5 w-2.5 rotate-45 border border-[var(--frat-gold)]/50 bg-transparent" />
              <div className="border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-5 text-sm leading-relaxed text-[var(--frat-cream)]/70">
                <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold-light)] uppercase">
                  Entries pending — help us fill the record
                </p>
                <p className="mt-3">
                  Four decades of the brotherhood&rsquo;s story are still uninscribed. If you were
                  there — a batch, a milestone, a campaign —{" "}
                  <a href="/contribute" className="font-semibold text-[var(--frat-gold-light)] underline underline-offset-4">
                    add it to the record
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Fifty-Five Years, In Motion — real 55th Anniversary photos, animated */}
      <ScrollCinematic
        src="/quantum-leap/demo-history-scroll.mp4"
        poster="/quantum-leap/demo-history-poster.jpg"
        eyebrow="Fig. 02 — 55th Anniversary Celebration · U.P. Diliman · Feb 24 MMXXIV"
        title="Fifty-Five Years, In Motion"
        description="Three real photographs from the brotherhood's own 55th Anniversary Celebration — no AI content here, just the Association's own archive, brought to life."
        heightVh={200}
      />

      {/* Brotherhood Life — DEMO PREVIEW, AI-generated, remove before public launch */}
      <section className="blueprint border-t border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              Preview — Brotherhood Life
            </p>
            <h2 className="mt-6 max-w-3xl font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              A glimpse of what a full gallery could hold
            </h2>
            <p className="mt-4 max-w-xl leading-relaxed text-[var(--frat-cream)]/70">
              AI-generated placeholder scenes standing in for the real photos the Association is still
              gathering — outreach, sportsfest, the study lounge, campus gatherings.{" "}
              <span className="text-[var(--frat-gold-light)]">
                Sample imagery for this walkthrough, not documentation of an actual event.
              </span>{" "}
              Have real photos to swap in?{" "}
              <a href="/contribute" className="font-semibold text-[var(--frat-gold-light)] underline underline-offset-4">
                Add them to the record
              </a>
              .
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <PhotoGallery photos={demoGalleryPhotos} />
          </Reveal>
        </Container>
      </section>

      {/* For the Studentry — a neutral path for prospective members */}
      <section className="border-t border-[var(--hairline)] bg-[var(--ink)] py-24">
        <Container className="max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              For the Studentry
            </p>
            <h2 className="mt-6 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              Interested in the brotherhood?
            </h2>
            <p className="mt-6 leading-relaxed text-[var(--frat-cream)]/70">
              EMC² draws its members from Engineering and the Physical Sciences at the University of
              the Philippines. To learn more about the fraternity, its work on campus, and how to get
              in touch, reach out to us directly — we&rsquo;re glad to answer questions.
            </p>
            <a
              href="/contact"
              className="mt-8 inline-block border border-[var(--frat-gold)]/50 px-6 py-3 font-mono text-xs font-semibold tracking-[0.25em] text-[var(--frat-gold-light)] uppercase transition-colors hover:border-[var(--frat-gold-light)]"
            >
              Get in touch
            </a>
          </Reveal>
        </Container>
      </section>

      {/* The Contributed Record — approved submissions from the brotherhood */}
      {contributed.length > 0 ? (
        <section className="blueprint border-t border-[var(--hairline)] py-24">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                The Contributed Record
              </p>
              <h2 className="mt-6 max-w-3xl font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
                Inscribed by the brotherhood
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-[var(--frat-cream)]/70">
                Memories, photos, and history sent in by brods and alumni, curated into the archive.
              </p>
            </Reveal>

            <div className="mt-14 space-y-16">
              {contributed.map((c, i) => (
                <Reveal key={c.id} delay={(i % 3) * 0.08}>
                  <article className="border-t border-[var(--hairline)] pt-8">
                    {c.kind ? (
                      <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-gold-light)] uppercase">
                        {c.kind}
                      </p>
                    ) : null}
                    <h3 className="mt-3 font-display text-2xl text-[var(--frat-cream)] md:text-3xl">
                      {c.title}
                    </h3>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase">
                      Contributed by {c.name}
                      {c.batch ? ` · Batch ${c.batch}` : ""}
                    </p>
                    <p className="mt-5 max-w-2xl whitespace-pre-wrap leading-relaxed text-[var(--frat-cream)]/80">
                      {c.details}
                    </p>
                    {c.photos.length > 0 ? (
                      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:max-w-3xl">
                        {c.photos.map((url, j) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={j}
                            src={url}
                            alt={`${c.title} — photo ${j + 1}`}
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
                        className="mt-4 inline-block font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold-light)] uppercase underline underline-offset-4"
                      >
                        View source &rarr;
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
