"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { submitPledge, type FormState } from "@/app/actions/submit-form";

const INITIAL_FORM_STATE: FormState = { status: "idle", delivered: false };

const CAUSES = [
  "Scholarships",
  "Campus Projects",
  "Community Outreach",
  "Anniversary Fund",
  "Wherever it's needed most",
];

const inputClass =
  "w-full border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--frat-cream)] outline-none transition-colors placeholder:text-[var(--frat-cream)]/30 focus:border-[var(--frat-gold)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--ink)]";

export function PledgeForm() {
  const [state, formAction, pending] = useActionState(submitPledge, INITIAL_FORM_STATE);

  if (state.status === "success") {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <p className="font-display text-2xl text-[var(--frat-gold-light)]">Salamat, Brod!</p>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          {state.delivered
            ? "Your pledge has been sent to the Alumni Association. They'll reach out once official donation channels are live."
            : "Your pledge was noted, but e-mail delivery isn't live yet — please also message the fraternity on Facebook so the Alumni Association sees it."}
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <form className="space-y-4" action={formAction}>
        {/* honeypot — hidden from humans, catnip for bots */}
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="hidden"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pledge-name" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Name
            </label>
            <input id="pledge-name" name="name" required maxLength={120} placeholder="Juan dela Cruz" className={inputClass} />
          </div>
          <div>
            <label htmlFor="pledge-batch" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Batch <span className="font-normal text-muted-foreground">(e.g. ’84-F)</span>
            </label>
            <input id="pledge-batch" name="batch" maxLength={40} placeholder="’84-F" className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="pledge-email" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Email
          </label>
          <input
            id="pledge-email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="pledge-cause" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            I want to support
          </label>
          <select id="pledge-cause" name="cause" className={inputClass} defaultValue={CAUSES[0]}>
            {CAUSES.map((cause) => (
              <option key={cause} value={cause}>
                {cause}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="pledge-message" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Message <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="pledge-message"
            name="message"
            rows={3}
            maxLength={5000}
            placeholder="Anything you'd like the Alumni Association to know"
            className={inputClass}
          />
        </div>

        {state.status === "error" ? (
          <p role="alert" className="text-sm text-red-400">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" variant="accent" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send My Pledge"}
        </Button>
      </form>
    </Card>
  );
}
