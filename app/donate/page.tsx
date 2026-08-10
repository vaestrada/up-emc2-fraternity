import type { Metadata } from "next";
import { HandCoins, ShieldCheck, GraduationCap, Building2, HeartHandshake } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { PledgeForm } from "@/components/site/pledge-form";
import { GivingGate } from "@/components/site/giving-gate";
import { association, site, donorVoices } from "@/lib/content";
import { getPatrons } from "@/lib/patrons";

export const metadata: Metadata = {
  title: "Give Back",
  description:
    "Support the scholarships, campus projects, and outreach programs of the EMC² Fraternity — for brods, alumni, and friends.",
};

const IMPACT = [
  {
    Icon: GraduationCap,
    title: "Scholarships",
    body: "Grants for deserving Engineering students — the fund now being established.",
  },
  {
    Icon: Building2,
    title: "Campus Projects",
    body: "Spaces like the Thinking Space study lounge inside Melchor Hall.",
  },
  {
    Icon: HeartHandshake,
    title: "Community Outreach",
    body: "Relief drives and learning-center work beyond the University.",
  },
];

export default async function DonatePage() {
  const patrons = await getPatrons();
  return (
    <>
      <PageHero
        eyebrow="№ 05 — Patronage"
        title="Give Back to the Brotherhood"
        description={`Contributions from brods, alumni, and friends fund scholarships, campus projects like the Thinking Space, and community outreach — received and acknowledged by the ${association.legalName}.`}
      />

      <section className="py-24">
        <Container>
          <GivingGate>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                How to Give
              </p>
            </Reveal>

            {/* Official Association giving channels — details pending. Personal
                collection accounts were retired; giving now routes to the
                registered Association account once its details are provided. */}
            <Reveal delay={0.1}>
              <div className="mt-8 border border-[var(--hairline)] bg-[var(--ink)] p-8 md:p-10">
                <p className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-gold-light)] uppercase">
                  Official Giving Channels
                </p>
                <h3 className="mt-4 font-display text-2xl text-[var(--frat-cream)] md:text-3xl">
                  {association.legalName}
                </h3>
                <p className="mt-4 max-w-2xl leading-relaxed text-[var(--frat-cream)]/70">
                  The Association&rsquo;s official GCash, Maya, and bank-transfer details are
                  being finalized and will be inscribed here. In the meantime, message the
                  fraternity so the Association can share current giving details and record
                  your gift.
                </p>

                <dl className="mt-8 grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2">
                  {[
                    { k: "GCash / Maya", v: "Being finalized" },
                    { k: "Bank transfer (InstaPay)", v: "Being finalized" },
                  ].map((row) => (
                    <div key={row.k} className="bg-[var(--ink)] p-5">
                      <dt className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase">
                        {row.k}
                      </dt>
                      <dd className="mt-2 font-display text-lg text-[var(--frat-cream)]/70">{row.v}</dd>
                    </div>
                  ))}
                </dl>

                <div className="mt-8 flex flex-wrap gap-4">
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-[var(--frat-gold)] px-6 py-3 font-mono text-xs font-semibold tracking-[0.25em] text-[#1a1305] uppercase transition-colors hover:bg-[var(--frat-gold-light)]"
                  >
                    Message on Facebook
                  </a>
                  <a
                    href="/contact"
                    className="border border-[var(--frat-gold)]/50 px-6 py-3 font-mono text-xs font-semibold tracking-[0.25em] text-[var(--frat-gold-light)] uppercase transition-colors hover:border-[var(--frat-gold-light)]"
                  >
                    Contact the Association
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal className="mt-8">
              <div className="border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-6 text-sm leading-relaxed text-[var(--frat-cream)]/70">
                Already sent something, or planning to? Record it in the pledge form below (or
                message the fraternity on Facebook) with your transfer reference so the
                Association can acknowledge your contribution.
              </div>
            </Reveal>
          </GivingGate>
        </Container>
      </section>

      {/* Accountability / disclosures */}
      <section className="blueprint border-t border-[var(--hairline)] py-24">
        <Container className="grid gap-14 md:grid-cols-2 md:items-start">
          <div>
            <Reveal>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
                <ShieldCheck className="h-6 w-6 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
              </div>
              <p className="mt-6 font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                Accountability
              </p>
              <h2 className="mt-4 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
                Where your gift goes
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 leading-relaxed text-[var(--frat-cream)]/70">
                Gifts support three things: <strong className="text-[var(--frat-cream)]">scholarships</strong> for
                deserving Engineering students, <strong className="text-[var(--frat-cream)]">campus projects</strong> like
                the Thinking Space study lounge, and <strong className="text-[var(--frat-cream)]">community outreach</strong>.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <dl className="border border-[var(--hairline)] bg-[var(--ink)] p-8 text-sm md:p-10">
              <div className="flex flex-col gap-1 border-b border-[var(--hairline)] pb-5">
                <dt className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-cream)]/60 uppercase">
                  Received &amp; acknowledged by
                </dt>
                <dd className="font-display text-lg text-[var(--frat-cream)]">{association.legalName}</dd>
              </div>
              <div className="flex flex-col gap-1 border-b border-[var(--hairline)] py-5">
                <dt className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-cream)]/60 uppercase">
                  SEC Registration
                </dt>
                <dd className="text-[var(--frat-cream)]/70">
                  {association.secRegNo ?? "Registration number to be added."}
                </dd>
              </div>
              <div className="flex flex-col gap-1 pt-5">
                <dt className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-cream)]/60 uppercase">
                  Your privacy
                </dt>
                <dd className="leading-relaxed text-[var(--frat-cream)]/70">
                  Details you share are used only to record and acknowledge your gift, and are
                  handled under the Philippine Data Privacy Act of 2012 (RA 10173). We do not sell
                  or share your information.
                </dd>
              </div>
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* Impact — factual, no invented figures */}
      <section className="border-t border-[var(--hairline)] py-24">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              The Impact
            </p>
            <h2 className="mt-6 max-w-3xl font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
              What a gift builds
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-3">
            {IMPACT.map(({ Icon, title, body }, i) => (
              <Reveal key={title} delay={(i % 3) * 0.08} className="h-full">
                <div className="group flex h-full flex-col bg-[var(--canvas)] p-8 transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[var(--frat-gold)]/[0.04]">
                  <Icon
                    className="h-7 w-7 text-[var(--frat-gold-light)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:-translate-y-0.5"
                    strokeWidth={1.25}
                  />
                  <h3 className="mt-5 font-display text-xl text-[var(--frat-cream)]">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--frat-cream)]/70">{body}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {donorVoices.length > 0 ? (
            <div className="mt-16 grid gap-8 md:grid-cols-2">
              {donorVoices.map((v, i) => (
                <Reveal key={i} delay={(i % 2) * 0.08}>
                  <figure className="border-l border-[var(--frat-gold)]/40 pl-6">
                    <blockquote className="font-serif text-xl italic leading-relaxed text-[var(--frat-cream)]/85">
                      &ldquo;{v.quote}&rdquo;
                    </blockquote>
                    <figcaption className="mt-3 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold-light)] uppercase">
                      {v.by}
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          ) : null}
        </Container>
      </section>

      <section className="border-t border-[var(--hairline)] py-24">
        <Container className="grid gap-14 md:grid-cols-2 md:items-start">
          <div>
            <Reveal>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
                <HandCoins className="h-6 w-6 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
              </div>
              <h2 className="mt-6 font-display text-4xl font-semibold text-[var(--frat-gold-light)] md:text-5xl">
                Make a Pledge
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 leading-relaxed text-[var(--frat-cream)]/70">
                Sent something, or planning to? Tell the Alumni Association what you&rsquo;d like
                your gift to support — a scholarship, a campus project, an outreach campaign —
                and include your transfer reference so it can be properly recorded and
                acknowledged.
              </p>
              <p className="mt-5 font-serif text-xl italic text-[var(--frat-gold-light)]">
                Every pledge, whatever the size, is an act of Service and Sacrifice for the next
                generation of brods.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <PledgeForm />
          </Reveal>
        </Container>
      </section>

      {/* Roll of Patrons — only consented + acknowledged pledges, names only */}
      {patrons.length > 0 ? (
        <section className="blueprint border-t border-[var(--hairline)] py-24">
          <Container>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                The Roll of Patrons
              </p>
              <h2 className="mt-6 max-w-3xl font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-4xl">
                With the brotherhood&rsquo;s thanks
              </h2>
              <p className="mt-4 max-w-xl leading-relaxed text-[var(--frat-cream)]/70">
                Brods, alumni, and friends who have given — and chosen to be named. Amounts are
                never listed.
              </p>
            </Reveal>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4">
              {patrons.map((p, i) => (
                <Reveal key={i} delay={Math.min(i, 12) * 0.03}>
                  <span className="font-display text-lg text-[var(--frat-cream)]">
                    {p.name}
                    {p.batch ? (
                      <span className="ml-2 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                        {p.batch}
                      </span>
                    ) : null}
                  </span>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}
    </>
  );
}
