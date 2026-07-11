"use client";

import { useState } from "react";
import { association } from "@/lib/content";

const gateInput =
  "w-full border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--frat-cream)] outline-none transition-colors placeholder:text-[var(--frat-cream)]/60 focus:border-[var(--frat-gold)] focus:ring-2 focus:ring-[var(--frat-gold)]/30";

/* A soft frame, not authentication. Give Back is meant for brods, alumni, and
   friends of the fraternity, so the giving details sit behind one light,
   intentional step. Name/batch are optional and never leave the browser —
   they only personalize the revealed panel. */
export function GivingGate({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");

  if (revealed) {
    return (
      <div>
        {(name || batch) && (
          <p className="mb-8 font-mono text-[11px] tracking-[0.25em] text-[var(--frat-gold-light)] uppercase">
            Giving as {name.trim() || "a friend of the fraternity"}
            {batch.trim() ? ` · ${batch.trim()}` : ""}
          </p>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl border border-dashed border-[var(--frat-gold)]/40 bg-[var(--frat-gold)]/5 p-8 text-center sm:p-10">
      <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
        For the Brotherhood
      </p>
      <h2 className="mt-5 font-display text-2xl leading-snug text-[var(--frat-cream)] md:text-3xl">
        Give Back is for brods, alumni, and friends of the fraternity.
      </h2>
      <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[var(--frat-cream)]/70">
        Contributions are received and formally acknowledged by the {association.legalName}.
        Tell us who you are so we can thank you properly, then view how to give.
      </p>
      <form
        className="mt-8 space-y-4 text-left"
        onSubmit={(e) => {
          e.preventDefault();
          setRevealed(true);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="gate-name" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Name <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="gate-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={120}
              placeholder="Juan dela Cruz"
              className={gateInput}
            />
          </div>
          <div>
            <label htmlFor="gate-batch" className="mb-1.5 block text-sm font-medium text-[var(--frat-cream)]/80">
              Batch <span className="font-normal text-muted-foreground">(optional)</span>
            </label>
            <input
              id="gate-batch"
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              maxLength={40}
              placeholder="’84-F"
              className={gateInput}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-[var(--frat-gold)] px-6 py-3 text-center font-mono text-xs font-semibold tracking-[0.25em] text-[#1a1305] uppercase transition-colors hover:bg-[var(--frat-gold-light)]"
        >
          View giving details
        </button>
      </form>
      <p className="mt-5 text-[11px] leading-relaxed text-[var(--frat-cream)]/60">
        Your name and batch stay on this device — nothing is submitted at this step.
      </p>
    </div>
  );
}
