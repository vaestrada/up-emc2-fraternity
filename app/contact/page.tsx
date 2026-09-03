import type { Metadata } from "next";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach the EMC² Fraternity and its Alumni Association.",
};

const linkClass =
  "text-[15px] text-[var(--fg)] underline underline-offset-4 decoration-[var(--fg)]/30 transition-colors hover:decoration-[var(--fg)]";

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Correspondence"
        title="Contact the Brotherhood"
        description="Questions, nominations, partnerships, or just checking in. The tambayan door is open."
      />

      <section className="py-20 md:py-28">
        <Container className="grid gap-14 md:grid-cols-[1fr_1.3fr] md:gap-20">
          <div>
            <Reveal>
              <dl className="border-t border-[var(--hairline)]">
                <div className="border-b border-[var(--hairline)] py-6">
                  <dt className="caption">The tambayan</dt>
                  <dd className="mt-2">
                    <a
                      href="https://www.google.com/maps/search/?api=1&query=14.6553,121.0685"
                      target="_blank"
                      rel="noreferrer"
                      className={linkClass}
                    >
                      {site.base}
                    </a>
                  </dd>
                </div>
                <div className="border-b border-[var(--hairline)] py-6">
                  <dt className="caption">Facebook, the fastest way to reach us today</dt>
                  <dd className="mt-2">
                    <a href={site.facebook} target="_blank" rel="noreferrer" className={linkClass}>
                      facebook.com/EMC2Fraternity
                    </a>
                  </dd>
                </div>
                <div className="border-b border-[var(--hairline)] py-6">
                  <dt className="caption">LinkedIn, for professional and alumni networking</dt>
                  <dd className="mt-2">
                    <a href={site.linkedin} target="_blank" rel="noreferrer" className={linkClass}>
                      linkedin.com/company/up-emc2-fraternity
                    </a>
                  </dd>
                </div>
              </dl>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="mt-10 border-l-2 border-[var(--frat-gold)]/50 pl-6">
                <p className="label">Entry pending</p>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg)]/70">
                  The Association&rsquo;s permanent correspondence address is being established and will
                  be published here. Have a story, photograph, or piece of history to share?{" "}
                  <a href="/contribute" className="text-[var(--brand)] underline underline-offset-4">
                    Add it to the record
                  </a>
                  .
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <ContactForm />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
