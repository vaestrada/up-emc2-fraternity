import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/site/container";
import { FacebookIcon } from "@/components/site/facebook-icon";
import { LinkedInIcon } from "@/components/site/linkedin-icon";
import { InstagramIcon } from "@/components/site/instagram-icon";
import { site, association } from "@/lib/content";

const linkClass = "transition-colors hover:text-[var(--frat-cream)]";
const heading = "text-[13px] font-bold tracking-[0.12em] text-[var(--frat-gold-light)] uppercase";

/* Rendered only where a handle actually exists, so adding Instagram later is
   one line in lib/content.ts and nothing else. */
const SOCIALS = [
  { href: site.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: site.instagram, label: "Instagram", Icon: InstagramIcon },
];

export function Footer() {
  return (
    <footer className="on-dark bg-[var(--ink)] text-[var(--frat-cream)]">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:py-24">
        <div>
          <Image
            src="/logo/emc2-lockup-white.svg"
            alt="EMC² Fraternity — University of the Philippines"
            width={464}
            height={114}
            unoptimized
            className="h-14 w-auto"
          />
          <p className="mt-6 max-w-xs text-[15px] leading-relaxed text-[var(--frat-cream)]/70">
            An exclusive Engineering and Physical Sciences brotherhood, founded in 1969 at the
            U.P. College of Engineering.
          </p>
          <p className="mt-5 text-[14px] leading-relaxed text-[var(--frat-cream)]/55">
            3rd Floor Lobby, Melchor Hall, U.P. Diliman
            <br />
            Quezon City, Philippines
          </p>
          <div className="mt-6 flex gap-3">
            {SOCIALS.filter((x) => x.href).map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href as string}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--frat-cream)]/25 transition-colors hover:bg-[var(--frat-cream)]/10"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className={heading}>The record</p>
          <ul className="mt-5 space-y-3 text-[15px] text-[var(--frat-cream)]/75">
            <li><Link href="/history" className={linkClass}>History</Link></li>
            <li><Link href="/projects" className={linkClass}>Projects and campaigns</Link></li>
            <li><Link href="/brods" className={linkClass}>Prominent brods</Link></li>
            <li><Link href="/roadmap" className={linkClass}>What&rsquo;s next</Link></li>
          </ul>
        </div>

        <div>
          <p className={heading}>Get involved</p>
          <ul className="mt-5 space-y-3 text-[15px] text-[var(--frat-cream)]/75">
            <li><Link href="/join" className={linkClass}>Join the brotherhood</Link></li>
            <li><Link href="/anniversary" className={linkClass}>The 58th Anniversary</Link></li>
            <li><Link href="/quantum-leap" className={linkClass}>Quantum Leap Sports Series</Link></li>
            <li><Link href="/contribute" className={linkClass}>Add to the record</Link></li>
            <li><Link href="/donate" className={linkClass}>Give back</Link></li>
          </ul>
        </div>

        <div>
          <p className={heading}>Brods</p>
          <ul className="mt-5 space-y-3 text-[15px] text-[var(--frat-cream)]/75">
            <li><Link href="/portal" className={linkClass}>Member Portal</Link></li>
            <li><Link href="/portal/directory" className={linkClass}>Directory</Link></li>
            <li><Link href="/portal/dues" className={linkClass}>Dues</Link></li>
            <li><Link href="/contact" className={linkClass}>Contact the fraternity</Link></li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-[var(--frat-cream)]/10 py-6">
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
