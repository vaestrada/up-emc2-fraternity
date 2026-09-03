"use client";

import { useState } from "react";
import { association } from "@/lib/content";

const gateInput =
  "w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-[15px] text-[var(--fg)] outline-none transition-colors placeholder:text-[var(--fg)]/50 focus:border-[var(--brand)]";

/* A soft frame, not authentication. Give Back is meant for brods, alumni, and
   friends of the fraternity, so the giving details sit behind one light,
   intentional step. Name and batch never leave the browser; they only
   personalise the revealed panel. */
export function GivingGate({ children }: { children: React.ReactNode }) {
  const [revealed, setRevealed] = useState(false);
  const [name, setName] = useState("");
  const [batch, setBatch] = useState("");

  if (revealed) {
    return (
      <div>
        {(name || batch) && (
          <p className="caption mb-8">
            Giving as {name.trim() || "a friend of the fraternity"}
            {batch.trim() ? `, ${batch.trim()}` : ""}
          </p>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <p className="label">For the brotherhood</p>
      <h2 className="mt-6 display text-[2rem]">
        Give Back is for brods, alumni, and friends of the fraternity.
      </h2>
      <p className="prose-archive mt-5 text-[15px] leading-relaxed">
        Contributions are received and formally acknowledged by the {association.legalName}. Tell us
        who you are so we can thank you properly, then view how to give.
      </p>
      <form
        className="mt-8 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          setRevealed(true);
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="gate-name" className="mb-1.5 block text-[14px] text-[var(--fg)]/80">
              Name <span className="text-[var(--fg)]/45">(optional)</span>
            </label>
            <input id="gate-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={120} placeholder="Juan dela Cruz" className={gateInput} />
          </div>
          <div>
            <label htmlFor="gate-batch" className="mb-1.5 block text-[14px] text-[var(--fg)]/80">
              Batch <span className="text-[var(--fg)]/45">(optional)</span>
            </label>
            <input id="gate-batch" value={batch} onChange={(e) => setBatch(e.target.value)} maxLength={40} placeholder="’84-F" className={gateInput} />
          </div>
        </div>
        <button
          type="submit"
          className="inline-flex h-12 items-center bg-[var(--frat-gold)] px-7 font-sans text-[12px] font-medium tracking-[0.14em] text-[#1a1305] uppercase transition-colors hover:bg-[var(--frat-gold-light)]"
        >
          View giving details
        </button>
      </form>
      <p className="caption mt-4">Your name and batch stay on this device. Nothing is submitted at this step.</p>
    </div>
  );
}
