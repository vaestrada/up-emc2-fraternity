import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { ClaimForm } from "@/components/portal/claim-form";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Claim Your Record",
  description:
    "Brods of the EMC² Fraternity can claim their Member Portal record. A board member verifies each claim against the roster before an invitation is sent.",
};

const STEPS = [
  {
    n: "01",
    title: "You claim",
    body: "Your name, your batch, and the email you actually read. A nickname and a brod who can vouch for you make the next step faster.",
  },
  {
    n: "02",
    title: "The board verifies",
    body: "A board member matches your claim against the Association's roster, which is held offline and never uploaded anywhere. A person reads it; nothing is automatic.",
  },
  {
    n: "03",
    title: "Your invitation arrives",
    body: "An email with a one-time sign-in link. No password to set or lose. From then on the Portal is yours: your record, the directory, your dues.",
  },
];

export default function ClaimPage() {
  return (
    <>
      <PageHero
        eyebrow="The Portal"
        title="Claim your record."
        description="The Member Portal is by invitation, and every invitation is checked against the roster by a brod. Tell us who you are and the board will do the rest."
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
                      <p className="font-sans text-[20px] font-bold leading-snug text-[var(--fg)]">{s.title}</p>
                      <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg)]/70">{s.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.25}>
              <div className="mt-10 border-l-2 border-[var(--frat-gold)]/50 pl-6">
                <p className="label label--plain">Why we ask rather than look you up</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg)]/70">
                  The Association&rsquo;s roster carries birthdates, addresses, phone numbers, and
                  emergency contacts for 490 brods. It is deliberately kept off this website and out
                  of its database entirely, so there is nothing here to leak. That is also why a
                  claim cannot be checked instantly: the only copy is the one a board member opens
                  themselves.{" "}
                  <Link href="/privacy" className="text-[var(--brand)] underline underline-offset-4">
                    How we handle member data
                  </Link>
                  .
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.3}>
              <p className="mt-8 text-[15px] leading-relaxed text-[var(--fg)]/70">
                Not a brod, but want to reach the fraternity?{" "}
                <Link href="/contact" className="text-[var(--brand)] underline underline-offset-4">
                  Use the contact page
                </Link>
                , or{" "}
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--brand)] underline underline-offset-4"
                >
                  message us on Facebook
                </a>
                . Thinking of joining?{" "}
                <Link href="/join" className="text-[var(--brand)] underline underline-offset-4">
                  Start here
                </Link>
                .
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ClaimForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
