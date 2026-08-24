import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

export type ArchivePlate = {
  src: string;
  alt: string;
  /** Figure number and caption, set as an archival plate label. */
  figure: string;
  caption: string;
};

/* Photographs treated as archival plates — DESIGN principle 4. A numbered
 * figure, a hairline frame, a caption set in the mono face. The image is
 * never bled to the edge or overlaid with text; it is mounted, the way a
 * plate is mounted in a hall of records.
 *
 * Stillness is the default state (principle 1), so there is no autoplay and
 * no ken-burns here: the only motion is the shared Reveal on entry and a
 * restrained lift on hover, matching the brod cards and project ledger.
 */
export function ArchivePlates({ plates }: { plates: ArchivePlate[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plates.map((plate, i) => (
        <Reveal key={plate.src} delay={0.08 * i}>
          <figure className="group">
            <div className="relative aspect-[3/2] overflow-hidden border border-[var(--hairline)] bg-[var(--ink)]">
              <Image
                src={plate.src}
                alt={plate.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover opacity-90 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:opacity-100"
              />
              {/* Gold hairline inset — the plate's mount, not a frame effect */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-2 border border-[var(--frat-gold)]/15 transition-colors duration-700 group-hover:border-[var(--frat-gold)]/35"
              />
            </div>
            <figcaption className="mt-4">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-gold)] uppercase">
                {plate.figure}
              </span>
              <p className="mt-2 text-sm leading-relaxed text-[var(--frat-cream)]/60">
                {plate.caption}
              </p>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
