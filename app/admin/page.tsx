import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { adminConfigured, isAuthed } from "@/lib/admin/auth";
import { getAdminSupabase, CONTRIB_BUCKET } from "@/lib/supabase/server";
import { login, logout, moderate, grantMember, revokeMemberByHash, decideClaim, triageAssistance, addLedgerEntry, deleteLedgerEntry, screenNomination, updateSponsor } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const fmt = (iso: string) => new Date(iso).toISOString().slice(0, 16).replace("T", " ") + "Z";

const badge = (status: string) => {
  const tone =
    status === "approved" || status === "acknowledged"
      ? "text-[var(--brand)] border-[var(--frat-gold)]/50"
      : status === "rejected"
      ? "text-red-300 border-red-500/40"
      : "text-[var(--fg)]/70 border-[var(--hairline)]";
  return `inline-block border px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] uppercase ${tone}`;
};

const actionBtn =
  "border border-[var(--frat-gold)]/50 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--brand)] transition-colors hover:border-[var(--frat-gold-light)] hover:bg-[var(--frat-gold)]/10";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-[100svh] py-28">
      <Container className="max-w-4xl">{children}</Container>
    </section>
  );
}

/* Section heading with the one-click bridge to Google Sheets. */
function SectionHead({ title, count, table }: { title: string; count: number; table?: string }) {
  return (
    <div className="mt-16 flex items-end justify-between gap-4 border-b border-[var(--hairline)] pb-3">
      <h2 className="font-mono text-[11px] tracking-[0.3em] text-[var(--brand)] uppercase">
        {title} ({count})
      </h2>
      {table && count > 0 ? (
        <a
          href={`/admin/export?table=${table}`}
          className="font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase underline-offset-4 transition-colors hover:text-[var(--brand)] hover:underline"
        >
          Download CSV &darr;
        </a>
      ) : null}
    </div>
  );
}

