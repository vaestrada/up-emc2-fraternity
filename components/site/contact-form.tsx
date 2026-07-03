"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TOPICS = [
  "General inquiry",
  "Update my member record",
  "Nominate a prominent brod",
  "Share project photos or history",
  "Partnership / LGU / sponsorship",
  "Donations",
];

const inputClass =
  "w-full border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--frat-cream)] outline-none transition-colors placeholder:text-[var(--frat-cream)]/30 focus:border-[var(--frat-gold)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--ink)]";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <Card className="flex flex-col items-center justify-center p-12 text-center">
        <p className="font-display text-2xl text-[var(--frat-gold-light)]">Message noted!</p>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          (This form is not yet wired to a backend — for now, please also message the fraternity
          on Facebook so it definitely reaches us.)
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
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Name
            </label>
            <input id="contact-name" name="name" required placeholder="Juan dela Cruz" className={inputClass} />
          </div>
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Topic
          </label>
          <select id="contact-topic" name="topic" className={inputClass} defaultValue={TOPICS[0]}>
            {TOPICS.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={5}
            required
            placeholder="How can the brotherhood help?"
            className={inputClass}
          />
        </div>

        <Button type="submit" className="w-full">
          Send Message
        </Button>
      </form>
    </Card>
  );
}
