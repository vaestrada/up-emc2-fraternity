import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { FacebookIcon } from "@/components/site/facebook-icon";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the EMC² Fraternity and its Alumni Association.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Correspondence"
        title="Contact the Brotherhood"
        description="Questions, nominations, partnerships, or just checking in — the tambayan door is open."
      />

      <section className="py-24">
        <Container className="grid gap-14 md:grid-cols-[1fr_1.2fr] md:items-start">
          <div className="space-y-10">
            <Reveal className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
                <MapPin className="h-5 w-5 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
              </div>
              <div>
                <h3 className="font-display text-lg text-[var(--frat-cream)]">The Tambayan</h3>
                <p className="mt-1 text-sm text-[var(--frat-cream)]/50">{site.base}</p>
                <p className="mt-2 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/35 uppercase">
                  14.6553° N / 121.0685° E
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="flex gap-5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
                <FacebookIcon className="h-5 w-5 text-[var(--frat-gold-light)]" />
              </div>
              <div>
                <h3 className="font-display text-lg text-[var(--frat-cream)]">Facebook</h3>
                <p className="mt-1 text-sm text-[var(--frat-cream)]/50">
                  The fastest way to reach us today is the official page:
                </p>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm font-semibold text-[var(--frat-gold-light)] underline underline-offset-4"
                >
                  facebook.com/EMC2Fraternity
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-6 text-sm text-[var(--frat-cream)]/50">
                An official e-mail address for the Alumni Association will be published here soon.
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <ContactForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
