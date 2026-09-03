import Image from "next/image";
import { Container } from "@/components/site/container";
import { cn } from "@/lib/utils";

/* Every inner page opens the same way: the dash label, the title in the
   lockup's capitals set heavy, a lead line, and optionally a photograph with
   the 24px corner beside them. The pale tint ground marks it as the opening. */
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
  image?: { src: string; alt: string; caption?: string };
}) {
  return (
    <section className="bg-[var(--tint)] pt-36 pb-16 md:pt-44 md:pb-24">
      <Container className={cn(image && "grid items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16")}>
        <div>
          <p className="hero-reveal label" style={delay(0)}>
            {eyebrow}
          </p>
          <h1 className="hero-reveal display mt-6 max-w-3xl text-[clamp(2.6rem,5.6vw,4.75rem)]" style={delay(0.08)}>
            {title}
          </h1>
          {description ? (
            <p className="hero-reveal lead mt-6 max-w-xl" style={delay(0.16)}>
              {description}
            </p>
          ) : null}
        </div>
        {image ? (
          <figure className="hero-reveal" style={delay(0.2)}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-[var(--tint)]">
              <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 768px) 45vw, 100vw" className="object-cover" />
            </div>
            {image.caption ? <figcaption className="caption mt-3">{image.caption}</figcaption> : null}
          </figure>
        ) : null}
      </Container>
    </section>
  );
}
