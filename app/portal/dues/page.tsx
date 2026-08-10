import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { HandCoins, ShieldAlert } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { DuesForm } from "@/components/portal/dues-form";
import { getServerSupabase, SUPABASE_AUTH_CONFIGURED } from "@/lib/supabase/rsc";

export const metadata: Metadata = {
  title: "Membership Dues",
  description: "Record your Alumni Association dues payment for acknowledgment.",
};

export default async function DuesPage() {
  if (!SUPABASE_AUTH_CONFIGURED) redirect("/portal");
  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };
  if (!user || !supabase) redirect("/portal");

  const { data: profile } = await supabase
    .from("members")
    .select("full_name, batch")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      <PageHero
        eyebrow="№ 08 — Membership Dues"
        title="Record Your Dues"
        description="Automated checkout is coming once the Association's PayMongo application clears business verification. Until then, dues are recorded the same way the brotherhood has always reconciled gifts — transfer, then tell us."
      />

      <section className="py-24">
        <Container className="grid max-w-4xl gap-14 md:grid-cols-2 md:items-start">
          <div>
            <Reveal>
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
                <HandCoins className="h-6 w-6 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
              </div>
              <h2 className="mt-6 font-display text-3xl text-[var(--frat-cream)] md:text-4xl">
                How it works today
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <ol className="mt-6 space-y-4 text-sm leading-relaxed text-[var(--frat-cream)]/70">
                <li>
                  <strong className="text-[var(--frat-cream)]">1. Send your dues</strong> via the
                  Association&rsquo;s official GCash, Maya, or bank transfer channel — see{" "}
                  <a href="/donate" className="text-[var(--frat-gold-light)] underline underline-offset-4">
                    Give Back
                  </a>{" "}
                  for current details.
                </li>
                <li>
                  <strong className="text-[var(--frat-cream)]">2. Record it here</strong> with your
                  transfer&rsquo;s reference number, so it can be matched to the Association&rsquo;s
                  own transaction history.
                </li>
                <li>
                  <strong className="text-[var(--frat-cream)]">3. Get acknowledged</strong> by email
                  once the Association verifies the match.
                </li>
              </ol>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex gap-3 border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-5 text-xs leading-relaxed text-[var(--frat-cream)]/70">
                <ShieldAlert className="h-4 w-4 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
                <span>
                  We don&rsquo;t process payments directly — nothing here touches your card or bank
                  login. This form only records what you already sent, for the Association to verify
                  and acknowledge.
                </span>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <DuesForm
              memberId={user.id}
              defaultName={profile?.full_name ?? ""}
              defaultBatch={profile?.batch ?? ""}
              defaultEmail={user.email ?? ""}
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
