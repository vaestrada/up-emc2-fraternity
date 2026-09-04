import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { AssistanceForm } from "@/components/portal/assistance-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getServerSupabase, SUPABASE_AUTH_CONFIGURED } from "@/lib/supabase/rsc";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Request Assistance",
  // Never indexed: the page itself is harmless, but it should not be a search
  // result a brod's family could stumble into.
  robots: { index: false, follow: false },
};

export default async function PortalAssistancePage() {
  if (!SUPABASE_AUTH_CONFIGURED) redirect("/assistance");

  const supabase = await getServerSupabase();
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  // Not signed in: say why, and give the two real ways forward rather than a
  // bare redirect that reads as a door slammed on someone in trouble.
  if (!user) {
    return (
      <>
        <PageHero
          eyebrow="The Assistance Fund"
          title="Request assistance"
          description="Requests are private to the board, so this form sits behind the Portal. If you cannot sign in right now, do not let that stop you — message the fraternity directly and a brod will take it from there."
        />
        <section className="py-20 md:py-28">
          <Container className="max-w-2xl">
            <Reveal>
              <div className="rounded-card bg-[var(--tint)] p-8 md:p-10">
                <h2 className="font-sans text-[22px] font-bold text-[var(--fg)]">You are not signed in</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-muted)]">
                  Sign in with the email the Alumni Association invited you at. If you have never
                  been invited, claim your record and the board will verify you against the roster.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/portal" className={cn(buttonVariants({ variant: "default" }))}>
                    Sign in
                  </Link>
                  <Link href="/portal/claim" className={cn(buttonVariants({ variant: "outline" }))}>
                    Claim your record
                  </Link>
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(buttonVariants({ variant: "ghost" }))}
                  >
                    Message the fraternity
                  </a>
                </div>
              </div>
            </Reveal>
          </Container>
        </section>
      </>
    );
  }

  const { data: profile } = await supabase!
    .from("members")
    .select("full_name,batch")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <>
      <PageHero
        eyebrow="The Assistance Fund"
        title="Tell the board what has happened."
        description="This goes to the board and to nobody else. There is no public case page, no progress bar, and no name anywhere on the site — not now and not later."
      />

      <section className="py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[0.8fr_1.2fr] md:items-start md:gap-16">
          <div>
            <Reveal>
              <div className="rounded-card bg-[var(--tint)] p-7">
                <h2 className="font-sans text-[19px] font-bold text-[var(--fg)]">What happens next</h2>
                <ol className="mt-4 space-y-3 text-[15px] leading-relaxed text-[var(--fg-muted)]">
                  <li>A board member reads it, usually within days.</li>
                  <li>Someone contacts you directly to understand the situation.</li>
                  <li>The board decides, and tells you either way.</li>
                  <li>
                    If assistance is given, it appears in the public ledger as an amount and a date.
                    Never your name, never what happened.
                  </li>
                </ol>
                <Link
                  href="/assistance"
                  className="mt-6 inline-block text-[15px] text-[var(--brand)] underline underline-offset-4"
                >
                  Read how the fund works
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-8 text-[15px] leading-relaxed text-[var(--fg-muted)]">
                If this is urgent and you would rather speak to someone,{" "}
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[var(--brand)] underline underline-offset-4"
                >
                  message the fraternity
                </a>{" "}
                instead. A form is never the only way to reach the brotherhood.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            <AssistanceForm
              defaultName={profile?.full_name ?? undefined}
              defaultBatch={profile?.batch ?? undefined}
              defaultEmail={user.email ?? undefined}
            />
          </Reveal>
        </Container>
      </section>
    </>
  );
}
