import type { Metadata } from "next";
import Link from "next/link";
import { LayoutDashboard, Users, HandCoins } from "lucide-react";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SignInForm } from "@/components/portal/sign-in-form";
import { ProfileForm, type MemberProfile } from "@/components/portal/profile-form";
import { getServerSupabase, SUPABASE_AUTH_CONFIGURED } from "@/lib/supabase/rsc";

export const metadata: Metadata = {
  title: "The Portal",
  description: "Sign in to update your record and browse the brotherhood's private directory.",
};

export default async function PortalPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const supabase = SUPABASE_AUTH_CONFIGURED ? await getServerSupabase() : null;
  const {
    data: { user },
  } = (await supabase?.auth.getUser()) ?? { data: { user: null } };

  let profile: MemberProfile | null = null;
  if (user && supabase) {
    const { data } = await supabase.from("members").select("*").eq("id", user.id).maybeSingle();
    profile = data as MemberProfile | null;
  }

  return (
    <>
      <PageHero
        eyebrow="№ 06 — The Portal"
        title={user ? "Your Record" : "Enter the Portal"}
        description={
          user
            ? "Keep your record current so the brotherhood — and the Association — can reach the real you."
            : "A private space for verified brods to keep their record current and find one another. Sign in with the email the Alumni Association invited you at — the Portal is by invitation, so a stranger's address gets no link."
        }
      />

      <section className="py-24">
        <Container className="max-w-2xl">
          {/* The auth callback bounces here with ?error=auth when a magic link
              is expired, already used, or opened on another device. Without
              this the member lands on a plain sign-in form and assumes the
              site is broken. */}
          {!user && error === "auth" ? (
            <div
              role="alert"
              className="mb-8 border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-5 text-sm leading-relaxed text-[var(--frat-cream)]/80"
            >
              That sign-in link didn&rsquo;t work — it may have expired, been used already, or been
              opened on a different device from the one that requested it. Request a fresh link
              below and open it on this device.
            </div>
          ) : null}
          {user ? (
            <div className="space-y-8">
              <Reveal>
                <ProfileForm userId={user.id} profile={profile} />
              </Reveal>
              <Reveal delay={0.1}>
                <div className="grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-2">
                  {[
                    {
                      href: "/portal/directory",
                      Icon: Users,
                      title: "The Directory",
                      body: "Browse brods who've opted in.",
                    },
                    {
                      href: "/portal/dues",
                      Icon: HandCoins,
                      title: "Membership Dues",
                      body: "Record a dues payment for acknowledgment.",
                    },
                  ].map(({ href, Icon, title, body }) => (
                    <div key={href} className="flex items-center justify-between gap-4 bg-[var(--surface)] p-6">
                      <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--frat-gold)]/40">
                          <Icon className="h-5 w-5 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
                        </div>
                        <div>
                          <p className="font-display text-lg text-[var(--frat-cream)]">{title}</p>
                          <p className="text-sm text-[var(--frat-cream)]/60">{body}</p>
                        </div>
                      </div>
                      <Link href={href} className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
                        Open
                      </Link>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          ) : (
            <Reveal>
              <SignInForm />
            </Reveal>
          )}
        </Container>
      </section>

      {!user ? (
        <section className="border-t border-[var(--hairline)] bg-[var(--ink)] py-16">
          <Container className="flex max-w-2xl flex-col items-center gap-3 text-center">
            <LayoutDashboard className="h-6 w-6 text-[var(--frat-gold-light)]" strokeWidth={1.25} />
            <p className="font-serif text-lg italic text-[var(--frat-cream)]/80">
              &ldquo;A record kept is a brotherhood remembered.&rdquo;
            </p>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--frat-cream)]/60">
              Not invited yet? A board member verifies each brod against the roster before
              sending an invite.{" "}
              <Link href="/contact" className="text-[var(--frat-gold-light)] underline underline-offset-4">
                Ask the Alumni Association
              </Link>{" "}
              with your name and batch.
            </p>
          </Container>
        </section>
      ) : null}
    </>
  );
}
