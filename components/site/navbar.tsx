"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/history", label: "History" },
  { href: "/projects", label: "Projects" },
  { href: "/brods", label: "Brods" },
  { href: "/anniversary", label: "58th" },
  { href: "/portal", label: "Portal" },
  { href: "/donate", label: "Give Back" },
  { href: "/contact", label: "Contact" },
];

/* A floating island: the mark, the links, and the one gold action, in a
   rounded bar that sits over any ground. Always present, as asked; never a
   hidden menu on desktop. */
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
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
      <div className="island mx-auto flex h-16 max-w-6xl items-center justify-between rounded-full pr-2 pl-5 md:pl-6">
        <Link href="/" onClick={() => setOpen(false)} aria-label="EMC² Fraternity, home" className="flex items-center">
          <Image src="/logo/emc2-mark.svg" alt="" width={114} height={114} unoptimized className="h-9 w-9" />
          <span className="ml-3 hidden font-display text-[15px] font-bold tracking-wide text-[var(--fg)] sm:block">
            EMC&sup2; Fraternity
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "rounded-full px-3.5 py-2 text-[14px] font-semibold transition-colors",
                isActive(link.href)
                  ? "bg-[var(--fg)]/8 text-[var(--fg)]"
                  : "text-[var(--fg)]/75 hover:bg-[var(--fg)]/5 hover:text-[var(--fg)]"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/join" className={cn(buttonVariants({ variant: "gold", size: "sm" }))}>
            Join us
          </Link>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--fg)] transition-colors hover:bg-[var(--fg)]/5 lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" strokeWidth={2} /> : <Menu className="h-5 w-5" strokeWidth={2} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "island mx-auto mt-2 grid max-w-6xl overflow-hidden rounded-3xl transition-all duration-300 lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col p-3" aria-label="Mobile">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "rounded-2xl px-4 py-3 text-[16px] font-semibold",
                  isActive(link.href) ? "bg-[var(--fg)]/8 text-[var(--fg)]" : "text-[var(--fg)]/80"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