function StatusForm({
  table,
  id,
  status,
  label,
}: {
  table: string;
  id: string;
  status: string;
  label: string;
}) {
  return (
    <form action={moderate}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="status" value={status} />
      <button type="submit" className={actionBtn}>
        {label}
      </button>
    </form>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (!adminConfigured()) {
    return (
      <Shell>
        <h1 className="font-display text-3xl text-[var(--fg)]">Admin is not configured</h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--fg)]/70">
          Set <code className="text-[var(--brand)]">ADMIN_PASSWORD</code> in your
          environment (Vercel → Project Settings → Environment Variables, and{" "}
          <code className="text-[var(--brand)]">.env.local</code> for local dev) to unlock
          the moderation queue.
        </p>
      </Shell>
    );
  }

  if (!(await isAuthed())) {
    const { error } = await searchParams;
    return (
      <Shell>
        <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
          The Register — Keeper&rsquo;s Entrance
        </p>
        <h1 className="mt-6 font-display text-4xl text-[var(--fg)]">Admin</h1>
        <form action={login} className="mt-10 max-w-sm space-y-4">
          <label htmlFor="password" className="block text-sm font-medium text-[var(--fg)]/80">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--fg)] outline-none transition-colors focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--frat-gold)]/30"
          />
          {error === "locked" ? (
            <p role="alert" className="text-sm text-red-400">
              Too many attempts — wait a few minutes and try again.
            </p>
          ) : error ? (
            <p role="alert" className="text-sm text-red-400">
              Incorrect password.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full bg-[var(--frat-gold)] px-6 py-3 font-mono text-xs font-semibold tracking-[0.25em] text-[#1a1305] uppercase transition-colors hover:bg-[var(--frat-gold-light)]"
          >
            Enter
          </button>
        </form>
      </Shell>
    );
  }

  const supabase = getAdminSupabase()!;
  const [contribRes, pledgeRes, messageRes, allowlistRes, rsvpRes, duesRes, claimRes, assistRes, ledgerRes, nominationRes, sponsorRes] = await Promise.all([
    supabase.from("contributions").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("pledges").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("member_allowlist").select("email_hash, label, batch, status, created_at").order("created_at", { ascending: false }).limit(200),
    supabase.from("anniversary_rsvps").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("dues_payments").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("membership_claims").select("*").order("created_at", { ascending: false }).limit(300),
    supabase.from("assistance_requests").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("assistance_ledger").select("*").order("entry_date", { ascending: false }).limit(100),
    supabase.from("award_nominations").select("*").order("created_at", { ascending: false }).limit(300),
    supabase.from("sponsor_enquiries").select("*").order("created_at", { ascending: false }).limit(300),
  ]);

  type Contribution = {
    id: string; created_at: string; status: string; name: string; batch: string | null;
    email: string; kind: string | null; title: string; details: string; links: string | null;
    photo_paths: string[];
  };
  type Pledge = {
    id: string; created_at: string; status: string; name: string; batch: string | null;
    email: string; cause: string | null; amount: string | null; reference: string | null; message: string | null;
    consent_public: boolean;
  };
  type Message = {
    id: string; created_at: string; name: string; email: string; topic: string | null; message: string;
  };

  const contributions = (contribRes.data ?? []) as Contribution[];
  const pledges = (pledgeRes.data ?? []) as Pledge[];
  const messages = (messageRes.data ?? []) as Message[];
  type AllowlistRow = {
    email_hash: string; label: string | null; batch: string | null; status: string; created_at: string;
  };
  const allowlist = (allowlistRes.data ?? []) as AllowlistRow[];
  type Rsvp = {
    id: string; created_at: string; name: string; batch: string | null; email: string;
    attending: "yes" | "maybe" | "cannot"; guests: string | null; interests: string[];
    message: string | null; consent_updates: boolean;
  };
  const rsvps = (rsvpRes.data ?? []) as Rsvp[];
  type Dues = {
    id: string; created_at: string; status: string; name: string; batch: string | null; email: string;
    period: string; amount: string | null; method: string | null; reference: string | null; message: string | null;
  };
  const dues = (duesRes.data ?? []) as Dues[];
  type Claim = {
    id: string; created_at: string; status: string; full_name: string; batch: string;
    email: string | null; label: string | null; nickname: string | null; vouch: string | null;
    note: string | null; decided_at: string | null; decided_note: string | null;
  };
  const claims = (claimRes.data ?? []) as Claim[];
  const pendingClaims = claims.filter((c) => c.status === "pending");
  type AssistanceRequest = {
    id: string; created_at: string; status: string; name: string; batch: string | null;
    email: string; phone: string | null; relation: string; kind: string; summary: string;
    amount_needed: string | null; urgency: string | null; board_note: string | null;
  };
  const assistance = (assistRes.data ?? []) as AssistanceRequest[];
  const openAssistance = assistance.filter((a) => a.status === "received" || a.status === "reviewing");
  type LedgerRow = {
    id: string; entry_date: string; direction: "raised" | "disbursed"; amount: string | number;
    note: string | null; beneficiaries: number;
  };
  const ledger = (ledgerRes.data ?? []) as LedgerRow[];
  const ledgerSum = (d: "raised" | "disbursed") =>
    ledger.filter((l) => l.direction === d).reduce((n, l) => n + Number(l.amount), 0);
  const money = (n: number) =>
    new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", maximumFractionDigits: 0 }).format(n);
  type Nomination = {
    id: string; created_at: string; status: string; category: string;
    nominee_name: string; nominee_batch: string | null; nominee_email: string | null;
    nominee_known: string | null; citation: string; evidence: string | null;
    nominator_name: string; nominator_batch: string | null; nominator_email: string;
    screening_note: string | null;
  };
  const nominations = (nominationRes.data ?? []) as Nomination[];
  const openNominations = nominations.filter((n) => n.status === "received" || n.status === "screening");
  const byCategory = nominations.reduce<Record<string, number>>(
    (acc, n) => ({ ...acc, [n.category]: (acc[n.category] ?? 0) + 1 }),
    {}
  );
  type Sponsor = {
    id: string; created_at: string; stage: string; organisation: string; contact_name: string;
    email: string; phone: string | null; introduced_by: string | null; interest: string;
    tier: string | null; amount_expected: string | number | null; amount_paid: string | number;
    message: string | null; committee_note: string | null;
  };
  const sponsors = (sponsorRes.data ?? []) as Sponsor[];
  const openSponsors = sponsors.filter((s) => s.stage !== "paid" && s.stage !== "declined");
  // PLAN section 5: pipeline is not revenue. Shown side by side so the gap is
  // impossible to overlook, which is the 2025 Sportsfest lesson.
  const pipelineValue = sponsors
    .filter((s) => s.stage !== "declined" && s.stage !== "paid")
    .reduce((n, s) => n + Number(s.amount_expected ?? 0), 0);
  const collected = sponsors.reduce((n, s) => n + Number(s.amount_paid ?? 0), 0);

  // The committee's numbers at a glance: headcount and who to call first.
  const rsvpCount = (a: Rsvp["attending"]) => rsvps.filter((r) => r.attending === a).length;
  const interestTally = rsvps
    .flatMap((r) => r.interests ?? [])
    .reduce<Record<string, number>>((acc, k) => ({ ...acc, [k]: (acc[k] ?? 0) + 1 }), {});
  const ATTENDING_LABEL: Record<Rsvp["attending"], string> = {
    yes: "Coming",
    maybe: "Likely",
    cannot: "Can't, keep informed",
  };

  // Signed URLs for every contributed photo (private bucket).
  const allPaths = contributions.flatMap((c) => c.photo_paths ?? []);
  const signed: Record<string, string> = {};
  if (allPaths.length) {
    const { data } = await supabase.storage.from(CONTRIB_BUCKET).createSignedUrls(allPaths, 3600);
    (data ?? []).forEach((s) => {
      if (s.path && s.signedUrl) signed[s.path] = s.signedUrl;
    });
  }

  const pendingContrib = contributions.filter((c) => c.status === "pending").length;
  const pendingPledge = pledges.filter((p) => p.status === "pending").length;
  const pendingDues = dues.filter((d) => d.status === "pending").length;

  return (
    <Shell>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">
            The Register — Moderation
          </p>
          <h1 className="mt-4 display text-[2rem] md:text-[2.75rem]">Review queue</h1>
          <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
            {pendingContrib} contribution{pendingContrib === 1 ? "" : "s"} · {pendingPledge} pledge
            {pendingPledge === 1 ? "" : "s"} · {pendingDues} dues record{pendingDues === 1 ? "" : "s"} pending
            · {rsvps.length} on the 58th list · {pendingClaims.length} claim
            {pendingClaims.length === 1 ? "" : "s"} to verify ·{" "}
            {openAssistance.length} assistance request
            {openAssistance.length === 1 ? "" : "s"} open ·{" "}
            {openNominations.length} nomination
            {openNominations.length === 1 ? "" : "s"} to screen ·{" "}
            {openSponsors.length} sponsor{openSponsors.length === 1 ? "" : "s"} in play
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className={actionBtn}>
            Log out
          </button>
        </form>
      </div>

      {/* Portal claims. First in the queue because someone is waiting on the
          other end, and because approving is the whole grant: allowlist,
          invite, and close, in one click. Verify against the roster held
          OFFLINE before approving — nothing here can check it for you. */}
      <SectionHead title="Portal claims to verify" count={pendingClaims.length} table="membership_claims" />
      {pendingClaims.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--fg)]/60">
          No claims waiting. Brods claim their record at{" "}
          <code className="text-[var(--brand)]">/portal/claim</code>.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {pendingClaims.map((c) => (
            <article key={c.id} className="rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="font-sans text-[19px] font-bold text-[var(--fg)]">
                    {c.full_name}
                    {c.nickname ? <span className="font-normal text-[var(--fg)]/60"> &ldquo;{c.nickname}&rdquo;</span> : null}
                  </p>
                  <p className="mt-1 font-mono text-[11px] tracking-[0.15em] text-[var(--fg)]/60 uppercase">
                    Batch {c.batch} · {c.email ?? c.label ?? "—"}
                  </p>
                </div>
                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/45 uppercase">
                  {new Date(c.created_at).toLocaleDateString("en-PH", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>

              {c.vouch ? (
                <p className="mt-3 text-[14px] text-[var(--fg)]/70">
                  <span className="text-[var(--fg)]/50">Vouched by:</span> {c.vouch}
                </p>
              ) : null}
              {c.note ? (
                <p className="mt-2 text-[14px] leading-relaxed whitespace-pre-wrap text-[var(--fg)]/70">{c.note}</p>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--hairline)] pt-4">
                <form action={decideClaim} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="email" value={c.email ?? ""} />
                  <input type="hidden" name="batch" value={c.batch} />
                  <input type="hidden" name="decision" value="approved" />
                  <button type="submit" className={actionBtn}>
                    Approve &amp; invite
                  </button>
                </form>
                <form action={decideClaim} className="flex flex-wrap items-center gap-2">
                  <input type="hidden" name="id" value={c.id} />
                  <input type="hidden" name="decision" value="rejected" />
                  <input
                    type="text"
                    name="note"
                    maxLength={500}
                    placeholder="Reason (optional, for the record)"
                    className="rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                  />
                  <button type="submit" className={actionBtn}>
                    Reject
                  </button>
                </form>
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-[0.15em] text-[var(--fg)]/40 uppercase">
                Check against the offline roster before approving
              </p>
            </article>
          ))}
        </div>
      )}

      {/* The Assistance Fund. Above the anniversary list because someone is in
          hospital. These rows are the most sensitive in the database — a
          summary may name an illness or a death in the family — and they
          appear nowhere else in the application. */}
      <SectionHead title="Assistance requests" count={openAssistance.length} />
      {assistance.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--fg)]/60">
          No requests. Brods ask at <code className="text-[var(--brand)]">/portal/assistance</code>.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {assistance.map((a) => (
            <article key={a.id} className="rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="font-sans text-[19px] font-bold text-[var(--fg)]">
                    {a.name}
                    {a.batch ? <span className="font-normal text-[var(--fg)]/60"> · {a.batch}</span> : null}
                  </p>
                  <p className="mt-1 font-mono text-[11px] tracking-[0.15em] text-[var(--fg)]/60 uppercase">
                    {a.kind} · for {a.relation} · {a.urgency ?? "no urgency given"}
                  </p>
                </div>
                <span className={badge(a.status)}>{a.status}</span>
              </div>

              <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap text-[var(--fg)]/80">{a.summary}</p>

              <dl className="mt-4 grid gap-x-8 gap-y-2 text-[13px] sm:grid-cols-2">
                <div className="flex gap-2">
                  <dt className="text-[var(--fg)]/50">Contact</dt>
                  <dd className="text-[var(--fg)]/80">{a.email}{a.phone ? ` · ${a.phone}` : ""}</dd>
                </div>
                {a.amount_needed ? (
                  <div className="flex gap-2">
                    <dt className="text-[var(--fg)]/50">Amount that would help</dt>
                    <dd className="text-[var(--fg)]/80">{a.amount_needed}</dd>
                  </div>
                ) : null}
              </dl>
              {a.board_note ? (
                <p className="mt-3 border-l-2 border-[var(--frat-gold)]/50 pl-4 text-[14px] text-[var(--fg)]/70">
                  {a.board_note}
                </p>
              ) : null}

              <form action={triageAssistance} className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--hairline)] pt-4">
                <input type="hidden" name="id" value={a.id} />
                <input
                  type="text"
                  name="board_note"
                  maxLength={2000}
                  placeholder="Board note (private)"
                  className="min-w-[14rem] flex-1 rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                />
                <select
                  name="status"
                  defaultValue={a.status}
                  className="rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                >
                  {["received", "reviewing", "assisted", "declined", "closed"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button type="submit" className={actionBtn}>Save</button>
              </form>
            </article>
          ))}
        </div>
      )}

      {/* Sponsorship pipeline. Expected and collected are shown apart, always:
          PLAN section 5's rule is that unsigned and unpaid pledges are not
          available cash, and the 2025 Sportsfest is why. */}
      <SectionHead title="Sponsorship pipeline" count={sponsors.length} table="sponsor_enquiries" />
      <p className="mt-4 text-sm text-[var(--fg)]/60">
        In play {money(pipelineValue)} · <strong className="text-[var(--fg)]">collected {money(collected)}</strong>.
        Only collected is money. Do not commit spending against the first figure.
      </p>
      {sponsors.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--fg)]/60">
          No enquiries yet. The prospectus is at <code className="text-[var(--brand)]">/sponsorship</code>.
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {sponsors.map((s) => (
            <article key={s.id} className="rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <div>
                  <p className="font-sans text-[19px] font-bold text-[var(--fg)]">{s.organisation}</p>
                  <p className="mt-1 font-mono text-[11px] tracking-[0.15em] text-[var(--fg)]/60 uppercase">
                    {s.contact_name} · {s.email}
                    {s.phone ? ` · ${s.phone}` : ""}
                  </p>
                </div>
                <span className={badge(s.stage === "paid" ? "acknowledged" : s.stage === "declined" ? "rejected" : "pending")}>
                  {s.stage.replace("_", " ")}
                </span>
              </div>

              <dl className="mt-4 grid gap-x-8 gap-y-2 text-[13px] sm:grid-cols-2">
                <div className="flex gap-2">
                  <dt className="text-[var(--fg)]/50">Interest</dt>
                  <dd className="text-[var(--fg)]/80">{s.interest}{s.tier ? ` · ${s.tier}` : ""}</dd>
                </div>
                {s.introduced_by ? (
                  <div className="flex gap-2">
                    <dt className="text-[var(--fg)]/50">Introduced by</dt>
                    <dd className="text-[var(--fg)]/80">{s.introduced_by}</dd>
                  </div>
                ) : null}
                <div className="flex gap-2">
                  <dt className="text-[var(--fg)]/50">Expected</dt>
                  <dd className="text-[var(--fg)]/80">{s.amount_expected ? money(Number(s.amount_expected)) : "—"}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-[var(--fg)]/50">Collected</dt>
                  <dd className="font-semibold text-[var(--fg)]">{money(Number(s.amount_paid ?? 0))}</dd>
                </div>
              </dl>

              {s.message ? (
                <p className="mt-3 text-[14px] leading-relaxed whitespace-pre-wrap text-[var(--fg)]/70">{s.message}</p>
              ) : null}
              {s.committee_note ? (
                <p className="mt-3 border-l-2 border-[var(--frat-gold)]/50 pl-4 text-[14px] text-[var(--fg)]/70">
                  {s.committee_note}
                </p>
              ) : null}

              <form action={updateSponsor} className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--hairline)] pt-4">
                <input type="hidden" name="id" value={s.id} />
                <input
                  type="text"
                  name="committee_note"
                  maxLength={2000}
                  placeholder="Committee note"
                  className="min-w-[12rem] flex-1 rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                />
                <input
                  type="text"
                  name="amount_paid"
                  placeholder="Collected ₱"
                  className="w-32 rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                />
                <select
                  name="stage"
                  defaultValue={s.stage}
                  className="rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                >
                  {["enquiry", "proposal_sent", "committed", "paid", "declined"].map((v) => (
                    <option key={v} value={v}>{v.replace("_", " ")}</option>
                  ))}
                </select>
                <button type="submit" className={actionBtn}>Save</button>
              </form>
            </article>
          ))}
        </div>
      )}


      {/* The public ledger. Everything entered here appears on /assistance. */}
      <SectionHead title="Assistance ledger — published publicly" count={ledger.length} />
      <p className="mt-4 text-sm text-[var(--fg)]/60">
        Raised {money(ledgerSum("raised"))} · disbursed {money(ledgerSum("disbursed"))} · balance{" "}
        {money(ledgerSum("raised") - ledgerSum("disbursed"))}. Notes here are <strong>public</strong>:
        write &ldquo;hospitalisation assistance&rdquo;, never a name.
      </p>

      <form action={addLedgerEntry} className="mt-5 flex flex-wrap items-end gap-2 rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-4">
        <label className="text-[12px] text-[var(--fg)]/60">
          Date
          <input type="date" name="entry_date" className="mt-1 block rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)]" />
        </label>
        <label className="text-[12px] text-[var(--fg)]/60">
          Direction
          <select name="direction" className="mt-1 block rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)]">
            <option value="raised">raised</option>
            <option value="disbursed">disbursed</option>
          </select>
        </label>
        <label className="text-[12px] text-[var(--fg)]/60">
          Amount (PHP)
          <input type="text" name="amount" required placeholder="5000" className="mt-1 block w-28 rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)]" />
        </label>
        <label className="text-[12px] text-[var(--fg)]/60">
          Brods helped
          <input type="text" name="beneficiaries" placeholder="0" className="mt-1 block w-24 rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)]" />
        </label>
        <label className="min-w-[12rem] flex-1 text-[12px] text-[var(--fg)]/60">
          Public note
          <input type="text" name="note" maxLength={200} placeholder="Hospitalisation assistance" className="mt-1 block w-full rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)]" />
        </label>
        <button type="submit" className={actionBtn}>Add entry</button>
      </form>

      {ledger.length > 0 ? (
        <div className="mt-4 border-t border-[var(--hairline)]">
          {ledger.map((l) => (
            <div key={l.id} className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] py-3">
              <span className="font-mono text-[11px] tracking-[0.15em] text-[var(--fg)]/60 uppercase">
                {l.entry_date} · {l.direction}
                {l.beneficiaries ? ` · ${l.beneficiaries} helped` : ""}
              </span>
              <span className="flex items-center gap-4">
                <span className="text-[14px] text-[var(--fg)]/80">{l.note ?? "—"}</span>
                <span className="text-[14px] font-semibold tabular-nums text-[var(--fg)]">{money(Number(l.amount))}</span>
                <form action={deleteLedgerEntry}>
                  <input type="hidden" name="id" value={l.id} />
                  <button type="submit" className={actionBtn}>Delete</button>
                </form>
              </span>
            </div>
          ))}
        </div>
      ) : null}

      {/* Award nominations. Screening happens here; judging happens off this
          page, from the CSV, which deliberately omits screening_note. */}
      <SectionHead title="Award nominations" count={nominations.length} table="award_nominations" />
      {nominations.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--fg)]/60">
          No nominations yet. They open at <code className="text-[var(--brand)]">/awards</code> when the
          board flips <code className="text-[var(--brand)]">awards.nominationsOpen</code>.
        </p>
      ) : (
        <>
          <div className="mt-6 flex flex-wrap gap-2">
            {Object.entries(byCategory).map(([cat, n]) => (
              <span key={cat} className="border border-[var(--hairline)] px-3 py-1 font-mono text-[10px] tracking-[0.15em] text-[var(--fg)]/70 uppercase">
                {cat} · {n}
              </span>
            ))}
          </div>
          <div className="mt-6 space-y-4">
            {nominations.map((n) => (
              <article key={n.id} className="rounded-2xl border border-[var(--hairline)] bg-[var(--card)] p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <div>
                    <p className="font-sans text-[19px] font-bold text-[var(--fg)]">
                      {n.nominee_name}
                      {n.nominee_batch ? <span className="font-normal text-[var(--fg)]/60"> · {n.nominee_batch}</span> : null}
                    </p>
                    <p className="mt-1 font-mono text-[11px] tracking-[0.15em] text-[var(--fg)]/60 uppercase">
                      {n.category}
                    </p>
                  </div>
                  <span className={badge(n.status)}>{n.status}</span>
                </div>

                {n.nominee_known ? (
                  <p className="mt-2 text-[14px] text-[var(--fg)]/70">{n.nominee_known}</p>
                ) : null}
                <p className="mt-4 text-[15px] leading-relaxed whitespace-pre-wrap text-[var(--fg)]/80">{n.citation}</p>
                {n.evidence ? (
                  <p className="mt-3 text-[14px] leading-relaxed whitespace-pre-wrap text-[var(--fg)]/60">
                    <span className="text-[var(--fg)]/45">Evidence: </span>
                    {n.evidence}
                  </p>
                ) : null}
                <p className="mt-4 font-mono text-[11px] tracking-[0.15em] text-[var(--fg)]/55 uppercase">
                  Nominated by {n.nominator_name}
                  {n.nominator_batch ? ` · ${n.nominator_batch}` : ""} · {n.nominator_email}
                </p>
                {n.screening_note ? (
                  <p className="mt-3 border-l-2 border-[var(--frat-gold)]/50 pl-4 text-[14px] text-[var(--fg)]/70">
                    {n.screening_note}
                  </p>
                ) : null}

                <form action={screenNomination} className="mt-5 flex flex-wrap items-center gap-2 border-t border-[var(--hairline)] pt-4">
                  <input type="hidden" name="id" value={n.id} />
                  <input
                    type="text"
                    name="screening_note"
                    maxLength={2000}
                    placeholder="Screening note (committee only)"
                    className="min-w-[14rem] flex-1 rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                  />
                  <select
                    name="status"
                    defaultValue={n.status}
                    className="rounded-lg border border-[var(--hairline)] bg-[var(--paper)] px-3 py-2 text-[13px] text-[var(--fg)] outline-none focus:border-[var(--brand)]"
                  >
                    {["received", "screening", "shortlisted", "declined", "judged"].map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                  <button type="submit" className={actionBtn}>Save</button>
                </form>
              </article>
            ))}
          </div>
        </>
      )}


      {/* 58th Anniversary — the warm list. This is the reason the save-the-date
          page exists six months early; the committee needs to see it, and to
          get it into a spreadsheet, without asking a developer. */}
      <SectionHead title="58th Anniversary — save-the-date list" count={rsvps.length} table="anniversary_rsvps" />
      {rsvps.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--fg)]/60">No one on the list yet.</p>
      ) : (
        <>
          <dl className="mt-6 grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-3">
            {(["yes", "maybe", "cannot"] as const).map((a) => (
              <div key={a} className="bg-[var(--tint)] p-5">
                <dt className="font-mono text-[10px] tracking-[0.25em] text-[var(--fg)]/60 uppercase">
                  {ATTENDING_LABEL[a]}
                </dt>
                <dd className="mt-2 font-display text-3xl text-[var(--brand)]">{rsvpCount(a)}</dd>
              </div>
            ))}
          </dl>
          {Object.keys(interestTally).length > 0 ? (
            <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.2em] text-[var(--fg)]/60 uppercase">
              Interested in:{" "}
              {Object.entries(interestTally)
                .sort((a, b) => b[1] - a[1])
                .map(([k, n]) => `${k} (${n})`)
                .join(" · ")}
            </p>
          ) : null}
          <div className="mt-6 overflow-x-auto border border-[var(--hairline)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--tint)] text-[var(--fg)]/60">
                <tr className="font-mono text-[10px] tracking-[0.2em] uppercase">
                  <th className="px-4 py-2 font-normal">Brod</th>
                  <th className="px-4 py-2 font-normal">Coming?</th>
                  <th className="px-4 py-2 font-normal">Guests</th>
                  <th className="px-4 py-2 font-normal">Interests</th>
                  <th className="px-4 py-2 font-normal">Updates</th>
                  <th className="px-4 py-2 font-normal">When</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hairline)]">
                {rsvps.map((r) => (
                  <tr key={r.id} className="bg-[var(--paper)] align-top">
                    <td className="px-4 py-2">
                      <p className="text-[var(--fg)]">{r.name}{r.batch ? <span className="ml-2 font-mono text-[10px] text-[var(--fg)]/60">{r.batch}</span> : null}</p>
                      <p className="text-xs text-[var(--fg)]/60">{r.email}</p>
                      {r.message ? <p className="mt-1 max-w-sm whitespace-pre-wrap text-xs text-[var(--fg)]/70">{r.message}</p> : null}
                    </td>
                    <td className="px-4 py-2"><span className={badge(r.attending === "yes" ? "approved" : r.attending)}>{ATTENDING_LABEL[r.attending]}</span></td>
                    <td className="px-4 py-2 text-[var(--fg)]/80">{r.guests || "—"}</td>
                    <td className="px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-[var(--fg)]/70 uppercase">{r.interests?.length ? r.interests.join(", ") : "—"}</td>
                    <td className="px-4 py-2 text-[var(--fg)]/80">{r.consent_updates ? "Yes" : "No"}</td>
                    <td className="px-4 py-2 font-mono text-xs text-[var(--fg)]/60">{fmt(r.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Contributions */}
      <SectionHead title="Contributions" count={contributions.length} table="contributions" />
      <div className="mt-6 space-y-6">
        {contributions.length === 0 ? (
          <p className="text-sm text-[var(--fg)]/60">No contributions yet.</p>
        ) : (
          contributions.map((c) => (
            <article key={c.id} className="border border-[var(--hairline)] bg-[var(--tint)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={badge(c.status)}>{c.status}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
                  {fmt(c.created_at)}
                </span>
              </div>
              <p className="mt-4 font-display text-xl text-[var(--fg)]">{c.title}</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
                {[c.name, c.batch, c.kind].filter(Boolean).join(" · ")} · {c.email}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--fg)]/80">
                {c.details}
              </p>
              {c.links ? (
                <p className="mt-3 text-sm text-[var(--fg)]/70">
                  Link:{" "}
                  <a href={c.links} target="_blank" rel="noreferrer" className="text-[var(--brand)] underline underline-offset-4 break-all">
                    {c.links}
                  </a>
                </p>
              ) : null}
              {c.photo_paths?.length ? (
                <div className="mt-4 flex flex-wrap gap-3">
                  {c.photo_paths.map((p) =>
                    signed[p] ? (
                      <a key={p} href={signed[p]} target="_blank" rel="noreferrer">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={signed[p]} alt="" className="h-24 w-24 border border-[var(--hairline)] object-cover" />
                      </a>
                    ) : null
                  )}
                </div>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                {c.status !== "approved" ? <StatusForm table="contributions" id={c.id} status="approved" label="Approve" /> : null}
                {c.status !== "rejected" ? <StatusForm table="contributions" id={c.id} status="rejected" label="Reject" /> : null}
                {c.status !== "pending" ? <StatusForm table="contributions" id={c.id} status="pending" label="Reset" /> : null}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Pledges */}
      <SectionHead title="Pledges" count={pledges.length} table="pledges" />
      <div className="mt-6 space-y-6">
        {pledges.length === 0 ? (
          <p className="text-sm text-[var(--fg)]/60">No pledges yet.</p>
        ) : (
          pledges.map((p) => (
            <article key={p.id} className="border border-[var(--hairline)] bg-[var(--tint)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={badge(p.status)}>{p.status}</span>
                  {p.consent_public ? (
                    <span className="inline-block border border-[var(--frat-gold)]/50 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-[var(--brand)] uppercase">
                      Public OK
                    </span>
                  ) : (
                    <span className="inline-block border border-[var(--hairline)] px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
                      Private
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
                  {fmt(p.created_at)}
                </span>
              </div>
              <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
                {[p.name, p.batch].filter(Boolean).join(" · ")} · {p.email}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-[var(--fg)]/80 sm:grid-cols-3">
                <div><dt className="text-[var(--fg)]/60">Cause</dt><dd>{p.cause || "—"}</dd></div>
                <div><dt className="text-[var(--fg)]/60">Amount</dt><dd>{p.amount ? `₱${p.amount}` : "—"}</dd></div>
                <div><dt className="text-[var(--fg)]/60">Reference</dt><dd className="break-all">{p.reference || "—"}</dd></div>
              </dl>
              {p.message ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--fg)]/80">{p.message}</p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-3">
                {p.status !== "acknowledged" ? <StatusForm table="pledges" id={p.id} status="acknowledged" label="Mark acknowledged" /> : null}
                {p.status !== "pending" ? <StatusForm table="pledges" id={p.id} status="pending" label="Reset" /> : null}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Dues — the Portal's manual-reconciliation records. The treasurer
          matches the reference number against the Association's own GCash /
          bank history, then acknowledges here. */}
      <SectionHead title="Membership dues" count={dues.length} table="dues_payments" />
      <div className="mt-6 space-y-4">
        {dues.length === 0 ? (
          <p className="text-sm text-[var(--fg)]/60">No dues recorded yet.</p>
        ) : (
          dues.map((d) => (
            <article key={d.id} className="border border-[var(--hairline)] bg-[var(--tint)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={badge(d.status)}>{d.status}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
                  {fmt(d.created_at)}
                </span>
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
                {[d.name, d.batch].filter(Boolean).join(" · ")} · {d.email}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-[var(--fg)]/80 sm:grid-cols-4">
                <div><dt className="text-[var(--fg)]/60">Period</dt><dd>{d.period}</dd></div>
                <div><dt className="text-[var(--fg)]/60">Amount</dt><dd>{d.amount ? `₱${d.amount}` : "—"}</dd></div>
                <div><dt className="text-[var(--fg)]/60">Method</dt><dd>{d.method || "—"}</dd></div>
                <div><dt className="text-[var(--fg)]/60">Reference</dt><dd className="break-all">{d.reference || "—"}</dd></div>
              </dl>
              {d.message ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--fg)]/80">{d.message}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-3">
                {d.status !== "acknowledged" ? <StatusForm table="dues_payments" id={d.id} status="acknowledged" label="Mark acknowledged" /> : null}
                {d.status !== "pending" ? <StatusForm table="dues_payments" id={d.id} status="pending" label="Reset" /> : null}
              </div>
            </article>
          ))
        )}
      </div>

      {/* Messages */}
      <SectionHead title="Messages" count={messages.length} table="messages" />
      <div className="mt-6 space-y-4">
        {messages.length === 0 ? (
          <p className="text-sm text-[var(--fg)]/60">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <article key={m.id} className="border border-[var(--hairline)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
                  {[m.name, m.topic].filter(Boolean).join(" · ")} · {m.email}
                </p>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--fg)]/60 uppercase">
                  {fmt(m.created_at)}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--fg)]/80">{m.message}</p>
            </article>
          ))
        )}
      </div>

      {/* Portal access — the board's tool. The board verifies a brod against
          the roster held OFFLINE (never imported, per PRIVACY.md), then grants
          access. Only an HMAC hash + masked label + batch is stored. */}
      <SectionHead title="Portal access" count={allowlist.length} />
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--fg)]/70">
        Granting a brod adds their email to the hash-only allowlist and sends them
        an invite, so they can sign in at <code className="text-[var(--brand)]">/portal</code>.
        Only a masked label and batch are stored here — never the raw roster data.
      </p>
      <form action={grantMember} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label htmlFor="grant-email" className="mb-1 text-xs text-[var(--fg)]/60">Email</label>
          <input
            id="grant-email"
            name="email"
            type="email"
            required
            placeholder="brod@example.com"
            className="w-72 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] outline-none transition-colors focus:border-[var(--brand)]"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="grant-batch" className="mb-1 text-xs text-[var(--fg)]/60">Batch</label>
          <input
            id="grant-batch"
            name="batch"
            placeholder="&rsquo;84-F"
            className="w-28 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-sm text-[var(--fg)] outline-none transition-colors focus:border-[var(--brand)]"
          />
        </div>
        <button type="submit" className={actionBtn}>Grant + invite</button>
      </form>
      {allowlist.length > 0 ? (
        <div className="mt-6 overflow-hidden border border-[var(--hairline)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--tint)] text-[var(--fg)]/60">
              <tr className="font-mono text-[10px] tracking-[0.2em] uppercase">
                <th className="px-4 py-2 font-normal">Member (masked)</th>
                <th className="px-4 py-2 font-normal">Batch</th>
                <th className="px-4 py-2 font-normal">Status</th>
                <th className="px-4 py-2 font-normal">Granted</th>
                <th className="px-4 py-2 text-right font-normal">Revoke</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--hairline)]">
              {allowlist.map((row) => (
                <tr key={row.email_hash} className="bg-[var(--paper)]">
                  <td className="px-4 py-2 font-mono text-xs text-[var(--fg)]">
                    {row.label ?? `${row.email_hash.slice(0, 10)}…`}
                  </td>
                  <td className="px-4 py-2">{row.batch || "—"}</td>
                  <td className="px-4 py-2">
                    <span className={badge(row.status)}>{row.status}</span>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-[var(--fg)]/60">
                    {fmt(row.created_at)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <form action={revokeMemberByHash}>
                      <input type="hidden" name="hash" value={row.email_hash} />
                      <button type="submit" className={actionBtn}>Revoke</button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mt-6 text-sm text-[var(--fg)]/60">
          No brothers granted access yet.
        </p>
      )}
    </Shell>
  );
}
