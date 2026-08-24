"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/site/form-success";
import { submitRsvp, type FormState } from "@/app/actions/submit-form";
import { anniversary } from "@/lib/content";

const INITIAL_FORM_STATE: FormState = { status: "idle", delivered: false };

const ATTENDING = [
  { value: "yes", label: "Yes — count me in" },
  { value: "maybe", label: "Likely, but not certain yet" },
  { value: "cannot", label: "I can't attend, but keep me informed" },
];

/* The commercial heart of the form. Someone who ticks "sponsorship" in
   September is a warm call in October, while corporate budgets are still
   open — by December that conversation has already missed the cycle. */
const INTERESTS = [
  { value: "awards", label: "Nominating a brod for an award" },
  { value: "sponsorship", label: "Sponsoring, or opening a door to a sponsor" },
  { value: "souvenir-ad", label: "Placing an ad in the souvenir programme" },
  { value: "merch", label: "Anniversary merchandise" },
  { value: "volunteer", label: "Volunteering on a committee" },
  { value: "batch-reunion", label: "Organising my batch's reunion" },
];

const inputClass =
  "w-full border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--frat-cream)] outline-none transition-colors placeholder:text-[var(--frat-cream)]/60 focus:border-[var(--frat-gold)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--ink)]";

export function RsvpForm() {
  const [state, formAction, pending] = useActionState(submitRsvp, INITIAL_FORM_STATE);

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Noted, Brod. See you in February."
        body={
          state.delivered || state.stored
            ? `You're on the list for the ${anniversary.ordinal} Anniversary. Nothing is owed yet — when the programme, the venue details, and the ticket rates are settled, you'll be among the first told.`
            : "We couldn't reach the archive just now — please also message the fraternity on Facebook so your name isn't lost."
        }
      />
    );
  }

  return (
    <Card className="p-8">
      <form className="space-y-5" action={formAction}>
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
            <label htmlFor="rsvp-name" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Name
            </label>
            <input id="rsvp-name" name="name" required maxLength={120} placeholder="Juan dela Cruz" defaultValue={state.values?.name} className={inputClass} />
          </div>
          <div>
            <label htmlFor="rsvp-batch" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Batch <span className="font-normal text-muted-foreground">(e.g. &rsquo;84-F)</span>
            </label>
            <input id="rsvp-batch" name="batch" maxLength={40} placeholder="&rsquo;84-F" defaultValue={state.values?.batch} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="rsvp-email" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Email
          </label>
          <input
            id="rsvp-email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            defaultValue={state.values?.email}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="rsvp-attending" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Are you coming?
            </label>
            <select
              id="rsvp-attending"
              name="attending"
              className={inputClass}
              defaultValue={state.values?.attending ?? ATTENDING[0].value}
            >
              {ATTENDING.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="rsvp-guests" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Guests expected <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="rsvp-guests"
              name="guests"
              inputMode="numeric"
              maxLength={40}
              placeholder="e.g. 2 — spouse and son"
              defaultValue={state.values?.guests}
              className={inputClass}
            />
          </div>
        </div>

        <fieldset>
          <legend className="mb-1 text-sm font-medium text-[var(--frat-cream)]/80">
            I&rsquo;d like to hear more about{" "}
            <span className="font-normal text-muted-foreground">(optional — tick any)</span>
          </legend>
          <p className="mb-3 text-[13px] leading-relaxed text-[var(--frat-cream)]/50">
            Ticking a box commits you to nothing. It tells the committee whom to talk to first.
          </p>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {INTERESTS.map((interest) => (
              <label
                key={interest.value}
                htmlFor={`rsvp-interest-${interest.value}`}
                className="flex items-start gap-3 border border-[var(--hairline)] px-4 py-3 text-[13px] leading-relaxed text-[var(--frat-cream)]/75 transition-colors hover:border-[var(--frat-gold)]/40 hover:text-[var(--frat-cream)]"
              >
                <input
                  id={`rsvp-interest-${interest.value}`}
                  name="interests"
                  value={interest.value}
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--frat-gold)]"
                />
                <span>{interest.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <label htmlFor="rsvp-message" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Message <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="rsvp-message"
            name="message"
            rows={3}
            maxLength={2000}
            placeholder="A brod the committee should reach, a batch you can rally, anything worth knowing"
            defaultValue={state.values?.message}
            className={inputClass}
          />
        </div>

        {/* PRIVACY.md rule 3, private by default: an RSVP is not consent to
            be mailed. Unchecked, this row is a headcount and nothing more. */}
        <label htmlFor="rsvp-consent-updates" className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--frat-cream)]/70">
          <input
            id="rsvp-consent-updates"
            name="consent_updates"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--frat-gold)]"
          />
          <span>
            Email me updates about the {anniversary.ordinal} Anniversary — the programme, the date,
            and when tickets open. Leave unchecked and we&rsquo;ll only record your headcount.
          </span>
        </label>

        {state.status === "error" ? (
          <p role="alert" className="text-sm text-red-400">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" variant="accent" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Put Me on the List"}
        </Button>
      </form>
    </Card>
  );
}
