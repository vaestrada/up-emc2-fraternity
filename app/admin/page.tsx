import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { adminConfigured, isAuthed } from "@/lib/admin/auth";
import { getAdminSupabase, CONTRIB_BUCKET } from "@/lib/supabase/server";
import { login, logout, moderate } from "./actions";

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
          {error ? <p className="text-sm text-red-400">Incorrect password.</p> : null}
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
  const [contribRes, pledgeRes, messageRes] = await Promise.all([
    supabase.from("contributions").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("pledges").select("*").order("created_at", { ascending: false }).limit(200),
    supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  type Contribution = {
    id: string; created_at: string; status: string; name: string; batch: string | null;
    email: string; kind: string | null; title: string; details: string; links: string | null;
    photo_paths: string[];
  };
  type Pledge = {
    id: string; created_at: string; status: string; name: string; batch: string | null;
    email: string; cause: string | null; amount: string | null; reference: string | null; message: string | null;
  };
  type Message = {
    id: string; created_at: string; name: string; email: string; topic: string | null; message: string;
  };

  const contributions = (contribRes.data ?? []) as Contribution[];
  const pledges = (pledgeRes.data ?? []) as Pledge[];
  const messages = (messageRes.data ?? []) as Message[];

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
            {pendingPledge === 1 ? "" : "s"} pending
          </p>
        </div>
        <form action={logout}>
          <button type="submit" className={actionBtn}>
            Log out
          </button>
        </form>
      </div>

      {/* Contributions */}
      <h2 className="mt-16 border-b border-[var(--hairline)] pb-3 font-mono text-[11px] tracking-[0.3em] text-[var(--frat-gold-light)] uppercase">
        Contributions ({contributions.length})
      </h2>
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
      <h2 className="mt-16 border-b border-[var(--hairline)] pb-3 font-mono text-[11px] tracking-[0.3em] text-[var(--frat-gold-light)] uppercase">
        Pledges ({pledges.length})
      </h2>
      <div className="mt-6 space-y-6">
        {pledges.length === 0 ? (
          <p className="text-sm text-[var(--frat-cream)]/60">No pledges yet.</p>
        ) : (
          pledges.map((p) => (
            <article key={p.id} className="border border-[var(--hairline)] bg-[var(--ink)] p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className={badge(p.status)}>{p.status}</span>
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

      {/* Messages */}
      <h2 className="mt-16 border-b border-[var(--hairline)] pb-3 font-mono text-[11px] tracking-[0.3em] text-[var(--frat-gold-light)] uppercase">
        Messages ({messages.length})
      </h2>
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
    </Shell>
  );
}
