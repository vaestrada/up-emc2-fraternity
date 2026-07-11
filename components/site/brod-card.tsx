import Image from "next/image";
import type { Brod } from "@/lib/content";

export function BrodCard({ brod, index }: { brod: Brod; index: number }) {
  return (
    <div className="group">
      <div className="relative aspect-square overflow-hidden border border-[var(--hairline)]">
        <Image
          src={brod.image}
          alt={`${brod.name} — ${brod.honor}`}
          fill
          className="duotone object-cover object-top"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
      </div>
      <p className="mt-5 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold)] uppercase">
        Citation № {String(index + 1).padStart(3, "0")} — Batch {brod.batch}
      </p>
      <h3 className="mt-3 font-display text-2xl text-[var(--frat-cream)]">{brod.name}</h3>
      <p className="mt-1 font-serif text-lg italic text-[var(--frat-gold-light)]">{brod.honor}</p>
      <p className="mt-2 text-sm leading-relaxed text-[var(--frat-cream)]/70">{brod.detail}</p>
    </div>
  );
}
