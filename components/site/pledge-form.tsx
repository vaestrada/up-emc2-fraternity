"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/site/form-success";
import { submitPledge, type FormState } from "@/app/actions/submit-form";

const INITIAL_FORM_STATE: FormState = { status: "idle", delivered: false };

const CAUSES = [
  "Campus Projects",
  "Community Outreach",
  "Scholarship Fund (being established)",
  "Anniversary Fund",
  "Wherever it's needed most",
];

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/60 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--tint)]";

export function PledgeForm() {
  const [state, formAction, pending] = useActionState(submitPledge, INITIAL_FORM_STATE);

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Salamat, Brod!"
        body={
          state.delivered
            ? "Your pledge is with the Alumni Association. Once your transfer is matched to its reference number, you'll receive a formal acknowledgment at the email you provided."
            : state.stored
            ? "Your pledge has been recorded. Once your transfer is matched to its reference number, the Alumni Association will send a formal acknowledgment to the email you provided."
            : "We couldn't reach the archive just now — please also send this to the fraternity's Facebook page so your pledge isn't lost."
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
            <label htmlFor="pledge-name" className="mb-1.5 block text-sm font-medium text-[var(--fg)]/80">
              Name
            </label>
            <input id="pledge-name" name="name" required maxLength={120} placeholder="Juan dela Cruz" defaultValue={state.values?.name} className={inputClass} />
          </div>
          <div>
            <label htmlFor="pledge-batch" className="mb-1.5 block text-sm font-medium text-[var(--fg)]/80">
              Batch <span className="font-normal text-muted-foreground">(e.g. ’84-F)</span>
            </label>
            <input id="pledge-batch" name="batch" maxLength={40} placeholder="’84-F" defaultValue={state.values?.batch} className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="pledge-email" className="mb-1.5 block text-sm font-medium text-[var(--fg)]/80">
            Email
          </label>
          <input
            id="pledge-email"
            name="email"
            type="email"
            required
            maxLength={254}
            placeholder="you@example.com"
            defaultValue={state.values?.email}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="pledge-cause" className="mb-1.5 block text-sm font-medium text-[var(--fg)]/80">
            I want to support
          </label>
          <select id="pledge-cause" name="cause" className={inputClass} defaultValue={state.values?.cause ?? CAUSES[0]}>
            {CAUSES.map((cause) => (
              <option key={cause} value={cause}>
                {cause}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="pledge-amount" className="mb-1.5 block text-sm font-medium text-[var(--fg)]/80">
              Amount <span className="font-normal text-muted-foreground">(₱, optional)</span>
            </label>
            <input
              id="pledge-amount"
              name="amount"
              inputMode="numeric"
              maxLength={20}
              placeholder="5,000"
              defaultValue={state.values?.amount}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="pledge-reference" className="mb-1.5 block text-sm font-medium text-[var(--fg)]/80">
              Transfer reference no. <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="pledge-reference"
              name="reference"
              maxLength={64}
              placeholder="from your GCash / bank confirmation"
              defaultValue={state.values?.reference}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="pledge-message" className="mb-1.5 block text-sm font-medium text-[var(--fg)]/80">
            Message <span className="font-normal text-muted-foreground">(optional)</span>
          </label>
          <textarea
            id="pledge-message"
            name="message"
            rows={3}
            maxLength={5000}
            placeholder="Anything you'd like the Alumni Association to know"
            defaultValue={state.values?.message}
            className={inputClass}
          />
        </div>

        <label htmlFor="pledge-consent-public" className="flex items-start gap-3 text-[13px] leading-relaxed text-[var(--fg)]/70">
          <input
            id="pledge-consent-public"
            name="consent_public"
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--frat-gold)]"
          />
          <span>
            You may list my <strong className="text-[var(--fg)]">name</strong> (never the amount) in the
            fraternity&rsquo;s public Roll of Patrons. Leave unchecked to give privately.
          </span>
        </label>

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
