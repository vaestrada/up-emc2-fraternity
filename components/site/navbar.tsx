"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/site/container";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/history", label: "History" },
  { href: "/projects", label: "Projects" },
  { href: "/brods", label: "Brods" },
  { href: "/anniversary", label: "58th Anniversary" },
  { href: "/quantum-leap", label: "Sports" },
  { href: "/portal", label: "Portal" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--hairline)] bg-[var(--canvas)]/95">
      <Container className="flex h-[4.5rem] items-center justify-between md:h-20">
        <Link href="/" onClick={() => setOpen(false)} aria-label="EMC² Fraternity, home">
          {/* Official lockup as issued; the mark is never re-typeset. */}
          <Image
            src="/logo/emc2-lockup-white.png"
            alt="EMC² Fraternity — University of the Philippines"
            width={400}
            height={169}
            className="h-10 w-auto md:h-12"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "font-sans text-[12px] font-medium tracking-[0.12em] uppercase transition-colors",
                isActive(link.href)
                  ? "text-[var(--frat-gold-light)]"
                  : "text-[var(--frat-cream)]/70 hover:text-[var(--frat-cream)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Link href="/donate" className={cn(buttonVariants({ variant: "accent", size: "sm" }))}>
            Give Back
          </Link>
        </div>

        <button
          className="text-[var(--frat-cream)] lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
        </button>
      </Container>

      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "grid overflow-hidden border-t border-[var(--hairline)] bg-[var(--canvas)] transition-all duration-300 lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 border-t-0"
        )}
      >
        <div className="overflow-hidden">
          <Container className="flex flex-col py-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "border-b border-[var(--hairline)] py-4 font-sans text-[13px] font-medium tracking-[0.12em] uppercase",
                  isActive(link.href) ? "text-[var(--frat-gold-light)]" : "text-[var(--frat-cream)]/85"
                )}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/donate"
              onClick={() => setOpen(false)}
              className={cn(buttonVariants({ variant: "accent", size: "default" }), "mt-4 mb-2")}
            >
              Give Back
            </Link>
          </Container>
        </div>
      </div>
    </header>
  );
}
