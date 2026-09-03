"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBrowserSupabase, SUPABASE_AUTH_CONFIGURED } from "@/lib/supabase/client";

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/60 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--frat-gold)]/30";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!SUPABASE_AUTH_CONFIGURED) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-[var(--fg)]/70">
          The member portal isn&rsquo;t configured on this deployment yet — Supabase&rsquo;s public URL
          and anon key need to be set. Reach the Alumni Association through{" "}
          <a href="/contact" className="text-[var(--brand)] underline underline-offset-4">
            Contact
          </a>{" "}
          in the meantime.
        </p>
      </Card>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const supabase = getBrowserSupabase();
    if (!supabase) return;
    setStatus("sending");
    setErrorMessage("");

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        // Only a member who was already invited (board-issued via
        // auth.admin.inviteUserByEmail, i.e. an auth.user already exists) may
        // sign in. A stranger's email yields no user, so Supabase refuses —
        // this is the primary deny control that closes the "any email can get
        // in" exploit. Self-service sign-up is also OFF in the Auth dashboard.
        shouldCreateUser: false,
      },
    });

    if (error) {
      setStatus("error");
      // Supabase's own wording for an uninvited address is "Signups not
      // allowed for otp" — accurate, and meaningless to a brod. Say what it
      // means here; keep the raw message for anything unexpected.
      const uninvited = /signups? not allowed/i.test(error.message);
      setErrorMessage(
        uninvited
          ? "That address isn't on the Alumni Association's invite list yet. If you're a brod, ask the Association through Contact — give your name and batch — and an invite will follow."
          : `${error.message} — if this keeps happening, reach the Alumni Association through Contact.`
      );
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <Card role="status" aria-live="polite" className="flex flex-col items-center p-12 text-center">
        <p className="font-sans text-[22px] font-bold text-[var(--fg)]">Check your inbox</p>
        <p className="mt-3 max-w-sm text-sm text-[var(--fg)]/70">
          A sign-in link is on its way to <strong className="text-[var(--fg)]">{email}</strong>.
          Open it on this device to enter the Portal — no password to remember.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="portal-email" className="mb-1.5 block text-sm font-medium text-[var(--fg)]/80">
            Email
          </label>
          <input
            id="portal-email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <p className="mt-2 text-xs text-[var(--fg)]/50">
            We&rsquo;ll email you a one-time sign-in link. No password to set or lose.
          </p>
        </div>
        {status === "error" ? (
          <p role="alert" className="text-sm text-red-400">
            {errorMessage}
          </p>
        ) : null}
        <Button type="submit" variant="accent" className="w-full" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send Sign-In Link"}
        </Button>
      </form>
    </Card>
  );
}
