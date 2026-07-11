import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/site/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <section className="blueprint flex min-h-[100svh] items-center">
      <Container className="flex flex-col items-center text-center">
        <p className="font-mono text-[11px] tracking-[0.45em] text-[var(--frat-gold)] uppercase">
          Entry not found
        </p>
        <h1 className="mt-8 font-display text-[clamp(4rem,16vw,10rem)] font-semibold leading-none text-[var(--frat-gold-light)]">
          404
        </h1>
        <p className="mt-6 max-w-md font-serif text-2xl italic text-[var(--frat-cream)]/80">
          This page is missing from the archive.
        </p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[var(--frat-cream)]/70">
          The record you&rsquo;re looking for may have been moved, or it was never inscribed.
        </p>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "accent", size: "lg" }), "mt-10")}
        >
          <ArrowLeft className="h-4 w-4" /> Return to the Archive
        </Link>
      </Container>
    </section>
  );
}
