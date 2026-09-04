import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { PledgeForm } from "@/components/site/pledge-form";
import { GivingGate } from "@/components/site/giving-gate";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { association, site, donorVoices, legalNameNoPeriod } from "@/lib/content";
import { withoutDemo } from "@/lib/demo";
import { getPatrons } from "@/lib/patrons";

export const metadata: Metadata = {
  title: "Give Back",
  description:
    "Support the scholarships, campus projects, and outreach programmes of the EMC² Fraternity. For brods, alumni, and friends.",
};

const IMPACT = [
  {
    title: "The Brotherhood Assistance Fund",
    body: "Hospitalisation, accident, and bereavement for brods and their families. Requests are private; every peso appears in a public ledger.",
  },
  {
    title: "Scholarships",
    body: "Grants for deserving Engineering students. The fund is now being established.",
  },
  {
    title: "Campus projects",
    body: "Spaces like the Thinking Space study lounge inside Melchor Hall.",
  },
  {
    title: "Community outreach",
    body: "Relief drives and learning-centre work beyond the University.",
  },
];

export default async function DonatePage() {
  const patrons = await getPatrons();
  const voices = withoutDemo(donorVoices);
  return (
    <>
      <PageHero
        eyebrow="Patronage"
        title="Give Back"
        description={`Contributions from brods, alumni, and friends fund scholarships, campus projects, and community outreach, received and acknowledged by the ${legalNameNoPeriod}.`}
      />

      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container className="max-w-3xl">
          <GivingGate>
            <Reveal>
              <SectionLabel>How to give</SectionLabel>
              <h2 className="mt-7 display text-[2rem] md:text-[2.75rem]">
                {association.legalName}
              </h2>
              <p className="prose-archive mt-6 text-[17px] leading-[1.7]">
                The Association&rsquo;s official GCash, Maya, and bank-transfer details are being
                finalised and will be published here. In the meantime, message the fraternity so the
                Association can share current giving details and record your gift.
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <dl className="mt-10 border-t border-[var(--hairline)]">
                {[
                  { k: "GCash / Maya", v: "Being finalised" },
                  { k: "Bank transfer (InstaPay)", v: "Being finalised" },
                ].map((row) => (
                  <div key={row.k} className="grid grid-cols-[11rem_1fr] gap-4 border-b border-[var(--hairline)] py-4">
                    <dt className="caption pt-0.5">{row.k}</dt>
                    <dd className="text-[15px] text-[var(--fg)]/85">{row.v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={site.facebook} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "accent" }))}>
                  Message on Facebook
                </a>
                <a href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>
                  Contact the Association
                </a>
              </div>
              <p className="caption mt-8 max-w-xl">
                Already sent something, or planning to? Record it in the pledge form below with your
                transfer reference so the Association can acknowledge your contribution.
              </p>
            </Reveal>
          </GivingGate>
        </Container>
      </section>

      {/* Where a gift goes */}
      <section className="border-b border-[var(--hairline)] bg-[var(--tint)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[1fr_1.5fr] md:gap-20">
          <Reveal>
            <SectionLabel>Where your gift goes</SectionLabel>
            <h2 className="mt-7 display text-[2rem] md:text-[2.75rem]">
              Three things, and nothing else.
            </h2>
          </Reveal>
          <div>
            <div className="border-t border-[var(--hairline)]">
              {IMPACT.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.05}>
                  <div className="grid gap-2 border-b border-[var(--hairline)] py-6 md:grid-cols-[12rem_1fr] md:gap-8">
                    <h3 className="font-sans text-[22px] font-bold leading-snug text-[var(--fg)]">{item.title}</h3>
                    <p className="text-[15px] leading-relaxed text-[var(--fg)]/70">{item.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <dl className="mt-10 grid gap-8 sm:grid-cols-2">
                <div>
                  <dt className="caption">Received and acknowledged by</dt>
                  <dd className="mt-2 text-[15px] text-[var(--fg)]">{association.legalName}</dd>
                </div>
                <div>
                  <dt className="caption">SEC registration</dt>
                  <dd className="mt-2 text-[15px] text-[var(--fg)]/85">
                    {association.secRegNo ?? "Registration number to be added."}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="caption">Your privacy</dt>
                  <dd className="mt-2 max-w-xl text-[15px] leading-relaxed text-[var(--fg)]/70">
                    Details you share are used only to record and acknowledge your gift, and are handled
                    under the Philippine Data Privacy Act of 2012. We do not sell or share your
                    information.
                  </dd>
                </div>
              </dl>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Voices, when there are real ones */}
      {voices.length > 0 ? (
        <section className="border-b border-[var(--hairline)] py-20 md:py-28">
          <Container>
            <Reveal>
              <SectionLabel>Why brods give</SectionLabel>
            </Reveal>
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
              {voices.map((v, i) => (
                <Reveal key={i} delay={(i % 2) * 0.06}>
                  <figure>
                    <blockquote className="font-serif text-2xl font-medium leading-snug text-[var(--fg)]/90">
                      &ldquo;{v.quote}&rdquo;
                    </blockquote>
                    <figcaption className="caption mt-4">{v.by}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* The pledge */}
      <section className="border-b border-[var(--hairline)] py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-2 md:items-start md:gap-20">
          <div>
            <Reveal>
              <SectionLabel>Make a pledge</SectionLabel>
              <h2 className="mt-7 display text-[2rem] md:text-[2.75rem]">
                Tell the Association what your gift is for.
              </h2>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="prose-archive mt-6 text-[17px] leading-[1.7]">
                Sent something, or planning to? Say what you would like your gift to support, a
                scholarship, a campus project, an outreach campaign, and include your transfer
                reference so it can be recorded and acknowledged.
              </p>
              <p className="lead mt-6 text-[var(--fg)]/80">
                Every pledge, whatever the size, is an act of Service and Sacrifice for the next
                generation of brods.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.1}>
            <PledgeForm />
          </Reveal>
        </Container>
      </section>

      {/* Roll of patrons */}
      {patrons.length > 0 ? (
        <section className="border-b border-[var(--hairline)] bg-[var(--tint)] py-20 md:py-28">
          <Container>
            <Reveal>
              <SectionLabel>The Roll of Patrons</SectionLabel>
              <h2 className="mt-7 max-w-2xl display text-[2rem] md:text-[2.75rem]">
                With the brotherhood&rsquo;s thanks.
              </h2>
              <p className="prose-archive mt-6 text-[15px] leading-relaxed">
                Brods, alumni, and friends who have given and chosen to be named. Amounts are never listed.
              </p>
            </Reveal>
            <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
              {patrons.map((p, i) => (
                <Reveal key={i} delay={Math.min(i, 12) * 0.03}>
                  <span className="font-serif text-xl font-medium text-[var(--fg)]">
                    {p.name}
                    {p.batch ? <span className="caption ml-2">{p.batch}</span> : null}
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
