"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <p className="font-display text-2xl text-[var(--frat-gold-light)]">Salamat, Brod!</p>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          Your pledge has been noted. The Alumni Association will reach out once official donation
          channels are live. (Note: this form is not yet wired to a backend — submissions are not
          stored yet.)
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-8">
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(true);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pledge-name" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Name
            </label>
            <input id="pledge-name" name="name" required placeholder="Juan dela Cruz" className={inputClass} />
          </div>
          <div>
            <label htmlFor="pledge-batch" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Batch <span className="font-normal text-muted-foreground">(e.g. ’84-F)</span>
            </label>
            <input id="pledge-batch" name="batch" placeholder="’84-F" className={inputClass} />
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
            placeholder="Anything you'd like the Alumni Association to know"
            className={inputClass}
          />
        </div>

        <Button type="submit" variant="accent" className="w-full">
          Send My Pledge
        </Button>
      </form>
    </Card>
  );
}
