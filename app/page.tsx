import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { BrodCard } from "@/components/site/brod-card";
import { ScrollHero } from "@/components/site/scroll-hero";
import { CardSlider, type SliderCard } from "@/components/site/card-slider";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FOUNDING_YEAR, site, anniversary, projects, prominentBrods } from "@/lib/content";
import { withoutDemo } from "@/lib/demo";

export const metadata: Metadata = {
  openGraph: {
    description:
      "An exclusive Engineering and Physical Sciences brotherhood, founded in 1969 at the University of the Philippines College of Engineering.",
  },
};

const INVOLVEMENT: SliderCard[] = [
  {
    href: "/anniversary",
    image: "/photos/anniv55-stage.jpg",
    alt: "Brods on stage at the 55th Anniversary Celebration",
    title: "The 58th Anniversary",
    body: `${anniversary.month} at ${anniversary.venue}, U.P. Diliman. Every batch in one room. Put your name on the save-the-date list and hear first about awards, sponsorships, and tickets.`,
    cta: "Save the date",
  },
  {
    href: "/donate",
    image: "/photos/anniv55-outdoor.jpg",
    alt: "Brods gathered before Quezon Hall",
    title: "Give Back",
    body: "Scholarships, the Thinking Space study lounge, and relief operations. Every project in the record began with a brod who gave.",
    cta: "Make a gift",
  },
  {
    href: "/portal",
    image: "/roadmap/portal-sign-in.png",
    alt: "The Member Portal sign-in",
    title: "The Member Portal",
    body: "By invitation. Keep your own record current and find brods who have opted into the directory. Private by default.",
    cta: "Enter the Portal",
  },
  {
    href: "/contribute",
    image: "/photos/projects-campaigns-card.jpg",
    alt: "A collage of the fraternity's projects and campaigns",
    title: "Add to the Record",
    body: "A memory, a photograph, a brod's news, a milestone we missed. The archive is written by the brotherhood; send us what you carry.",
    cta: "Contribute",
  },
  {
    href: "/quantum-leap",
    image: "/quantum-leap/pickleball-2026-teaser-poster.jpg",
    alt: "Quantum Leap Sports Series, pickleball",
    title: "Quantum Leap Sports Series",
    body: "One sport at a time, played well. Pickleball opened the series in August 2026; the next edition follows once it is certain.",
    cta: "See the series",
  },
];

const STATS = [
  { value: String(FOUNDING_YEAR), label: "Founded by ten scholars of the University at the College of Engineering." },
  { value: "490", label: "Brods on record, from the founding batch to the active brods of today." },
  { value: String(projects.length), label: "Projects and campaigns in the ledger, from quiz bees to disaster relief." },
  { value: anniversary.ordinal, label: `Anniversary, ${anniversary.month}, ${anniversary.venue}, U.P. Diliman.` },
];

const STORIES = [
  {
    href: "/portal",
    image: "/roadmap/portal-sign-in.png",
    alt: "The Member Portal sign-in",
    date: "September 2026",
    title: "The Member Portal opens, by invitation",
  },
  {
    href: "/quantum-leap",
    image: "/quantum-leap/pickleball-2026-poster.png",
    alt: "Quantum Leap Sports Series pickleball poster",
    date: "22 August 2026",
    title: "Quantum Leap opens with a day of pickleball",
  },
  {
    href: "/history",
    image: "/photos/anniv55-gazebo.jpg",
    alt: "Brods at the gazebo, 55th Anniversary",
    date: "24 February 2024",
    title: "Fifty-five years, in one afternoon at U.P. Diliman",
  },
];

/* The mark's diamond, repeated as a small decorative motif, the way the
   reference repeats its stars. */
function Diamonds({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn("grid grid-cols-3 gap-4", className)}>
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="block h-3.5 w-3.5 rotate-45 rounded-[2px] bg-[var(--frat-gold)]" />
      ))}
    </div>
  );
}

