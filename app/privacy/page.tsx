import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { association } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How the EMC² Fraternity Alumni Association handles information you submit through this site.",
};

const SECTIONS = [
  {
    h: "What we collect",
    p: "Only what you choose to send through the contact, pledge, and contribution forms — typically your name, batch, email, and the message, pledge, or material you submit. We do not track you or run advertising.",
  },
  {
    h: "How we use it",
    p: "Submissions go only to the Alumni Association, to reply to you, to record and acknowledge gifts, and — for archive contributions — to curate and inscribe entries with your consent. That's all.",
  },
  {
    h: "What we never do",
    p: "We do not sell, rent, or share your personal details with third parties, and we never publish your contact information. Contributed material is published only after your consent and the Association's review.",
  },
  {
    h: "Your rights",
    p: "Under the Philippine Data Privacy Act of 2012 (RA 10173) you may ask us to access, correct, or delete the information you've submitted. Reach the Association through the contact page and we'll act on your request.",
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="The Fine Print"
        title="Privacy"
        description={`How ${association.legalName} handles the information you share through this site.`}
      />

      <section className="py-24">
        <Container className="max-w-2xl space-y-12">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.h} delay={i * 0.08}>
              <div>
                <h2 className="label">
                  {s.h}
                </h2>
                <p className="prose-archive mt-4 text-[17px] leading-[1.7]">{s.p}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.4}>
            <p className="border-t border-[var(--hairline)] pt-8 text-sm leading-relaxed text-[var(--fg)]/60">
              This is the Association&rsquo;s current, good-faith commitment. A fuller written policy will be
              published as the Association formalises it. Questions?{" "}
              <a href="/contact" className="font-semibold text-[var(--brand)] underline underline-offset-4">
                Contact us
              </a>
              .
            </p>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
