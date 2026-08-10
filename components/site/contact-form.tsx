"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/site/form-success";
import { submitContact, type FormState } from "@/app/actions/submit-form";

const INITIAL_FORM_STATE: FormState = { status: "idle", delivered: false };

const TOPICS = [
  "General inquiry",
  "Update my member record",
  "Nominate a prominent brod",
  "Share project photos or history",
  "Partnership / LGU / sponsorship",
  "Donations",
];

const inputClass =
  "w-full border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--frat-cream)] outline-none transition-colors placeholder:text-[var(--frat-cream)]/60 focus:border-[var(--frat-gold)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--ink)]";

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContact, INITIAL_FORM_STATE);

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Entered into the record."
        body={
          state.delivered
            ? "Your message is on its way to the Alumni Association. Expect a reply at the email you provided."
            : state.stored
            ? "Your message has been recorded and the Alumni Association will see it. Expect a reply at the email you provided."
            : "We couldn't reach the archive just now — please also send this to the fraternity's Facebook page so it isn't lost."
        }
      />
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
            <label htmlFor="contact-name" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Name
            </label>
            <input id="contact-name" name="name" required maxLength={120} placeholder="Juan dela Cruz" defaultValue={state.values?.name} className={inputClass} />
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
              maxLength={254}
              placeholder="you@example.com"
              defaultValue={state.values?.email}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="contact-topic" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Topic
          </label>
          <select id="contact-topic" name="topic" className={inputClass} defaultValue={state.values?.topic ?? TOPICS[0]}>
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
            maxLength={5000}
            placeholder="How can the brotherhood help?"
            defaultValue={state.values?.message}
            className={inputClass}
          />
        </div>

        {state.status === "error" ? (
          <p role="alert" className="text-sm text-red-400">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Send Message"}
        </Button>
      </form>
    </Card>
  );
}
