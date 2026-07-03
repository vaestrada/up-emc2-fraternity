import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { Counter } from "@/components/motion/counter";
import { Marquee } from "@/components/site/marquee";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FOUNDING_YEAR, site, projects, prominentBrods } from "@/lib/content";

const YEARS = new Date().getFullYear() - FOUNDING_YEAR;

const CREDO_LINES = [
  "Equality is our way of life.",
  "Loyalty and Obedience.",
  "Service and Sacrifice.",
  "Courage and Justice.",
];

export default function Home() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="blueprint relative flex min-h-[100svh] flex-col justify-center overflow-hidden">
        {/* certificate frame */}
        <div className="pointer-events-none absolute inset-4 z-20 border border-[var(--frat-gold)]/20 md:inset-7">
          {/* engraved corner ticks */}
          <span className="absolute -top-px -left-px h-7 w-7 border-t-2 border-l-2 border-[var(--frat-gold)]/70" />
          <span className="absolute -top-px -right-px h-7 w-7 border-t-2 border-r-2 border-[var(--frat-gold)]/70" />
          <span className="absolute -bottom-px -left-px h-7 w-7 border-b-2 border-l-2 border-[var(--frat-gold)]/70" />
          <span className="absolute -bottom-px -right-px h-7 w-7 border-b-2 border-r-2 border-[var(--frat-gold)]/70" />
        </div>

        {/* ambient gold-dust loop — screen blend melts its dark base into the canvas */}
        <video
          autoPlay
          muted
          loop
          playsInline
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden h-full w-full object-cover opacity-35 mix-blend-screen md:block"
        >
          <source src="/videos/hero-ambient.mp4" type="video/mp4" />
        </video>

        {/* rotating gear watermark, centered behind the composition */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.05]">
          <Image
            src="/logo/emc2-mark.png"
            alt=""
            width={1100}
            height={1100}
            priority
            className="animate-spin-slow h-[110vmin] w-[110vmin]"
          />
        </div>

        {/* candlelight — a faint gold glow behind the title */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_50%_38%,rgba(195,143,14,0.13),transparent_70%)]" />

        {/* duotone photo, anchored at the base, slow push-in, fading up into the canvas */}
        <div
          className="absolute inset-x-0 bottom-0 h-[50vh] overflow-hidden"
          style={{
            maskImage: "linear-gradient(to top, black 40%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, black 40%, transparent 100%)",
          }}
        >
          <Image
            src="/photos/anniv55-group-gazebo.jpg"
            alt=""
            fill
            priority
            className="duotone animate-kenburns object-cover opacity-50"
          />
        </div>

        <Container className="relative z-10 flex flex-col items-center pt-[clamp(5rem,13vh,8rem)] pb-[clamp(7rem,20vh,12rem)] text-center">
          <Reveal delay={0.1}>
            <p className="font-mono text-[11px] tracking-[0.45em] text-[var(--frat-gold-light)] uppercase">
              Est. {FOUNDING_YEAR} · U.P. College of Engineering
            </p>
          </Reveal>

          {/* The wordmark rendered as live text in the lockup's Trajan-style capitals (Cinzel). */}
          <Reveal delay={0.2}>
            <h1 className="mt-[clamp(1.5rem,4vh,3rem)] inline-block font-display leading-none text-[var(--frat-cream)]">
              <span className="block whitespace-nowrap text-[clamp(2.1rem,min(6.6vw,9vh),5.2rem)] font-semibold">
                EMC&sup2; FRATERNITY
              </span>
              <span
                aria-hidden
                className="mt-[clamp(0.5rem,1.4vh,0.9rem)] block h-[3px] w-full bg-[var(--frat-cream)]"
              />
              <span className="mt-[clamp(0.5rem,1.4vh,0.9rem)] block whitespace-nowrap text-[clamp(1.05rem,min(3.35vw,4.6vh),2.65rem)] font-medium tracking-[0.05em]">
                UNIVERSITY OF THE PHILIPPINES
              </span>
            </h1>
          </Reveal>

          {/* engraved divider */}
          <Reveal delay={0.32} className="mt-[clamp(1.25rem,3vh,2.25rem)] flex items-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-[var(--frat-gold)]/60 md:w-24" />
            <span className="text-[var(--frat-gold)]">✦</span>
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-[var(--frat-gold)]/60 md:w-24" />
          </Reveal>

          <Reveal delay={0.4} className="mt-[clamp(1.25rem,3vh,2rem)] max-w-xl">
            <p className="font-serif text-xl italic text-[var(--frat-cream)]/90 md:text-2xl">
              &ldquo;Equality is our way of life.&rdquo;
            </p>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-[var(--frat-cream)]/55 max-md:hidden">
              An exclusive brotherhood of Engineering and the Physical Sciences —
              {" "}{YEARS} years of scholars, builders, and public servants.
            </p>
          </Reveal>

          <Reveal delay={0.52} className="mt-[clamp(1.5rem,3.5vh,2.75rem)] flex flex-wrap items-center justify-center gap-4">
            <Link href="/history" className={cn(buttonVariants({ variant: "accent", size: "lg" }))}>
              Enter the Archive <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/donate" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Give Back
            </Link>
          </Reveal>
        </Container>

        {/* schematic corner annotations */}
        <div className="pointer-events-none absolute bottom-10 left-10 z-20 hidden font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/35 md:block">
          14.6553° N / 121.0685° E — MELCHOR HALL, 3F LOBBY
        </div>
        <div className="pointer-events-none absolute bottom-10 right-10 z-20 hidden items-center gap-3 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/35 md:flex">
          EST. MCMLXIX <ArrowDown className="h-3 w-3 animate-bounce" />
        </div>
      </section>

      {/* ── Marquee ──────────────────────────────────────────── */}
      <Marquee
        className="bg-[var(--ink)] font-serif text-xl italic text-[var(--frat-cream)]/80"
        items={[
          "Equality",
          "Service",
          "Brotherhood",
          `Est. ${FOUNDING_YEAR}`,
          "U.P. College of Engineering",
          "Loyalty and Obedience",
          "Service and Sacrifice",
          "Courage and Justice",
        ]}
      />

      {/* ── Legacy (stats) ───────────────────────────────────── */}
      <section className="border-b border-[var(--hairline)]">
        <Container className="grid grid-cols-2 md:grid-cols-4">
          {[
            { render: <>{FOUNDING_YEAR}</>, label: "Year Founded" },
            { render: <Counter to={YEARS} />, label: "Years of Brotherhood" },
            { render: <><Counter to={490} />+</>, label: "Brods on Record" },
            { render: <Counter to={8} />, label: "Flagship Projects" },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={cn(
                "border-[var(--hairline)] px-6 py-14 text-center",
                i > 0 && "border-l max-md:[&:nth-child(3)]:border-l-0",
                i >= 2 && "max-md:border-t"
              )}
            >
              <div className="gold-foil font-display text-5xl font-semibold md:text-6xl">
                {stat.render}
              </div>
              <div className="mt-3 font-mono text-[10px] tracking-[0.3em] text-[var(--frat-cream)]/50 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* ── The Credo ────────────────────────────────────────── */}
      <section className="blueprint py-32 md:py-44">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              № 01 — The Credo
            </p>
          </Reveal>
          <div className="mt-12 space-y-2">
            {CREDO_LINES.map((line, i) => (
              <Reveal key={line} delay={i * 0.15}>
                <p
                  className={cn(
                    "font-serif text-[clamp(2.2rem,6vw,5rem)] leading-[1.1] tracking-tight italic",
                    i === 0 ? "gold-foil font-semibold" : "text-[var(--frat-cream)]/85"
                  )}
                >
                  {line}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── The Brotherhood (about) ──────────────────────────── */}
      <section className="border-y border-[var(--hairline)] bg-[var(--ink)] py-28">
        <Container className="grid gap-16 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                № 02 — The Brotherhood
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-6 font-display text-3xl leading-tight text-[var(--frat-cream)] md:text-5xl">
                Founded by ten scholars.
                <br />
                <span className="text-[var(--frat-cream)]/60">Built by six hundred more.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 max-w-xl leading-relaxed text-[var(--frat-cream)]/60">
                {site.about}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 font-mono text-xs tracking-[0.2em] text-[var(--frat-gold-light)]/80 uppercase">
                Adjudged one of the Most Outstanding Student Organizations — U.P. Diamond Jubilee, 1983
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="group relative">
            <div className="absolute -inset-3 border border-[var(--hairline)]" />
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/photos/anniv55-group-stage.jpg"
                alt="Brods across generations at the 55th Anniversary Celebration, Bahay ng Alumni"
                fill
                className="duotone object-cover"
                sizes="(min-width: 768px) 45vw, 100vw"
              />
            </div>
            <p className="mt-4 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/40 uppercase">
              Fig. 01 — 55th Anniversary · Bahay ng Alumni · MMXXIV
            </p>
          </Reveal>
        </Container>
      </section>

      {/* ── The Ledger (projects) ────────────────────────────── */}
      <section className="py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
                  № 03 — The Ledger
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <h2 className="mt-6 font-display text-3xl text-[var(--frat-cream)] md:text-5xl">
                  Works in Service
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.2}>
              <Link
                href="/projects"
                className="group flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-[var(--frat-gold-light)] uppercase"
              >
                Full ledger
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 border-t border-[var(--hairline)]">
            {projects.slice(0, 5).map((project, i) => (
              <Reveal key={project.slug} delay={i * 0.06}>
                <Link
                  href="/projects"
                  className="group grid grid-cols-[auto_1fr] items-baseline gap-6 border-b border-[var(--hairline)] py-7 transition-colors hover:bg-[var(--frat-gold)]/5 md:grid-cols-[80px_1fr_auto] md:gap-10"
                >
                  <span className="font-mono text-sm text-[var(--frat-gold)]/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="font-display text-xl text-[var(--frat-cream)] transition-colors group-hover:text-[var(--frat-gold-light)] md:text-2xl">
                      {project.title}
                    </span>
                    <span className="mt-1 hidden max-w-xl text-sm text-[var(--frat-cream)]/45 md:block">
                      {project.description}
                    </span>
                  </span>
                  <span className="hidden font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/40 uppercase md:block">
                    {project.category}
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Citations (prominent brods) ──────────────────────── */}
      <section className="border-y border-[var(--hairline)] bg-[var(--ink)] py-28">
        <Container>
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              № 04 — Citations
            </p>
          </Reveal>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
            <Reveal delay={0.1}>
              <h2 className="font-display text-3xl text-[var(--frat-cream)] md:text-5xl">
                Excellence, on the Record
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <Link
                href="/brods"
                className="group flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-[var(--frat-gold-light)] uppercase"
              >
                All citations
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-2">
            {prominentBrods.map((brod, i) => (
              <Reveal key={brod.slug} delay={i * 0.12} className="group">
                <div className="relative aspect-square overflow-hidden border border-[var(--hairline)]">
                  <Image
                    src={brod.image}
                    alt={`${brod.name} — ${brod.honor}`}
                    fill
                    className="duotone object-cover object-top"
                    sizes="(min-width: 768px) 45vw, 100vw"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-4">
                  <p className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-gold)]/70 uppercase">
                    Citation № {String(i + 1).padStart(3, "0")} — Batch {brod.batch}
                  </p>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[var(--frat-cream)]/50">
                  {brod.detail}
                </p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Patronage (donate) ───────────────────────────────── */}
      <section className="blueprint relative overflow-hidden py-32 text-center md:py-44">
        <Container className="relative flex flex-col items-center">
          <Reveal>
            <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
              № 05 — Patronage
            </p>
          </Reveal>
          <Reveal delay={0.12}>
            <h2 className="gold-foil mt-8 max-w-3xl font-display text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[1.05] tracking-tight">
              Carry the brotherhood forward.
            </h2>
          </Reveal>
          <Reveal delay={0.24}>
            <p className="mt-6 max-w-lg text-[var(--frat-cream)]/60">
              Scholarships, the Thinking Space, relief operations — every project in the ledger
              began with a brod who gave back.
            </p>
          </Reveal>
          <Reveal delay={0.36}>
            <Link
              href="/donate"
              className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-10")}
            >
              Give Back <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
