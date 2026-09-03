import { Container } from "@/components/site/container";

/* CSS entrance (see .hero-reveal in globals.css) rather than the framer
   <Reveal>: the page title is each route's Largest Contentful Paint and must
   not wait for hydration. Same easing and stagger as the homepage hero. */
const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as React.CSSProperties;

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
        <p className="hero-reveal font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase" style={delay(0)}>
          {eyebrow}
        </p>
        <h1
          className="hero-reveal-engrave mt-6 max-w-3xl font-display text-[clamp(2.8rem,7vw,5.5rem)] font-semibold leading-[1.02] tracking-tight text-[var(--frat-cream)]"
          style={delay(0.1)}
        >
          {title}
        </h1>
        {description ? (
          <p className="hero-reveal mt-6 max-w-xl leading-relaxed text-[var(--frat-cream)]/60" style={delay(0.2)}>
            {description}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
