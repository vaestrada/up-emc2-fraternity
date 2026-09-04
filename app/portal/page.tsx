import type { Metadata } from "next";
import Link from "next/link";
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
        eyebrow="The Portal"
        title={user ? "Your Record" : "Enter the Portal"}
        description={
          user
            ? "Keep your record current so the brotherhood and the Association can reach you."
            : "A private space for verified brods to keep their record current and find one another. Sign in with the email the Alumni Association invited you at. The Portal is by invitation; a stranger's address gets no link."
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
              className="mb-8 border-l-2 border-[var(--frat-gold)]/50 pl-5 py-1 text-sm leading-relaxed text-[var(--fg)]/80"
            >
              That sign-in link did not work. It may have expired, been used already, or been
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
                <div className="border-t border-[var(--hairline)]">
                  {[
                    {
                      href: "/portal/directory",
                      title: "The Directory",
                      body: "Browse brods who have opted in to be found.",
                    },
                    {
                      href: "/portal/dues",
                      title: "Membership Dues",
                      body: "Record a dues payment for acknowledgement.",
                    },
                  ].map(({ href, title, body }) => (
                    <div key={href} className="flex items-center justify-between gap-4 border-b border-[var(--hairline)] py-5">
                      <div>
                        <p className="font-sans text-[19px] font-bold text-[var(--fg)]">{title}</p>
                        <p className="text-[14px] text-[var(--fg)]/60">{body}</p>
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
        <section className="border-t border-[var(--hairline)] bg-[var(--tint)] py-16">
          <Container className="flex max-w-2xl flex-col items-center gap-3 text-center">
            <p className="lead text-[var(--fg)]/85">
              A record kept is a brotherhood remembered.
            </p>
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--fg)]/60">
              Not invited yet? Claim your record and a board member will check you against the
              roster.
            </p>
            <Link href="/portal/claim" className={cn(buttonVariants({ variant: "outline" }), "mt-6")}>
              Claim your record
            </Link>
          </Container>
        </section>
      ) : null}
    </>
  );
}