export default function Home() {
  const brods = withoutDemo(prominentBrods).slice(0, 4);
  const years = new Date().getFullYear() - FOUNDING_YEAR;

  return (
    <>
      {/* ── Hero: the photograph, then the panel that grows down over it as
             the reader scrolls (see scroll-hero.tsx). ────────────────── */}
      <ScrollHero
        image="/photos/anniv55-outdoor.jpg"
        imageAlt="Brods of every batch gathered before Quezon Hall at the 55th Anniversary Celebration, U.P. Diliman"
      />

      {/* ── We are EMC² ──────────────────────────────────────────────────── */}
      <section id="we-are" className="scroll-mt-24 bg-[var(--tint)] py-20 md:py-28">
        <Container className="relative grid items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <Diamonds className="absolute -top-16 left-0 hidden md:grid" />
          <Reveal>
            <SectionLabel>Since {FOUNDING_YEAR}</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.75rem,6vw,5.25rem)]">
              We are
              <br />
              EMC&sup2;.
            </h2>
            <p className="lead mt-7 max-w-lg">
              An exclusive brotherhood of Engineering and the Physical Sciences at the University of
              the Philippines. Founded by ten scholars. {years} years of Equality, Service, and
              Brotherhood.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/history" className={cn(buttonVariants({ variant: "default" }))}>
                About us
              </Link>
              <Link href="/join" className={cn(buttonVariants({ variant: "outline" }))}>
                Join the brotherhood
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-[var(--ink)]">
              <Image
                src="/photos/anniv55-gazebo.jpg"
                alt="Brods of every batch at the gazebo, 55th Anniversary Celebration, U.P. Diliman"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Diamonds className="absolute -bottom-16 right-0 hidden md:grid" />
        </Container>
      </section>

      {/* ── Get involved ────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <h2 className="display text-[clamp(2.25rem,4.5vw,3.5rem)]">Get involved.</h2>
            <p className="lead mt-5 max-w-xl">
              There are many ways to stay close to the brotherhood, as a brod, an alumnus, or a
              friend of the fraternity. Find yours.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <CardSlider cards={INVOLVEMENT} />
          </Reveal>
        </Container>
      </section>

      {/* ── The Portal panel ────────────────────────────────────────────── */}
      <section className="pb-20 md:pb-28">
        <Container>
          <Reveal>
            <div className="on-dark relative overflow-hidden rounded-card bg-[var(--ink)] px-6 py-16 text-center md:px-16 md:py-24">
              <Image
                src="/logo/emc2-mark.svg"
                alt=""
                width={114}
                height={114}
                unoptimized
                aria-hidden
                className="pointer-events-none absolute -right-24 -bottom-32 h-[28rem] w-[28rem] opacity-[0.07] md:h-[36rem] md:w-[36rem]"
              />
              <Image
                src="/logo/emc2-mark.svg"
                alt=""
                width={114}
                height={114}
                unoptimized
                aria-hidden
                className="pointer-events-none absolute -top-24 -left-20 h-[20rem] w-[20rem] opacity-[0.06]"
              />
              <div className="relative">
                <Image src="/logo/emc2-mark.svg" alt="" width={114} height={114} unoptimized className="mx-auto h-16 w-16" />
                <h2 className="display mt-6 text-[clamp(2rem,4.5vw,3.25rem)] text-[var(--frat-cream)]">The Member Portal</h2>
                <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-[var(--frat-cream)]/80">
                  A private space for verified brods: keep your record current, find one another in the
                  directory, and record your dues. By invitation, verified against the roster.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <Link href="/portal" className={cn(buttonVariants({ variant: "outline-light" }))}>
                    Enter the Portal
                  </Link>
                  <Link
                    href="/contact"
                    className={cn(buttonVariants({ variant: "ghost" }), "text-[var(--frat-cream)]/80 hover:text-[var(--frat-cream)]")}
                  >
                    Request an invitation
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* ── Notices and stories ─────────────────────────────────────────── */}
      <section className="bg-[var(--tint)] py-20 md:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <h2 className="display text-[clamp(2.25rem,4.5vw,3.5rem)]">Notices and stories.</h2>
              <p className="lead mt-4 max-w-xl">What the Association has to say, and what the brotherhood has been doing.</p>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/history" className={cn(buttonVariants({ variant: "outline" }))}>
                View the record
              </Link>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-12 md:grid-cols-[1fr_1fr] md:gap-16">
            <Reveal>
              <Link href="/anniversary" className="group block">
                <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-[var(--ink)]">
                  <Image
                    src="/photos/anniv55-stage.jpg"
                    alt="Brods on stage at the 55th Anniversary Celebration"
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <p className="caption mt-6">{anniversary.month}</p>
                <h3 className="mt-2 font-sans text-[30px] font-bold leading-tight text-[var(--fg)]">
                  The 58th Anniversary: save the date
                </h3>
                <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--fg-muted)]">
                  {anniversary.venue}, {anniversary.venueDetail}. Put your name down now; the awards,
                  sponsorships, souvenir programme, and tickets open later in the year, and everyone on
                  the list hears first.
                </p>
              </Link>
            </Reveal>
            <div className="divide-y divide-[var(--hairline)] border-t border-[var(--hairline)]">
              {STORIES.map((s, i) => (
                <Reveal key={s.href} delay={0.05 * i}>
                  <Link href={s.href} className="group grid grid-cols-[7rem_1fr] items-center gap-6 py-6 md:grid-cols-[11rem_1fr]">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--ink)]">
                      <Image src={s.image} alt={s.alt} fill sizes="11rem" className="object-cover" />
                    </div>
                    <div>
                      <p className="caption">{s.date}</p>
                      <h3 className="mt-1 font-sans text-[20px] font-bold leading-snug text-[var(--fg)] transition-colors group-hover:text-[var(--brand)] md:text-[24px]">
                        {s.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ── Our impact ──────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[0.9fr_1.4fr] md:gap-16">
          <Reveal>
            <SectionLabel>Our impact</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.5rem,5vw,4rem)]">Give back.</h2>
            <p className="lead mt-6 max-w-md">
              Contributions from brods, alumni, and friends fund scholarships, campus projects, and
              community outreach, received and acknowledged by the Alumni Association.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3">
              <Link href="/donate" className={cn(buttonVariants({ variant: "default" }))}>
                Donate today
              </Link>
              <Link href="/projects" className={cn(buttonVariants({ variant: "outline" }))}>
                See the projects
              </Link>
            </div>
          </Reveal>
          <div className="grid gap-5 sm:grid-cols-2">
            {STATS.map((s, i) => (
              <Reveal key={s.value + s.label} delay={0.06 * i}>
                <div className="rounded-card bg-[var(--tint)] p-8 md:p-10">
                  <p className="stat">{s.value}</p>
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg-muted)]">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Prominent brods ─────────────────────────────────────────────── */}
      <section className="bg-[var(--tint)] py-20 md:py-28">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <h2 className="display text-[clamp(2.25rem,4.5vw,3.5rem)]">Prominent brods.</h2>
              <p className="lead mt-4 max-w-xl">
                Brothers who carry the credo into their professions, public service, and the
                University&rsquo;s alumni community.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Link href="/brods" className={cn(buttonVariants({ variant: "outline" }))}>
                View all
              </Link>
            </Reveal>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {brods.map((brod, i) => (
              <Reveal key={brod.slug} delay={i * 0.06}>
                <BrodCard brod={brod} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* ── Explore ─────────────────────────────────────────────────────── */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <div className="on-dark relative overflow-hidden rounded-card bg-[var(--ink)] px-6 py-20 text-center md:px-16 md:py-28">
              <Image src="/photos/anniv55-gazebo.jpg" alt="" fill sizes="100vw" className="object-cover opacity-30" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-[var(--ink)]/70 to-[var(--ink)]/40" />
              <div className="relative mx-auto max-w-3xl">
                <h2 className="display text-[clamp(2rem,4.5vw,3.5rem)] text-[var(--frat-cream)]">
                  Explore {years} years of Equality, Service, and Brotherhood.
                </h2>
                <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--frat-cream)]/80">{site.credo}</p>
                <Link href="/history" className={cn(buttonVariants({ variant: "white", size: "lg" }), "mt-9")}>
                  Read the history
                </Link>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
