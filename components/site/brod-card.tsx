import Image from "next/image";
import type { Brod } from "@/lib/content";

/* A citation, in the reference's portrait-grid manner: a rounded photograph,
   a small kicker with the batch, the name set bold, the honour beneath. */
export function BrodCard({ brod }: { brod: Brod; index?: number }) {
  return (
    <article>
      <div className="relative aspect-[1/1] overflow-hidden rounded-card bg-[var(--tint)]">
        <Image
          src={brod.image}
          alt={`${brod.name}, ${brod.honor}`}
          fill
          className="object-cover object-top"
          sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 100vw"
        />
        {brod.synthetic ? (
          <span className="absolute top-3 right-3 rounded-full bg-[var(--paper)]/90 px-2.5 py-1 text-[11px] font-semibold tracking-wide text-[var(--fg)] uppercase">
            Placeholder
          </span>
        ) : null}
      </div>
      <p className="caption mt-5 uppercase tracking-wide">Batch {brod.batch}</p>
      <h3 className="mt-1 font-sans text-[22px] font-bold leading-tight text-[var(--fg)]">{brod.name}</h3>
      <p className="mt-1 text-[15px] text-[var(--fg-muted)]">{brod.honor}</p>
    </article>
  );
}
