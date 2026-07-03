"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/site/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/history", label: "History" },
  { href: "/projects", label: "Projects" },
  { href: "/brods", label: "Brods" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--hairline)] bg-[var(--canvas)]/75 backdrop-blur-md">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)}>
          {/* Official lockup as issued — the mark is never re-typeset. */}
          <Image
            src="/logo/emc2-lockup-white.png"
            alt="EMC² Fraternity — University of the Philippines"
            width={2560}
            height={1080}
            className="h-12 w-auto md:h-14"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-mono text-[11px] tracking-[0.25em] text-[var(--frat-cream)]/70 uppercase transition-colors hover:text-[var(--frat-gold-light)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/donate" className={cn(buttonVariants({ variant: "accent", size: "sm" }))}>
            Give Back
          </Link>
        </div>

        <button
          className="text-[var(--frat-cream)] md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      <div
        id="mobile-menu"
        className={cn(
          "grid overflow-hidden border-t border-[var(--hairline)] bg-[var(--canvas)]/95 transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 border-t-0"
        )}
      >
        <div className="overflow-hidden">
          <Container className="flex flex-col gap-1 py-4">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 font-mono text-sm tracking-[0.2em] text-[var(--frat-cream)]/80 uppercase hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className="mt-2 bg-[var(--frat-gold)] px-4 py-3 text-center font-mono text-xs font-semibold tracking-[0.25em] text-[#1a1305] uppercase"
            >
              Give Back
            </Link>
          </Container>
        </div>
      </div>
    </header>
  );
}
