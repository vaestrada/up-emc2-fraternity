"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/site/form-success";
import { submitSponsor, type FormState } from "@/app/actions/submit-form";
import { sponsorTiers, souvenirAdRates } from "@/lib/content";

const INITIAL: FormState = { status: "idle", delivered: false };

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/60 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--tint)]";
const labelClass = "mb-1.5 block text-[14px] font-medium text-[var(--fg)]/80";
const optional = <span className="font-normal text-[var(--fg)]/45">(optional)</span>;

export function SponsorForm() {
  const [state, formAction, pending] = useActionState(submitSponsor, INITIAL);

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Thank you — the committee will be in touch."
        body="Someone from the Alumni Association will send the full prospectus and answer anything the page did not. Nothing is committed by this enquiry."
      />
    );
  }

  return (
    <Card className="rounded-card p-8">
      <form className="space-y-5" action={formAction}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div>
          <label htmlFor="s-org" className={labelClass}>Organisation</label>
          <input id="s-org" name="organisation" required maxLength={160} defaultValue={state.values?.organisation} className={inputClass} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="s-name" className={labelClass}>Your name</label>
            <input id="s-name" name="name" required maxLength={120} autoComplete="name" defaultValue={state.values?.name} className={inputClass} />
          </div>
          <div>
            <label htmlFor="s-email" className={labelClass}>Email</label>
            <input id="s-email" name="email" type="email" required maxLength={254} autoComplete="email" defaultValue={state.values?.email} className={inputClass} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="s-phone" className={labelClass}>Mobile {optional}</label>
            <input id="s-phone" name="phone" maxLength={40} defaultValue={state.values?.phone} className={inputClass} />
          </div>
          <div>
            <label htmlFor="s-intro" className={labelClass}>Introduced by {optional}</label>
            <input id="s-intro" name="introduced_by" maxLength={160} defaultValue={state.values?.introduced_by} placeholder="The brod who connected us" className={inputClass} />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="s-interest" className={labelClass}>Interested in</label>
            <select id="s-interest" name="interest" defaultValue={state.values?.interest ?? "sponsorship"} className={inputClass}>
              <option value="sponsorship">A sponsorship package</option>
              <option value="souvenir-ad">A souvenir programme advertisement</option>
              <option value="both">Both</option>
              <option value="other">Something else</option>
            </select>
          </div>
          <div>
            <label htmlFor="s-tier" className={labelClass}>Tier or placement {optional}</label>
            <select id="s-tier" name="tier" defaultValue={state.values?.tier ?? ""} className={inputClass}>
              <option value="">Not sure yet</option>
              <optgroup label="Sponsorship">
                {sponsorTiers.map((t) => (
                  <option key={t.slug} value={t.name}>{t.name}</option>
                ))}
              </optgroup>
              <optgroup label="Souvenir programme">
                {souvenirAdRates.map((a) => (
                  <option key={a.slug} value={a.placement}>{a.placement}</option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="s-amount" className={labelClass}>Indicative amount {optional}</label>
          <input id="s-amount" name="amount_expected" maxLength={20} defaultValue={state.values?.amount_expected} placeholder="₱" className={inputClass} />
          <p className="mt-1.5 text-[13px] text-[var(--fg)]/55">
            A figure here is an indication, not a commitment. Nothing is counted until it is
            signed and paid.
          </p>
        </div>

        <div>
          <label htmlFor="s-message" className={labelClass}>Anything else {optional}</label>
          <textarea id="s-message" name="message" rows={4} maxLength={4000} defaultValue={state.values?.message} className={inputClass} />
        </div>

        {state.status === "error" && state.message ? (
          <p role="alert" className="text-[14px] text-[#8c2f18]">{state.message}</p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Sending…" : "Send enquiry"}
        </Button>
      </form>
    </Card>
  );
}
