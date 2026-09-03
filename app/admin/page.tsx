import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { adminConfigured, isAuthed } from "@/lib/admin/auth";
import { getAdminSupabase, CONTRIB_BUCKET } from "@/lib/supabase/server";
import { login, logout, moderate, grantMember, revokeMemberByHash } from "./actions";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const fmt = (iso: string) => new Date(iso).toISOString().slice(0, 16).replace("T", " ") + "Z";

const badge = (status: string) => {
  const tone =
    status === "approved" || status === "acknowledged"
      ? "text-[var(--frat-gold-light)] border-[var(--frat-gold)]/50"
      : status === "rejected"
      ? "text-red-300 border-red-500/40"
      : "text-[var(--frat-cream)]/70 border-[var(--hairline)]";
  return `inline-block border px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] uppercase ${tone}`;
};

const actionBtn =
  "border border-[var(--frat-gold)]/50 px-3 py-1.5 font-mono text-[10px] tracking-[0.2em] uppercase text-[var(--frat-gold-light)] transition-colors hover:border-[var(--frat-gold-light)] hover:bg-[var(--frat-gold)]/10";

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
      <h2 className="font-mono text-[11px] tracking-[0.3em] text-[var(--frat-gold-light)] uppercase">
        {title} ({count})
      </h2>
      {table && count > 0 ? (
        <a
          href={`/admin/export?table=${table}`}
          className="font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase underline-offset-4 transition-colors hover:text-[var(--frat-gold-light)] hover:underline"
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
        <h1 className="font-display text-3xl text-[var(--frat-cream)]">Admin is not configured</h1>
        <p className="mt-4 text-sm leading-relaxed text-[var(--frat-cream)]/70">
          Set <code className="text-[var(--frat-gold-light)]">ADMIN_PASSWORD</code> in your
          environment (Vercel → Project Settings → Environment Variables, and{" "}
          <code className="text-[var(--frat-gold-light)]">.env.local</code> for local dev) to unlock
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
        <h1 className="mt-6 font-display text-4xl text-[var(--frat-cream)]">Admin</h1>
        <form action={login} className="mt-10 max-w-sm space-y-4">
          <label htmlFor="password" className="block text-sm font-medium text-[var(--frat-cream)]/80">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoFocus
            className="w-full border border-[var(--border)] bg-white/5 px-4 py-3 text-sm text-[var(--frat-cream)] outline-none transition-colors focus:border-[var(--frat-gold)] focus:ring-2 focus:ring-[var(--frat-gold)]/30"
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
  const [contribRes, pledgeRes, messageRes, allowlistRes, rsvpRes, duesRes] = await Promise.all([
    supabase.from("contributions").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("pledges").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(100),
    supabase.from("member_allowlist").select("email_hash, label, batch, status, created_at").order("created_at", { ascending: false }).limit(200),
    supabase.from("anniversary_rsvps").select("*").order("created_at", { ascending: false }).limit(500),
    supabase.from("dues_payments").select("*").order("created_at", { ascending: false }).limit(200),
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
          <h1 className="mt-4 font-display text-3xl text-[var(--frat-cream)] md:text-4xl">Review queue</h1>
          <p className="mt-3 font-mono text-[11px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
            {pendingContrib} contribution{pendingContrib === 1 ? "" : "s"} · {pendingPledge} pledge
            {pendingPledge === 1 ? "" : "s"} · {pendingDues} dues record{pendingDues === 1 ? "" : "s"} pending
            · {rsvps.length} on the 58th list
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className={actionBtn}>
            Log out
          </button>
        </form>
      </div>

      {/* 58th Anniversary — the warm list. This is the reason the save-the-date
          page exists six months early; the committee needs to see it, and to
          get it into a spreadsheet, without asking a developer. */}
      <SectionHead title="58th Anniversary — save-the-date list" count={rsvps.length} table="anniversary_rsvps" />
      {rsvps.length === 0 ? (
        <p className="mt-6 text-sm text-[var(--frat-cream)]/60">No one on the list yet.</p>
      ) : (
        <>
          <dl className="mt-6 grid gap-px border border-[var(--hairline)] bg-[var(--hairline)] sm:grid-cols-3">
            {(["yes", "maybe", "cannot"] as const).map((a) => (
              <div key={a} className="bg-[var(--ink)] p-5">
                <dt className="font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase">
                  {ATTENDING_LABEL[a]}
                </dt>
                <dd className="mt-2 font-display text-3xl text-[var(--frat-gold-light)]">{rsvpCount(a)}</dd>
              </div>
            ))}
          </dl>
          {Object.keys(interestTally).length > 0 ? (
            <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
              Interested in:{" "}
              {Object.entries(interestTally)
                .sort((a, b) => b[1] - a[1])
                .map(([k, n]) => `${k} (${n})`)
                .join(" · ")}
            </p>
          ) : null}
          <div className="mt-6 overflow-x-auto border border-[var(--hairline)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--ink)] text-[var(--frat-cream)]/60">
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
                  <tr key={r.id} className="bg-[var(--canvas)] align-top">
                    <td className="px-4 py-2">
                      <p className="text-[var(--frat-cream)]">{r.name}{r.batch ? <span className="ml-2 font-mono text-[10px] text-[var(--frat-cream)]/60">{r.batch}</span> : null}</p>
                      <p className="text-xs text-[var(--frat-cream)]/60">{r.email}</p>
                      {r.message ? <p className="mt-1 max-w-sm whitespace-pre-wrap text-xs text-[var(--frat-cream)]/70">{r.message}</p> : null}
                    </td>
                    <td className="px-4 py-2"><span className={badge(r.attending === "yes" ? "approved" : r.attending)}>{ATTENDING_LABEL[r.attending]}</span></td>
                    <td className="px-4 py-2 text-[var(--frat-cream)]/80">{r.guests || "—"}</td>
                    <td className="px-4 py-2 font-mono text-[10px] tracking-[0.15em] text-[var(--frat-cream)]/70 uppercase">{r.interests?.length ? r.interests.join(", ") : "—"}</td>
                    <td className="px-4 py-2 text-[var(--frat-cream)]/80">{r.consent_updates ? "Yes" : "No"}</td>
                    <td className="px-4 py-2 font-mono text-xs text-[var(--frat-cream)]/60">{fmt(r.created_at)}</td>
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
          <p className="text-sm text-[var(--frat-cream)]/60">No contributions yet.</p>
        ) : (
          contributions.map((c) => (
            <article key={c.id} className="border border-[var(--hairline)] bg-[var(--ink)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={badge(c.status)}>{c.status}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                  {fmt(c.created_at)}
                </span>
              </div>
              <p className="mt-4 font-display text-xl text-[var(--frat-cream)]">{c.title}</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                {[c.name, c.batch, c.kind].filter(Boolean).join(" · ")} · {c.email}
              </p>
              <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-[var(--frat-cream)]/80">
                {c.details}
              </p>
              {c.links ? (
                <p className="mt-3 text-sm text-[var(--frat-cream)]/70">
                  Link:{" "}
                  <a href={c.links} target="_blank" rel="noreferrer" className="text-[var(--frat-gold-light)] underline underline-offset-4 break-all">
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
          <p className="text-sm text-[var(--frat-cream)]/60">No pledges yet.</p>
        ) : (
          pledges.map((p) => (
            <article key={p.id} className="border border-[var(--hairline)] bg-[var(--ink)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={badge(p.status)}>{p.status}</span>
                  {p.consent_public ? (
                    <span className="inline-block border border-[var(--frat-gold)]/50 px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-gold-light)] uppercase">
                      Public OK
                    </span>
                  ) : (
                    <span className="inline-block border border-[var(--hairline)] px-2 py-0.5 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                      Private
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                  {fmt(p.created_at)}
                </span>
              </div>
              <p className="mt-4 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                {[p.name, p.batch].filter(Boolean).join(" · ")} · {p.email}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-[var(--frat-cream)]/80 sm:grid-cols-3">
                <div><dt className="text-[var(--frat-cream)]/60">Cause</dt><dd>{p.cause || "—"}</dd></div>
                <div><dt className="text-[var(--frat-cream)]/60">Amount</dt><dd>{p.amount ? `₱${p.amount}` : "—"}</dd></div>
                <div><dt className="text-[var(--frat-cream)]/60">Reference</dt><dd className="break-all">{p.reference || "—"}</dd></div>
              </dl>
              {p.message ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--frat-cream)]/80">{p.message}</p>
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
          <p className="text-sm text-[var(--frat-cream)]/60">No dues recorded yet.</p>
        ) : (
          dues.map((d) => (
            <article key={d.id} className="border border-[var(--hairline)] bg-[var(--ink)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={badge(d.status)}>{d.status}</span>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                  {fmt(d.created_at)}
                </span>
              </div>
              <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                {[d.name, d.batch].filter(Boolean).join(" · ")} · {d.email}
              </p>
              <dl className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-[var(--frat-cream)]/80 sm:grid-cols-4">
                <div><dt className="text-[var(--frat-cream)]/60">Period</dt><dd>{d.period}</dd></div>
                <div><dt className="text-[var(--frat-cream)]/60">Amount</dt><dd>{d.amount ? `₱${d.amount}` : "—"}</dd></div>
                <div><dt className="text-[var(--frat-cream)]/60">Method</dt><dd>{d.method || "—"}</dd></div>
                <div><dt className="text-[var(--frat-cream)]/60">Reference</dt><dd className="break-all">{d.reference || "—"}</dd></div>
              </dl>
              {d.message ? (
                <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--frat-cream)]/80">{d.message}</p>
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
          <p className="text-sm text-[var(--frat-cream)]/60">No messages yet.</p>
        ) : (
          messages.map((m) => (
            <article key={m.id} className="border border-[var(--hairline)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                  {[m.name, m.topic].filter(Boolean).join(" · ")} · {m.email}
                </p>
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--frat-cream)]/60 uppercase">
                  {fmt(m.created_at)}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-[var(--frat-cream)]/80">{m.message}</p>
            </article>
          ))
        )}
      </div>

      {/* Portal access — the board's tool. The board verifies a brod against
          the roster held OFFLINE (never imported, per PRIVACY.md), then grants
          access. Only an HMAC hash + masked label + batch is stored. */}
      <SectionHead title="Portal access" count={allowlist.length} />
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[var(--frat-cream)]/70">
        Granting a brod adds their email to the hash-only allowlist and sends them
        an invite, so they can sign in at <code className="text-[var(--frat-gold-light)]">/portal</code>.
        Only a masked label and batch are stored here — never the raw roster data.
      </p>
      <form action={grantMember} className="mt-6 flex flex-wrap items-end gap-3">
        <div className="flex flex-col">
          <label htmlFor="grant-email" className="mb-1 text-xs text-[var(--frat-cream)]/60">Email</label>
          <input
            id="grant-email"
            name="email"
            type="email"
            required
            placeholder="brod@example.com"
            className="w-72 border border-[var(--border)] bg-white/5 px-3 py-2 text-sm text-[var(--frat-cream)] outline-none transition-colors focus:border-[var(--frat-gold)]"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="grant-batch" className="mb-1 text-xs text-[var(--frat-cream)]/60">Batch</label>
          <input
            id="grant-batch"
            name="batch"
            placeholder="&rsquo;84-F"
            className="w-28 border border-[var(--border)] bg-white/5 px-3 py-2 text-sm text-[var(--frat-cream)] outline-none transition-colors focus:border-[var(--frat-gold)]"
          />
        </div>
        <button type="submit" className={actionBtn}>Grant + invite</button>
      </form>
      {allowlist.length > 0 ? (
        <div className="mt-6 overflow-hidden border border-[var(--hairline)]">
          <table className="w-full text-left text-sm">
            <thead className="bg-[var(--ink)] text-[var(--frat-cream)]/60">
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
                <tr key={row.email_hash} className="bg-[var(--canvas)]">
                  <td className="px-4 py-2 font-mono text-xs text-[var(--frat-cream)]">
                    {row.label ?? `${row.email_hash.slice(0, 10)}…`}
                  </td>
                  <td className="px-4 py-2">{row.batch || "—"}</td>
                  <td className="px-4 py-2">
                    <span className={badge(row.status)}>{row.status}</span>
                  </td>
                  <td className="px-4 py-2 font-mono text-xs text-[var(--frat-cream)]/60">
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
        <p className="mt-6 text-sm text-[var(--frat-cream)]/60">
          No brothers granted access yet.
        </p>
      )}
    </Shell>
  );
}
