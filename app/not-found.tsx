import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/site/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Page Not Found" };

export default function NotFound() {
  return (
    <section className="flex min-h-[100svh] items-center">
      <Container className="max-w-2xl">
        <p className="label">Entry not found</p>
        <h1 className="mt-6 font-display text-[clamp(3rem,10vw,6rem)] leading-none text-[var(--fg)]">404</h1>
        <p className="lead mt-6">This page is missing from the record.</p>
        <p className="prose-archive mt-4 text-[15px] leading-relaxed">
          The entry you are looking for may have been moved, or it was never inscribed.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-6">
          <Link href="/" className={cn(buttonVariants({ variant: "accent" }))}>
            Return home
          </Link>
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-[var(--fg)]/60">
            {[
              { href: "/history", label: "History" },
              { href: "/projects", label: "Projects" },
              { href: "/brods", label: "Brods" },
              { href: "/contact", label: "Contact" },
              { href: "/donate", label: "Give back" },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-[var(--fg)]">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </section>
  );
}
