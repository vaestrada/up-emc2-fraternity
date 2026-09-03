"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/site/form-success";
import { submitDues, type FormState } from "@/app/actions/submit-form";

const INITIAL_FORM_STATE: FormState = { status: "idle", delivered: false };

const METHODS = ["GCash", "Maya", "Bank transfer (InstaPay)", "Cash", "Other"];

function currentPeriodOptions(): string[] {
  const now = new Date();
  const startYear = now.getMonth() >= 5 ? now.getFullYear() : now.getFullYear() - 1; // AY starts ~June
  return [0, 1, 2].map((offset) => {
    const y = startYear - offset;
    return `AY ${y}-${y + 1}`;
  });
}

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/60 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--frat-gold)]/30 [&>option]:bg-[var(--tint)]";
const labelClass = "mb-1.5 block text-sm font-medium text-[var(--fg)]/80";

export function DuesForm({
  memberId,
  defaultName,
  defaultBatch,
  defaultEmail,
}: {
  memberId: string;
  defaultName?: string;
  defaultBatch?: string;
  defaultEmail?: string;
}) {
  const [state, formAction, pending] = useActionState(submitDues, INITIAL_FORM_STATE);
  const periods = currentPeriodOptions();

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Recorded, Brod"
        body={
          state.delivered
            ? "Your dues record is with the Alumni Association. Once your transfer is matched to its reference number, you'll receive a formal acknowledgment."
            : state.stored
            ? "Your dues record has been saved. Once your transfer is matched to its reference number, the Alumni Association will acknowledge it."
            : "We couldn't reach the archive just now — please also message the fraternity on Facebook so this isn't lost."
        }
      />
    );
  }

  return (
    <Card className="p-8">
      <form className="space-y-4" action={formAction}>
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
        <input type="hidden" name="member_id" value={memberId} />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dues-name" className={labelClass}>
              Name
            </label>
            <input
              id="dues-name"
              name="name"
              required
              maxLength={120}
              defaultValue={state.values?.name ?? defaultName}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="dues-batch" className={labelClass}>
              Batch
            </label>
            <input
              id="dues-batch"
              name="batch"
              maxLength={40}
              defaultValue={state.values?.batch ?? defaultBatch}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="dues-email" className={labelClass}>
            Email
          </label>
          <input
            id="dues-email"
            name="email"
            type="email"
            required
            maxLength={254}
            defaultValue={state.values?.email ?? defaultEmail}
            className={inputClass}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dues-period" className={labelClass}>
              Membership period
            </label>
            <select id="dues-period" name="period" required className={inputClass} defaultValue={state.values?.period ?? periods[0]}>
              {periods.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="dues-method" className={labelClass}>
              Payment method
            </label>
            <select id="dues-method" name="method" className={inputClass} defaultValue={state.values?.method ?? METHODS[0]}>
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="dues-amount" className={labelClass}>
              Amount <span className="font-normal text-[var(--fg)]/50">(₱, optional)</span>
            </label>
            <input
              id="dues-amount"
              name="amount"
              inputMode="numeric"
              maxLength={20}
              defaultValue={state.values?.amount}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="dues-reference" className={labelClass}>
              Transfer reference no. <span className="font-normal text-[var(--fg)]/50">(optional)</span>
            </label>
            <input
              id="dues-reference"
              name="reference"
              maxLength={64}
              placeholder="from your GCash / bank confirmation"
              defaultValue={state.values?.reference}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="dues-message" className={labelClass}>
            Message <span className="font-normal text-[var(--fg)]/50">(optional)</span>
          </label>
          <textarea
            id="dues-message"
            name="message"
            rows={2}
            maxLength={2000}
            defaultValue={state.values?.message}
            className={inputClass}
          />
        </div>

        {state.status === "error" ? (
          <p role="alert" className="text-sm text-red-400">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" variant="accent" className="w-full" disabled={pending}>
          {pending ? "Sending…" : "Record My Dues Payment"}
        </Button>
      </form>
    </Card>
  );
}
