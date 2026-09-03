import Image from "next/image";
import type { Brod } from "@/lib/content";

/* A citation: the photograph in colour, then name, honour, and the citation
   itself. No filter on the portrait; a real face is the whole point. */
export function BrodCard({ brod }: { brod: Brod; index?: number }) {
  return (
    <article>
      <div className="relative aspect-[4/5] overflow-hidden border border-[var(--hairline)] bg-[var(--ink)]">
        <Image
          src={brod.image}
          alt={`${brod.name}, ${brod.honor}`}
          fill
          className="object-cover object-top"
          sizes="(min-width: 768px) 45vw, 100vw"
        />
        {brod.synthetic ? (
          <span className="absolute top-3 right-3 border border-[var(--frat-cream)]/20 bg-[var(--ink)]/85 px-2 py-1 text-[11px] tracking-[0.08em] text-[var(--frat-cream)]/70 uppercase">
            Placeholder, AI-generated
          </span>
        ) : null}
      </div>
      <p className="caption mt-5">Batch {brod.batch}</p>
      <h3 className="mt-2 font-serif text-2xl font-semibold leading-snug text-[var(--frat-cream)]">{brod.name}</h3>
      <p className="mt-1 text-[15px] text-[var(--frat-gold-light)]">{brod.honor}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--frat-cream)]/70">{brod.detail}</p>
    </article>
  );
}
