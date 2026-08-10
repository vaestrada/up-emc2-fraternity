"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getBrowserSupabase, SUPABASE_AUTH_CONFIGURED } from "@/lib/supabase/client";

const inputClass =
  "w-full border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--frat-cream)] outline-none transition-colors placeholder:text-[var(--frat-cream)]/60 focus:border-[var(--frat-gold)] focus:ring-2 focus:ring-[var(--frat-gold)]/30";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  if (!SUPABASE_AUTH_CONFIGURED) {
    return (
      <Card className="p-8 text-center">
        <p className="text-sm text-[var(--frat-cream)]/70">
          The member portal isn&rsquo;t configured on this deployment yet — Supabase&rsquo;s public URL
          and anon key need to be set. Reach the Alumni Association through{" "}
          <a href="/contact" className="text-[var(--frat-gold-light)] underline underline-offset-4">
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
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });

    if (error) {
      setStatus("error");
      setErrorMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <Card role="status" aria-live="polite" className="flex flex-col items-center p-12 text-center">
        <p className="font-display text-2xl text-[var(--frat-gold-light)]">Check your inbox</p>
        <p className="mt-3 max-w-sm text-sm text-[var(--frat-cream)]/70">
          A sign-in link is on its way to <strong className="text-[var(--frat-cream)]">{email}</strong>.
          Open it on this device to enter the Portal — no password to remember.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="portal-email" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
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
          <p className="mt-2 text-xs text-[var(--frat-cream)]/50">
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
