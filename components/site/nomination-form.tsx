"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/site/form-success";
import { submitNomination, type FormState } from "@/app/actions/submit-form";
import { awardCategories } from "@/lib/content";

const INITIAL: FormState = { status: "idle", delivered: false };

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/60 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--tint)]";
const labelClass = "mb-1.5 block text-[14px] font-medium text-[var(--fg)]/80";
const optional = <span className="font-normal text-[var(--fg)]/45">(optional)</span>;

/* Two people on one form, kept visibly apart: the brod being nominated and
   the brod doing the nominating. PLAN §6 — the nominee need not be the
   nominator, and in practice almost never is. */
export function NominationForm({ defaultCategory }: { defaultCategory?: string }) {
  const [state, formAction, pending] = useActionState(submitNomination, INITIAL);

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Nomination received."
        body="The screening committee reads every nomination against the published criteria before anything reaches the judges. You will hear when the shortlist is set. Winners are announced at the anniversary itself, not before."
      />
    );
  }

  return (
    <Card className="rounded-card p-8">
      <form className="space-y-6" action={formAction}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <fieldset className="space-y-5">
          <legend className="label label--plain mb-4">The nominee</legend>

          <div>
            <label htmlFor="n-category" className={labelClass}>Category</label>
            <select
              id="n-category"
              name="category"
              required
              defaultValue={state.values?.category ?? defaultCategory ?? awardCategories[0].title}
              className={inputClass}
            >
              {awardCategories.map((c) => (
                <option key={c.slug} value={c.title}>{c.title}</option>
              ))}
            </select>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="n-name" className={labelClass}>Nominee&rsquo;s full name</label>
              <input id="n-name" name="nominee_name" required maxLength={160} defaultValue={state.values?.nominee_name} className={inputClass} />
            </div>
            <div>
              <label htmlFor="n-batch" className={labelClass}>Nominee&rsquo;s batch {optional}</label>
              <input id="n-batch" name="nominee_batch" maxLength={40} defaultValue={state.values?.nominee_batch} placeholder="e.g. ’84-F" className={inputClass} />
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="n-email" className={labelClass}>Nominee&rsquo;s email {optional}</label>
              <input id="n-email" name="nominee_email" type="email" maxLength={254} defaultValue={state.values?.nominee_email} className={inputClass} />
            </div>
            <div>
              <label htmlFor="n-known" className={labelClass}>Where they are now {optional}</label>
              <input id="n-known" name="nominee_known" maxLength={200} defaultValue={state.values?.nominee_known} placeholder="Role and organisation, in a line" className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="n-citation" className={labelClass}>The case for them</label>
            <textarea
              id="n-citation"
              name="citation"
              required
              rows={7}
              maxLength={8000}
              defaultValue={state.values?.citation}
              placeholder="What they did, why it meets the criteria, and what the brotherhood should know. This is what the judges read."
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="n-evidence" className={labelClass}>Evidence and links {optional}</label>
            <textarea
              id="n-evidence"
              name="evidence"
              rows={3}
              maxLength={1000}
              defaultValue={state.values?.evidence}
              placeholder="Citations, awards, publications, news, a company page — anything the committee can verify."
              className={inputClass}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-5 border-t border-[var(--hairline)] pt-6">
          <legend className="label label--plain mb-4">You, the nominator</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="n-your-name" className={labelClass}>Your name</label>
              <input id="n-your-name" name="name" required maxLength={120} autoComplete="name" defaultValue={state.values?.name} className={inputClass} />
            </div>
            <div>
              <label htmlFor="n-your-batch" className={labelClass}>Your batch {optional}</label>
              <input id="n-your-batch" name="batch" maxLength={40} defaultValue={state.values?.batch} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="n-your-email" className={labelClass}>Your email</label>
            <input id="n-your-email" name="email" type="email" required maxLength={254} autoComplete="email" defaultValue={state.values?.email} className={inputClass} />
          </div>
        </fieldset>

        <label className="flex items-start gap-3 text-[14px] leading-relaxed text-[var(--fg)]/70">
          <input type="checkbox" name="consent" required className="mt-1 h-4 w-4 accent-[var(--brand)]" />
          <span>
            I confirm the nominee knows they are being nominated, or — for a posthumous honour —
            that the family knows and consents.
          </span>
        </label>

        {state.status === "error" && state.message ? (
          <p role="alert" className="text-[14px] text-[#8c2f18]">{state.message}</p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Sending…" : "Submit nomination"}
        </Button>

        <p className="text-[13px] leading-relaxed text-[var(--fg)]/55">
          Nominations go to the screening committee. No fee is charged to nominate, and no
          payment of any kind is visible to the judges.
        </p>
      </form>
    </Card>
  );
}
