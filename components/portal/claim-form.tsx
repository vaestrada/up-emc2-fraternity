"use client";

import { useActionState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FormSuccess } from "@/components/site/form-success";
import { submitClaim, type FormState } from "@/app/actions/submit-form";

const INITIAL_FORM_STATE: FormState = { status: "idle", delivered: false };

const inputClass =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/60 focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--frat-gold)]/30";

const labelClass = "mb-1.5 block text-[14px] font-medium text-[var(--fg)]/80";
const optional = <span className="font-normal text-[var(--fg)]/45">(optional)</span>;

/* The claim form. Nothing here verifies anyone: the roster lives offline, so
   what this collects is what lets a board member find the brod *in* that
   roster quickly. Batch first, because that is the column they sort by;
   nickname because half the roster is listed by one; and a brod who can
   vouch, because that is how the fraternity has always verified people. */
export function ClaimForm() {
  const [state, formAction, pending] = useActionState(submitClaim, INITIAL_FORM_STATE);

  if (state.status === "success") {
    return (
      <FormSuccess
        title="Your claim is with the board."
        body={
          state.stored
            ? "A board member will check your details against the roster and send your invitation by email. If anything doesn't match, they'll write to you rather than simply refuse. This is a person reading, not a system checking, so give it a few days."
            : "We couldn't reach the register just now — please also message the fraternity on Facebook so your claim isn't lost."
        }
      />
    );
  }

  return (
    <Card className="rounded-card p-8">
      <form className="space-y-5" action={formAction}>
        {/* honeypot — hidden from humans, catnip for bots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="claim-name" className={labelClass}>
              Full name
            </label>
            <input
              id="claim-name"
              name="name"
              required
              maxLength={120}
              autoComplete="name"
              defaultValue={state.values?.name}
              placeholder="As the roster would list you"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="claim-batch" className={labelClass}>
              Batch
            </label>
            <input
              id="claim-batch"
              name="batch"
              required
              maxLength={40}
              defaultValue={state.values?.batch}
              placeholder="e.g. ’84-F"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="claim-email" className={labelClass}>
            Email
          </label>
          <input
            id="claim-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            defaultValue={state.values?.email}
            placeholder="you@example.com"
            className={inputClass}
          />
          <p className="mt-1.5 text-[13px] text-[var(--fg)]/55">
            Your invitation and every sign-in link go here. Use the address you actually read.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="claim-nickname" className={labelClass}>
              Nickname {optional}
            </label>
            <input
              id="claim-nickname"
              name="nickname"
              maxLength={80}
              defaultValue={state.values?.nickname}
              placeholder="What the brods call you"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="claim-vouch" className={labelClass}>
              A brod who can vouch for you {optional}
            </label>
            <input
              id="claim-vouch"
              name="vouch"
              maxLength={160}
              defaultValue={state.values?.vouch}
              placeholder="Name and batch, if you know it"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label htmlFor="claim-note" className={labelClass}>
            Anything else {optional}
          </label>
          <textarea
            id="claim-note"
            name="note"
            rows={3}
            maxLength={2000}
            defaultValue={state.values?.note}
            placeholder="If your name on the roster differs from the one you use now, say so here."
            className={inputClass}
          />
        </div>

        {state.status === "error" && state.message ? (
          <p role="alert" className="text-[14px] text-[#8c2f18]">
            {state.message}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Sending…" : "Claim my record"}
        </Button>

        <p className="text-[13px] leading-relaxed text-[var(--fg)]/55">
          What you send here goes only to the Alumni Association, and is handled under the
          Philippine Data Privacy Act of 2012. Once your claim is decided, your email address is
          removed from the claim itself and only an encrypted fingerprint remains.
        </p>
      </form>
    </Card>
  );
}
