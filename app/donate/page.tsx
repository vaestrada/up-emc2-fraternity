import type { Metadata } from "next";
import { Landmark, Smartphone, Globe, HandCoins } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { PledgeForm } from "@/components/site/pledge-form";

export const metadata: Metadata = {
  title: "Give Back",
  description:
    "Support the scholarships, campus projects, and outreach programs of the EMC² Fraternity.",
};

const CHANNELS = [
  {
    icon: Smartphone,
    title: "GCash / Maya",
    body: "Scan the official QR code to give instantly from your phone.",
    note: "QR codes to be posted — awaiting the Alumni Association's official account details.",
  },
  {
    icon: Landmark,
    title: "Bank Transfer",
    body: "Direct deposit to the UP EMC² Fraternity Alumni Association, Inc. account.",
    note: "Bank name and account number to be posted after BOT confirmation.",
  },
  {
    icon: Globe,
    title: "From Abroad",
    body: "Overseas brods can give via PayPal or international wire transfer.",
    note: "PayPal link to be set up — coming soon.",
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
          <div className="grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] md:grid-cols-3">
            {CHANNELS.map((ch, i) => (
              <Reveal key={ch.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col bg-[var(--canvas)] p-8 text-center transition-colors hover:bg-[var(--surface)]">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
                    <ch.icon className="h-6 w-6 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
                  </div>
                  <h3 className="mt-6 font-display text-xl text-[var(--frat-cream)]">{ch.title}</h3>
                  <p className="mt-2 text-sm text-[var(--frat-cream)]/50">{ch.body}</p>
                  <p className="mt-auto pt-5 font-mono text-[10px] leading-relaxed tracking-[0.15em] text-[var(--frat-gold-light)]/60 uppercase">
                    {ch.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="blueprint border-t border-[var(--hairline)] py-24">
        <Container className="grid gap-14 md:grid-cols-2 md:items-start">
          <div>
            <Reveal>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
                <HandCoins className="h-6 w-6 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
              </div>
              <h2 className="gold-foil mt-6 font-display text-4xl font-semibold md:text-5xl">
                Make a Pledge
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 leading-relaxed text-[var(--frat-cream)]/60">
                While official payment channels are being finalized, you can already signal your
                support. Tell us what you&rsquo;d like to back — a scholarship, a campus project, an
                outreach campaign — and the Alumni Association will follow up with you directly once
                the channels are live.
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
