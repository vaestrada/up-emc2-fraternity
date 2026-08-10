import {
  CheckCircle2,
  Wallet,
  CreditCard,
  Smartphone,
  Building2,
  Banknote,
  Signal,
  BatteryFull,
  Bell,
  Users,
  Home,
  Sparkles,
  Send,
} from "lucide-react";

/** Small "this is a concept, not a live feature" chip for not-yet-built mockups. */
function ConceptChip() {
  return (
    <span className="absolute top-3 right-3 border border-[var(--frat-gold)]/60 bg-[var(--ink)]/80 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-[var(--frat-gold-light)] uppercase backdrop-blur-sm">
      Concept
    </span>
  );
}

const FrameShell = ({ children, concept = true }: { children: React.ReactNode; concept?: boolean }) => (
  <div className="relative flex h-full min-h-[280px] items-center justify-center overflow-hidden border border-[var(--hairline)] bg-[var(--ink)] p-6">
    {concept ? <ConceptChip /> : null}
    {children}
  </div>
);

/** Real screenshot of the live /portal sign-in — genuinely shipped, not a mockup. */
export function PortalScreenshot() {
  return (
    <div className="relative h-full min-h-[280px] overflow-hidden border border-[var(--hairline)]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/quantum-leap/demo-portal-screenshot.jpg"
        alt="The live Member Portal sign-in screen"
        className="h-full w-full object-cover object-top"
      />
      <span className="absolute top-3 right-3 border border-[var(--frat-gold)]/60 bg-[var(--ink)]/80 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-[var(--frat-gold-light)] uppercase backdrop-blur-sm">
        Live — real screenshot
      </span>
    </div>
  );
}

export function DuesMockup() {
  return (
    <FrameShell concept={false}>
      <span className="absolute top-3 right-3 border border-[var(--frat-gold)]/60 bg-[var(--ink)]/80 px-2 py-1 font-mono text-[9px] tracking-[0.2em] text-[var(--frat-gold-light)] uppercase backdrop-blur-sm">
        Live — real UI
      </span>
      <div className="w-full max-w-xs border border-[var(--hairline)] bg-[var(--canvas)] p-6">
        <div className="flex items-center gap-2 text-[var(--frat-gold-light)]">
          <CheckCircle2 className="h-5 w-5" strokeWidth={1.5} />
          <p className="font-mono text-[10px] tracking-[0.2em] uppercase">Recorded</p>
        </div>
        <p className="mt-4 font-display text-2xl text-[var(--frat-cream)]">₱500.00</p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/50 uppercase">
          AY 2025&ndash;2026 &middot; GCash
        </p>
        <div className="mt-5 grid grid-cols-4 gap-2">
          {[Wallet, CreditCard, Building2, Banknote].map((Icon, i) => (
            <div
              key={i}
              className={`flex h-9 items-center justify-center border ${i === 0 ? "border-[var(--frat-gold)] bg-[var(--frat-gold)]/10" : "border-[var(--hairline)]"}`}
            >
              <Icon className="h-4 w-4 text-[var(--frat-cream)]/70" strokeWidth={1.5} />
            </div>
          ))}
        </div>
      </div>
    </FrameShell>
  );
}

export function CheckoutMockup() {
  return (
    <FrameShell>
      <div className="w-full max-w-xs border border-[var(--hairline)] bg-[var(--canvas)] p-6">
        <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--frat-gold)] uppercase">Pay Dues</p>
        <p className="mt-2 font-display text-3xl text-[var(--frat-cream)]">₱500.00</p>
        <div className="mt-5 space-y-2">
          {[
            { icon: Wallet, label: "GCash", active: true },
            { icon: Smartphone, label: "Maya", active: false },
            { icon: CreditCard, label: "Card", active: false },
          ].map(({ icon: Icon, label, active }) => (
            <div
              key={label}
              className={`flex items-center gap-3 border px-4 py-3 ${active ? "border-[var(--frat-gold)] bg-[var(--frat-gold)]/10" : "border-[var(--hairline)]"}`}
            >
              <Icon className="h-4 w-4 text-[var(--frat-cream)]/80" strokeWidth={1.5} />
              <span className="text-sm text-[var(--frat-cream)]/80">{label}</span>
              {active ? <span className="ml-auto h-2 w-2 rounded-full bg-[var(--frat-gold)]" /> : null}
            </div>
          ))}
        </div>
        <div className="mt-5 flex h-11 items-center justify-center bg-[var(--frat-gold)] font-mono text-xs font-semibold tracking-[0.2em] text-[var(--ink)] uppercase">
          Pay ₱500.00
        </div>
      </div>
    </FrameShell>
  );
}

