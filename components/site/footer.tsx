import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/site/container";
import { FacebookIcon } from "@/components/site/facebook-icon";
import { LinkedInIcon } from "@/components/site/linkedin-icon";
import { site, association } from "@/lib/content";

const linkClass = "transition-colors hover:text-[var(--frat-cream)]";

export function Footer() {
  return (
    <footer className="border-t border-[var(--hairline)] bg-[var(--ink)] text-[var(--frat-cream)]">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr] md:py-20">
        <div>
          <Image
            src="/logo/emc2-lockup-white.svg"
            unoptimized
            alt="EMC² Fraternity — University of the Philippines"
            width={464}
            height={114}
            className="h-12 w-auto"
          />
          <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-[var(--frat-cream)]/65">
            An exclusive Engineering and Physical Sciences brotherhood, founded in 1969 at the
            U.P. College of Engineering.
          </p>
          <p className="caption mt-5">
            3rd Floor Lobby, Melchor Hall, U.P. Diliman
            <br />
            Quezon City, Philippines
          </p>
        </div>

        <div>
          <p className="label">The record</p>
          <ul className="mt-5 space-y-3 text-[15px] text-[var(--frat-cream)]/70">
            <li><Link href="/history" className={linkClass}>History</Link></li>
            <li><Link href="/projects" className={linkClass}>Projects and campaigns</Link></li>
            <li><Link href="/brods" className={linkClass}>Prominent brods</Link></li>
            <li><Link href="/anniversary" className={linkClass}>The 58th Anniversary</Link></li>
            <li><Link href="/quantum-leap" className={linkClass}>Quantum Leap Sports Series</Link></li>
            <li><Link href="/roadmap" className={linkClass}>What&rsquo;s next</Link></li>
          </ul>
        </div>

        <div>
          <p className="label">Correspondence</p>
          <ul className="mt-5 space-y-3 text-[15px] text-[var(--frat-cream)]/70">
            <li><Link href="/donate" className={cn2("text-[var(--frat-gold-light)] hover:text-[var(--frat-cream)]")}>Give back</Link></li>
            <li><Link href="/portal" className={linkClass}>Member Portal</Link></li>
            <li><Link href="/contribute" className={linkClass}>Add to the record</Link></li>
            <li><Link href="/contact" className={linkClass}>Contact the fraternity</Link></li>
            <li>
              <a href={site.facebook} target="_blank" rel="noreferrer" className={`flex items-center gap-2 ${linkClass}`}>
                <FacebookIcon className="h-4 w-4" /> Facebook
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noreferrer" className={`flex items-center gap-2 ${linkClass}`}>
                <LinkedInIcon className="h-4 w-4" /> LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-[var(--hairline)] py-6">
        <Container className="flex flex-col gap-3 text-[13px] leading-relaxed text-[var(--frat-cream)]/50 md:flex-row md:items-center md:justify-between">
          <p className="max-w-2xl">
            Gifts and correspondence are received by {association.legalName}
            {association.secRegNo ? `, SEC Reg. No. ${association.secRegNo}` : ", SEC-registered"}.
            Details you submit go only to the Association and are never published.{" "}
            <Link href="/privacy" className="underline underline-offset-4 hover:text-[var(--frat-cream)]">
              Privacy
            </Link>
          </p>
          <p>&copy; {new Date().getFullYear()} EMC&sup2; Fraternity, University of the Philippines</p>
        </Container>
      </div>
    </footer>
  );
}

function cn2(extra: string) {
  return `transition-colors ${extra}`;
}
