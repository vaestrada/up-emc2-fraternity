"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/site/form-success";
import { submitContribution, type FormState } from "@/app/actions/submit-form";
import { association } from "@/lib/content";

const INITIAL_FORM_STATE: FormState = { status: "idle", delivered: false };

const KINDS = [
  "A memory or story",
  "Historical photo(s)",
  "Brod news or a citation",
  "A milestone or correction to the timeline",
  "Project history",
  "Something else",
];

const inputClass =
  "w-full border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--frat-cream)] outline-none transition-colors placeholder:text-[var(--frat-cream)]/60 focus:border-[var(--frat-gold)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--ink)]";

export function ContributeForm() {
  const [state, formAction, pending] = useActionState(submitContribution, INITIAL_FORM_STATE);

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Received for the record."
        body={
          state.delivered
            ? "Thank you — the Alumni Association will review your contribution and reach out at the email you provided. Curated entries are inscribed into the archive."
            : state.stored
            ? "Thank you — your contribution has been recorded for the Alumni Association to review. They'll reach out at the email you provided."
            : "We couldn't reach the archive just now — please send this to the fraternity's Facebook page so it isn't lost."
        }
      />
    );
  }

  return (
    <Card className="p-8">
      <form className="space-y-4" action={formAction}>
        {/* honeypot */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div>
          <label htmlFor="c-kind" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            What are you contributing?
          </label>
          <select id="c-kind" name="kind" className={inputClass} defaultValue={state.values?.kind ?? KINDS[0]}>
            {KINDS.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="c-name" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Name
            </label>
            <input id="c-name" name="name" required maxLength={120} placeholder="Juan dela Cruz" defaultValue={state.values?.name} className={inputClass} />
          </div>
          <div>
            <label htmlFor="c-batch" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Batch <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input id="c-batch" name="batch" maxLength={40} placeholder="’84-F" defaultValue={state.values?.batch} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="c-email" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Email
          </label>
          <input id="c-email" name="email" type="email" required maxLength={254} placeholder="you@example.com" defaultValue={state.values?.email} className={inputClass} />
        </div>

        <div>
          <label htmlFor="c-title" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Title
          </label>
          <input id="c-title" name="title" required maxLength={200} placeholder="e.g. The 1994 Kalye Tunes reunion" defaultValue={state.values?.title} className={inputClass} />
        </div>

        <div>
          <label htmlFor="c-details" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Details
          </label>
          <textarea
            id="c-details"
            name="details"
            required
            rows={5}
            maxLength={8000}
            placeholder="Tell us the story, names, dates, and any context. We'll take care of shaping it for the archive."
            defaultValue={state.values?.details}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="c-photos" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Photos <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input
            id="c-photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            className="w-full text-sm text-[var(--frat-cream)]/70 file:mr-4 file:cursor-pointer file:border-0 file:bg-[var(--frat-gold)] file:px-4 file:py-2 file:font-sans file:text-[11px] file:font-semibold file:uppercase file:tracking-[0.2em] file:text-[#1a1305] hover:file:bg-[var(--frat-gold-light)]"
          />
          <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--frat-cream)]/60">
            Up to 6 images, 10&nbsp;MB each. They stay private until the Association curates them.
          </p>
        </div>

        <div>
          <label htmlFor="c-links" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
            Or link to an album / source <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <input id="c-links" name="links" maxLength={500} placeholder="Google Drive / Facebook album / any link" defaultValue={state.values?.links} className={inputClass} />
        </div>

        <label htmlFor="c-consent" className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--frat-cream)]/70">
          <input
            id="c-consent"
            name="consent"
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-[var(--frat-gold)]"
          />
          <span>
            I confirm this is my own material or that I have the right to share it, and I grant the{" "}
            {association.legalName} permission to edit and publish it in the archive. Details I submit go only to the
            Association (Data Privacy Act of 2012, RA 10173) and are never sold or shared.
          </span>
        </label>

        {state.status === "error" ? (
          <p role="alert" className="text-sm text-red-400">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" variant="accent" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Submit to the Record"}
        </Button>
      </form>
    </Card>
  );
}
