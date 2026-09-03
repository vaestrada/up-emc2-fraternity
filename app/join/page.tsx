import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/site/page-hero";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/motion/reveal";
import { SectionLabel } from "@/components/site/section-label";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { site, FOUNDING_YEAR } from "@/lib/content";

export const metadata: Metadata = {
  title: "Join the Brotherhood",
  description:
    "How to join the EMC² Fraternity: who the brotherhood is for, what it asks, what it gives, and how to meet the brods at the U.P. College of Engineering.",
};

const GAINS = [
  {
    title: "Brothers for life",
    body: "A brotherhood of 490 on record across every batch since 1969: engineers, scientists, founders, public servants, professors. Brods who answer the phone.",
  },
  {
    title: "Leadership, early",
    body: "The residents run real projects with real budgets: the UP Fair stage, an inter-college quiz show, relief operations, a study lounge inside Melchor Hall.",
  },
  {
    title: "A standard to keep",
    body: "Equality, Service, and Brotherhood. Adjudged one of the University's Most Outstanding Student Organisations in 1983, and still measured against it.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Reach out",
    body: "Message the fraternity on Facebook or through the contact page. Say your course, your year, and what drew you here. A resident will reply.",
  },
  {
    n: "02",
    title: "Meet the brods",
    body: "Come to the tambayan at Melchor Hall, sit in on a project, and ask everything. You should know the brotherhood well before you decide, and so should we.",
  },
  {
    n: "03",
    title: "Decide together",
    body: "If it is right on both sides, the residents will walk you through what comes next. Nothing about the process is hidden from you.",
  },
];

export default function JoinPage() {
  const years = new Date().getFullYear() - FOUNDING_YEAR;
  return (
    <>
      <PageHero
        eyebrow="For the studentry"
        title="Take the quantum leap."
        description="EMC² is an exclusive brotherhood of Engineering and the Physical Sciences at the University of the Philippines. If you are a student of the College of Engineering or the sciences and you want more than a degree, start here."
        image={{
          src: "/photos/anniv55-gazebo.jpg",
          alt: "Brods of every batch at the gazebo, 55th Anniversary Celebration",
          caption: "Brods of every batch, 55th Anniversary Celebration, U.P. Diliman.",
        }}
      />

      {/* What you gain */}
      <section className="py-20 md:py-28">
        <Container>
          <Reveal>
            <SectionLabel>What the brotherhood gives</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">More than a degree.</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {GAINS.map((g, i) => (
              <Reveal key={g.title} delay={0.06 * i}>
                <div className="h-full rounded-card bg-[var(--tint)] p-8 md:p-10">
                  <h3 className="font-sans text-[24px] font-bold leading-tight text-[var(--fg)]">{g.title}</h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg-muted)]">{g.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Who it is for */}
      <section className="bg-[var(--tint)] py-20 md:py-28">
        <Container className="grid items-center gap-12 md:grid-cols-[1fr_1.1fr] md:gap-16">
          <Reveal>
            <SectionLabel>Who it is for</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">Engineers and scientists of the University.</h2>
            <p className="lead mt-6 max-w-lg">
              The fraternity draws its members from Engineering and the Physical Sciences at the
              University of the Philippines. Founded by ten scholars in {FOUNDING_YEAR}; {years} years
              on, still a moulding ground for student leaders and young exemplars in Engineering
              and the Sciences.
            </p>
            <p className={cn("prose-archive mt-6 text-[17px] leading-[1.7]")}>
              We are an Engineering and science fraternity, not a Greek-letter social club. The
              credo is four lines: {site.credo}
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-[var(--ink)]">
              <Image
                src="/photos/anniv55-outdoor.jpg"
                alt="Brods gathered before Quezon Hall, U.P. Diliman"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </Container>
      </section>

      {/* How it works */}
      <section className="py-20 md:py-28">
        <Container className="grid gap-12 md:grid-cols-[0.8fr_1.4fr] md:gap-16">
          <Reveal>
            <SectionLabel>How to join</SectionLabel>
            <h2 className="display mt-6 text-[clamp(2.25rem,4.5vw,3.5rem)]">Three steps, no mystery.</h2>
            <p className="lead mt-6 max-w-md">
              You should know the brotherhood well before you decide. That is why the first two
              steps are about meeting, not applying.
            </p>
          </Reveal>
          <div className="border-t border-[var(--hairline)]">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={0.05 * i}>
                <div className="grid grid-cols-[3rem_1fr] gap-6 border-b border-[var(--hairline)] py-7">
                  <span className="stat text-[2rem]">{s.n}</span>
                  <div>
                    <h3 className="font-sans text-[22px] font-bold leading-snug text-[var(--fg)]">{s.title}</h3>
                    <p className="mt-2 text-[15px] leading-relaxed text-[var(--fg-muted)]">{s.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* The call */}
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
              <div className="relative mx-auto max-w-2xl">
                <h2 className="display text-[clamp(2rem,4.5vw,3.25rem)] text-[var(--frat-cream)]">Ready to meet the brods?</h2>
                <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-[var(--frat-cream)]/80">
                  Message the fraternity with your course and year. The tambayan is on the 3rd
                  Floor Lobby of Melchor Hall, U.P. Diliman.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  <a href={site.facebook} target="_blank" rel="noreferrer" className={cn(buttonVariants({ variant: "white" }))}>
                    Message on Facebook
                  </a>
                  <Link href="/contact" className={cn(buttonVariants({ variant: "outline-light" }))}>
                    Use the contact page
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
