import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/site/container";
import { FacebookIcon } from "@/components/site/facebook-icon";
import { LinkedInIcon } from "@/components/site/linkedin-icon";
import { site } from "@/lib/content";

export function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] bg-[var(--ink)] text-[var(--frat-cream)]">
      <Container className="grid gap-12 py-20 md:grid-cols-3">
        <div>
          <Image
            src="/logo/emc2-lockup-white.png"
            alt="EMC² Fraternity — University of the Philippines"
            width={2560}
            height={1080}
            className="h-14 w-auto"
          />
          <p className="mt-5 max-w-xs font-mono text-[10px] leading-relaxed tracking-[0.2em] text-[var(--frat-cream)]/40 uppercase">
            U.P. College of Engineering
            <br />
            Est. MCMLXIX
            <br />
            14.6553° N / 121.0685° E
          </p>
          <p className="mt-5 font-serif text-lg italic text-[var(--frat-gold-light)]">
            Equality &middot; Service &middot; Brotherhood
          </p>
        </div>

        <div>
          <h4 className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-gold)]/70 uppercase">
            The Archive
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-[var(--frat-cream)]/70">
            <li><Link href="/history" className="transition-colors hover:text-[var(--frat-gold-light)]">History</Link></li>
            <li><Link href="/projects" className="transition-colors hover:text-[var(--frat-gold-light)]">Projects &amp; Campaigns</Link></li>
            <li><Link href="/brods" className="transition-colors hover:text-[var(--frat-gold-light)]">Prominent Brods</Link></li>
            <li><Link href="/donate" className="transition-colors hover:text-[var(--frat-gold-light)]">Give Back</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-mono text-[10px] tracking-[0.3em] text-[var(--frat-gold)]/70 uppercase">
            Correspondence
          </h4>
          <ul className="mt-5 space-y-3 text-sm text-[var(--frat-cream)]/70">
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-[var(--frat-gold-light)]"
              >
                <FacebookIcon className="h-4 w-4" /> Facebook
              </a>
            </li>
            <li>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-[var(--frat-gold-light)]"
              >
                <LinkedInIcon className="h-4 w-4" /> LinkedIn
              </a>
            </li>
            <li>
              <Link href="/contact" className="transition-colors hover:text-[var(--frat-gold-light)]">
                Contact the Fraternity
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-[var(--hairline)] py-6">
        <Container className="flex flex-col items-center justify-between gap-2 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/35 uppercase md:flex-row">
          <span>&copy; {new Date().getFullYear()} EMC&sup2; Fraternity, University of the Philippines</span>
          <span>Site by and for the Brotherhood</span>
        </Container>
      </div>
    </footer>
  );
}
