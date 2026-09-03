import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";

export type ArchivePlate = {
  src: string;
  alt: string;
  figure: string;
  caption: string;
};

/* Photographs from the Association's own archive, in colour, with the 24px
   corner and a caption. */
export function ArchivePlates({ plates }: { plates: ArchivePlate[] }) {
  return (
    <div className="grid gap-8 md:grid-cols-3">
      {plates.map((plate, i) => (
        <Reveal key={plate.src} delay={0.06 * i}>
          <figure>
            <div className="relative aspect-[3/2] overflow-hidden rounded-card bg-[var(--tint)]">
              <Image src={plate.src} alt={plate.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
            </div>
            <figcaption className="mt-4">
              <span className="block text-[16px] font-semibold text-[var(--fg)]">{plate.figure}</span>
              <span className="caption mt-1 block">{plate.caption}</span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </div>
  );
}
