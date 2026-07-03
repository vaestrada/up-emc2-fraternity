import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";

export function PageHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <section className="blueprint border-b border-[var(--hairline)] pb-20 pt-44">
      <Container>
        <Reveal>
          <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
            {eyebrow}
          </p>
        </Reveal>
        <Reveal delay={0.1}>
          <h1 className="gold-foil mt-6 max-w-3xl font-display text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-tight">
            {title}
          </h1>
        </Reveal>
        {description ? (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl leading-relaxed text-[var(--frat-cream)]/60">
              {description}
            </p>
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
