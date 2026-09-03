import Image from "next/image";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

/* Every inner page opens the same way: a label, the title in the lockup's
   capitals, a lead line, and optionally a photograph beside them. Entrance
   is CSS (see .hero-reveal) so the title paints on the first frame. */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as React.CSSProperties;

export function PageHero({
  eyebrow,
  title,
  description,
  image,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  /** A real photograph. Renders a split hero: text left, plate right. */
  image?: { src: string; alt: string; caption?: string };
}) {
  return (
    <section className="border-b border-[var(--hairline)] pt-36 pb-16 md:pt-44 md:pb-20">
      <Container className={cn(image && "grid items-end gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16")}>
        <div>
          <p className="hero-reveal label" style={delay(0)}>
            {eyebrow}
          </p>
          <h1
            className="hero-reveal mt-6 max-w-3xl font-display text-[clamp(2.4rem,5.2vw,4.25rem)] leading-[1.06] text-[var(--frat-cream)]"
            style={delay(0.08)}
          >
            {title}
          </h1>
          {description ? (
            <p className="hero-reveal lead mt-7 max-w-xl" style={delay(0.16)}>
              {description}
            </p>
          ) : null}
        </div>
        {image ? (
          <figure className="hero-reveal" style={delay(0.2)}>
            <div className="relative aspect-[4/3] overflow-hidden border border-[var(--hairline)] bg-[var(--ink)]">
              <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
            {image.caption ? <figcaption className="caption mt-3">{image.caption}</figcaption> : null}
          </figure>
        ) : null}
      </Container>
    </section>
  );
}
