"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/site/form-success";
import { submitAssistanceRequest, type AssistanceState } from "@/app/portal/assistance/actions";

const INITIAL: AssistanceState = { status: "idle" };

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/60 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--tint)]";
const labelClass = "mb-1.5 block text-[14px] font-medium text-[var(--fg)]/80";
const optional = <span className="font-normal text-[var(--fg)]/45">(optional)</span>;

const RELATIONS = [
  { value: "self", label: "Myself" },
  { value: "spouse", label: "My spouse" },
  { value: "parent", label: "My parent" },
  { value: "child", label: "My child" },
  { value: "sibling", label: "My sibling" },
  { value: "other", label: "Another brod" },
];

const KINDS = [
  { value: "hospitalisation", label: "Hospitalisation or illness" },
  { value: "accident", label: "Accident" },
  { value: "bereavement", label: "Bereavement" },
  { value: "calamity", label: "Fire, flood, or typhoon" },
  { value: "other", label: "Something else" },
];

const URGENCIES = [
  { value: "immediate", label: "Immediate — days" },
  { value: "weeks", label: "Within a few weeks" },
  { value: "planning", label: "Planning ahead" },
];

export function AssistanceForm({
  defaultName,
  defaultBatch,
  defaultEmail,
}: {
  defaultName?: string;
  defaultBatch?: string;
  defaultEmail?: string;
}) {
  const [state, formAction, pending] = useActionState(submitAssistanceRequest, INITIAL);

  if (state.status === "success") {
    return (
      <FormSuccess
        title="The board has it, Brod."
        body="Your request went to the board and to nobody else. Someone will contact you directly — by phone if you left a number. Nothing about this appears on the site, in the directory, or in any list."
      />
    );
  }

  return (
    <Card className="rounded-card p-8">
      <form className="space-y-5" action={formAction}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="a-name" className={labelClass}>Your name</label>
            <input
              id="a-name"
              name="name"
              required
              maxLength={120}
              defaultValue={state.values?.name ?? defaultName}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="a-batch" className={labelClass}>Batch {optional}</label>
            <input
              id="a-batch"
              name="batch"
              maxLength={40}
              defaultValue={state.values?.batch ?? defaultBatch}
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="a-email" className={labelClass}>Email</label>
            <input
              id="a-email"
              name="email"
              type="email"
              maxLength={254}
              defaultValue={state.values?.email ?? defaultEmail}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="a-phone" className={labelClass}>Mobile {optional}</label>
            <input
              id="a-phone"
              name="phone"
              maxLength={40}
              defaultValue={state.values?.phone}
              placeholder="Fastest way to reach you"
              className={inputClass}
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="a-relation" className={labelClass}>Who is this for</label>
            <select id="a-relation" name="relation" defaultValue={state.values?.relation ?? "self"} className={inputClass}>
              {RELATIONS.map((r) => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="a-kind" className={labelClass}>What has happened</label>
            <select id="a-kind" name="kind" defaultValue={state.values?.kind ?? "hospitalisation"} className={inputClass}>
              {KINDS.map((k) => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="a-summary" className={labelClass}>In your own words</label>
          <textarea
            id="a-summary"
            name="summary"
            required
            rows={6}
            maxLength={5000}
            defaultValue={state.values?.summary}
            placeholder="Tell the board what is happening and what would help. There is no format to get right."
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="a-amount" className={labelClass}>Amount that would help {optional}</label>
            <input
              id="a-amount"
              name="amount_needed"
              maxLength={40}
              defaultValue={state.values?.amount_needed}
              placeholder="A rough figure is fine"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="a-urgency" className={labelClass}>How soon</label>
            <select id="a-urgency" name="urgency" defaultValue={state.values?.urgency ?? "weeks"} className={inputClass}>
              {URGENCIES.map((u) => (
                <option key={u.value} value={u.value}>{u.label}</option>
              ))}
            </select>
          </div>
        </div>

        {state.status === "error" && state.message ? (
          <p role="alert" className="text-[14px] text-[#8c2f18]">{state.message}</p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Sending…" : "Send to the board"}
        </Button>

        <p className="text-[13px] leading-relaxed text-[var(--fg)]/55">
          This goes to the board alone. It is never published, never shown in the directory, and
          never shared with other brods. Handled under the Philippine Data Privacy Act of 2012.
        </p>
      </form>
    </Card>
  );
}
