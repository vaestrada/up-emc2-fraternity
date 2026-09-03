"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type SliderCard = {
  href: string;
  image: string;
  alt: string;
  title: string;
  body: string;
  cta?: string;
};

/* A horizontal card slider with round arrow buttons, as on the reference.
   Native scroll-snap does the sliding; the buttons scroll by one card. */
export function CardSlider({ cards, className }: { cards: SliderCard[]; className?: string }) {
  const track = useRef<HTMLDivElement>(null);

  const step = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    const first = el.firstElementChild as HTMLElement | null;
    const width = first ? first.getBoundingClientRect().width + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * width, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div className="absolute -top-20 right-0 hidden gap-3 md:flex">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label="Previous"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--fg)]/10 text-[var(--fg)] transition-colors hover:bg-[var(--fg)]/20"
        >
          <ArrowLeft className="h-5 w-5" strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label="Next"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--brand)] text-[var(--frat-cream)] transition-colors hover:bg-[#08300a]"
        >
          <ArrowRight className="h-5 w-5" strokeWidth={2} />
        </button>
      </div>

      <div ref={track} className="slider -mx-6 px-6 md:mx-0 md:px-0">
        {cards.map((c) => (
          <article key={c.href + c.title} className="w-[78vw] max-w-[22rem] sm:w-[20rem] md:w-[22rem]">
            <Link href={c.href} className="group block">
              <div className="relative aspect-[4/3] overflow-hidden rounded-card bg-[var(--tint)]">
                <Image
                  src={c.image}
                  alt={c.alt}
                  fill
                  sizes="(min-width: 768px) 22rem, 78vw"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-6 font-sans text-[26px] font-bold leading-tight text-[var(--fg)]">{c.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-[var(--fg-muted)]">{c.body}</p>
              <span className="mt-5 inline-block border-b-2 border-[var(--frat-gold)] pb-0.5 text-[15px] font-semibold text-[var(--fg)]">
                {c.cta ?? "Learn more"}
              </span>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