export function NewsletterMockup() {
  return (
    <FrameShell>
      <div className="w-full max-w-sm border border-[var(--hairline)] bg-[var(--canvas)]">
        <div className="border-b border-[var(--hairline)] p-4">
          <p className="font-mono text-[9px] tracking-[0.15em] text-[var(--frat-cream)]/50 uppercase">
            From: EMC² Fraternity Alumni Association
          </p>
          <p className="mt-1 font-display text-lg text-[var(--frat-cream)]">The Quarterly Dispatch</p>
        </div>
        <div className="space-y-4 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
            <p className="text-xs leading-relaxed text-[var(--frat-cream)]/70">
              New citation inscribed &mdash; a brod recognized for public service.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Bell className="mt-0.5 h-4 w-4 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
            <p className="text-xs leading-relaxed text-[var(--frat-cream)]/70">
              Save the date &mdash; the Association&rsquo;s next gathering.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <Send className="mt-0.5 h-4 w-4 shrink-0 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
            <p className="text-xs leading-relaxed text-[var(--frat-cream)]/70">
              A gentle dues reminder, only if yours has lapsed.
            </p>
          </div>
        </div>
      </div>
    </FrameShell>
  );
}

export function CompanionAppMockup() {
  return (
    <FrameShell>
      <div className="relative h-64 w-32 overflow-hidden rounded-[1.75rem] border-4 border-[var(--frat-cream)]/15 bg-[var(--canvas)]">
        <div className="flex items-center justify-between px-3 pt-2 text-[var(--frat-cream)]/70">
          <span className="font-mono text-[7px]">9:41</span>
          <div className="flex items-center gap-1">
            <Signal className="h-2.5 w-2.5" strokeWidth={2} />
            <BatteryFull className="h-2.5 w-2.5" strokeWidth={2} />
          </div>
        </div>
        <div className="mt-2 flex items-center gap-1.5 border-b border-[var(--hairline)] px-3 pb-2">
          <div className="h-3 w-3 rounded-full bg-[var(--frat-gold)]" />
          <p className="font-mono text-[7px] tracking-[0.15em] text-[var(--frat-cream)] uppercase">EMC² Portal</p>
        </div>
        <div className="space-y-1.5 px-2 py-2">
          {["Villareal, M.", "Castillo, R.", "Manalo, J."].map((name) => (
            <div key={name} className="flex items-center gap-1.5 border border-[var(--hairline)] px-1.5 py-1">
              <div className="h-3.5 w-3.5 shrink-0 rounded-full bg-[var(--frat-gold)]/30" />
              <span className="truncate text-[6px] text-[var(--frat-cream)]/70">{name}</span>
            </div>
          ))}
        </div>
        <div className="absolute right-0 bottom-0 left-0 flex items-center justify-around border-t border-[var(--hairline)] bg-[var(--ink)] py-1.5">
          <Home className="h-3 w-3 text-[var(--frat-gold-light)]" strokeWidth={1.5} />
          <Users className="h-3 w-3 text-[var(--frat-cream)]/40" strokeWidth={1.5} />
          <Bell className="h-3 w-3 text-[var(--frat-cream)]/40" strokeWidth={1.5} />
        </div>
      </div>
    </FrameShell>
  );
}

export function AiArchiveMockup() {
  return (
    <FrameShell>
      <div className="w-full max-w-sm space-y-3">
        <div className="ml-auto max-w-[80%] border border-[var(--hairline)] bg-[var(--frat-gold)]/10 px-4 py-2.5">
          <p className="text-xs text-[var(--frat-cream)]/85">Who from Batch &rsquo;99-A is in engineering consultancy?</p>
        </div>
        <div className="mr-auto max-w-[85%] border border-[var(--hairline)] bg-[var(--canvas)] px-4 py-3">
          <div className="flex items-center gap-1.5 text-[var(--frat-gold-light)]">
            <Sparkles className="h-3 w-3" strokeWidth={1.5} />
            <span className="font-mono text-[8px] tracking-[0.15em] uppercase">Archive Copilot</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-[var(--frat-cream)]/80">
            Engr. Andres Buenaventura Lim, &rsquo;99-A &mdash; Managing Director of an engineering consultancy.
          </p>
          <p className="mt-2 font-mono text-[8px] tracking-[0.15em] text-[var(--frat-gold)]/70 uppercase">
            Source: Citations Register
          </p>
        </div>
      </div>
    </FrameShell>
  );
}
