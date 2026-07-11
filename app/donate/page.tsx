import type { Metadata } from "next";
import Image from "next/image";
import { HandCoins } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { PledgeForm } from "@/components/site/pledge-form";

export const metadata: Metadata = {
  title: "Give Back",
  description:
    "Support the scholarships, campus projects, and outreach programs of the EMC² Fraternity.",
};

const QR_CHANNELS = [
  {
    src: "/donate/gcash-qr.jpg",
    name: "GCash",
    detail: "Buloy · InstaPay QR",
    alt: "GCash InstaPay QR code — account name Buloy",
  },
  {
    src: "/donate/maya-qr.jpg",
    name: "Maya",
    detail: "@vironestrada · InstaPay QR",
    alt: "Maya InstaPay QR code — Viron Gil Estrada, @vironestrada",
  },
  {
    src: "/donate/bdo-qr.jpg",
    name: "BDO",
    detail: "Savings ···· 0928 · InstaPay QR",
    alt: "BDO InstaPay QR code — savings account ending in 0928",
  },
  {
    src: "/donate/paypal-qr.png",
    name: "PayPal",
    detail: "Viron Estrada · scan in the PayPal app",
    alt: "PayPal QR code — Viron Estrada, for overseas contributions",
  },
];

export default function DonatePage() {
  return (
    <>
      <PageHero
        eyebrow="№ 05 — Patronage"
        title="Give Back to the Brotherhood"
        description="Your support funds scholarships, campus projects like the Thinking Space, and community outreach. The Alumni Association is SEC-registered and can formally acknowledge contributions."
      />

      <section className="py-24">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              Scan to Give
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-2xl leading-relaxed text-[var(--frat-cream)]/60">
              GCash, Maya, and BDO codes work with any InstaPay-enabled bank or e-wallet app —
              scan whichever is convenient. Overseas brods can scan the PayPal code from inside
              the PayPal app.
            </p>
          </Reveal>

          <div className="mt-12 grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2 lg:grid-cols-4">
            {QR_CHANNELS.map((ch, i) => (
              <Reveal key={ch.name} delay={(i % 4) * 0.08} className="h-full">
                <div className="flex h-full flex-col bg-[var(--canvas)] p-6">
                  <div className="relative aspect-[4/5] w-full bg-white p-2">
                    <Image src={ch.src} alt={ch.alt} fill className="object-contain p-2" sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw" />
                  </div>
                  <h3 className="mt-5 font-display text-xl text-[var(--frat-cream)]">{ch.name}</h3>
                  <p className="mt-1 font-mono text-[10px] leading-relaxed tracking-[0.15em] text-[var(--frat-cream)]/60 uppercase">
                    {ch.detail}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-10">
            <div className="border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-6 text-sm leading-relaxed text-[var(--frat-cream)]/70">
              After sending, include your transfer reference number in the pledge form below (or
              message the fraternity on Facebook) so the Alumni Association can record and
              formally acknowledge your contribution.
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="blueprint border-t border-[var(--hairline)] py-24">
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
              <p className="mt-6 leading-relaxed text-[var(--frat-cream)]/60">
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
    </>
  );
}
