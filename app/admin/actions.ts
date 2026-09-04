"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { verifyPassword, startSession, endSession, isAuthed } from "@/lib/admin/auth";
import { getAdminSupabase } from "@/lib/supabase/server";

/* Best-effort per-IP throttle on failed admin logins, to blunt password
   brute-force. In-memory (resets on redeploy), which is acceptable as
   defense-in-depth behind an already-strong shared password. */
const LOGIN_WINDOW_MS = 10 * 60 * 1000;
const LOGIN_MAX_FAILS = 8;
const loginFails = new Map<string, { count: number; first: number }>();

async function requestIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

export async function login(formData: FormData): Promise<void> {
  const ip = await requestIp();
  const now = Date.now();
  const rec = loginFails.get(ip);
  const windowActive = rec && now - rec.first < LOGIN_WINDOW_MS;

  if (windowActive && rec!.count >= LOGIN_MAX_FAILS) {
    redirect("/admin?error=locked");
  }

  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    if (windowActive) rec!.count += 1;
    else loginFails.set(ip, { count: 1, first: now });
    if (loginFails.size > 500) {
      for (const [key, v] of loginFails) if (now - v.first >= LOGIN_WINDOW_MS) loginFails.delete(key);
    }
    redirect("/admin?error=1");
  }

  loginFails.delete(ip);
  await startSession();
  redirect("/admin");
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/admin");
}

const ALLOWED: Record<string, string[]> = {
  contributions: ["pending", "approved", "rejected"],
  pledges: ["pending", "acknowledged"],
  dues_payments: ["pending", "acknowledged"],
};

export async function moderate(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const table = String(formData.get("table") ?? "");
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!ALLOWED[table]?.includes(status) || !id) return;

  const supabase = getAdminSupabase();
  if (!supabase) return;
  await supabase.from(table).update({ status }).eq("id", id);
  revalidatePath("/admin");
  // Approving/rejecting changes what the public pages show.
  if (table === "contributions") revalidatePath("/history");
  if (table === "pledges") revalidatePath("/donate");
}

/* ── Member Portal access control ────────────────────────────────
   The board verifies a brod against the roster held OFFLINE (the 490-row
   roster with PII is never imported — PRIVACY.md), then grants portal access.
   grant_member adds the brod's email_hash (HMAC, zero raw PII) to the
   member_allowlist via a security-definer RPC, and invites the account so
   signInWithOtp({ shouldCreateUser:false }) accepts them. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function grantMember(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const batch = String(formData.get("batch") ?? "").trim().slice(0, 40);
  if (!EMAIL_RE.test(email)) return;

  const supabase = getAdminSupabase();
  if (!supabase) return;

  // 1) Add to the hash-only allowlist (hashed inside Postgres; the raw email
  //    is never stored and the Node side never touches the secret).
  const { error: rpcError } = await supabase.rpc("grant_member", {
    p_email: email,
    p_batch: batch || null,
  });
  if (rpcError) {
    console.error("grant_member RPC failed:", rpcError.message);
    return;
  }

  // 2) Invite the account so the magic link will accept them (user now exists).
  const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: { batch: batch || null },
  });
  if (inviteError) console.error("inviteUserByEmail failed:", inviteError.message);

  revalidatePath("/admin");
}

export async function revokeMember(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return;

  const supabase = getAdminSupabase();
  if (!supabase) return;
  await supabase.rpc("revoke_member", { p_email: email });
  revalidatePath("/admin");
}

export async function revokeMemberByHash(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const hash = String(formData.get("hash") ?? "").trim();
  if (!hash) return;

  const supabase = getAdminSupabase();
  if (!supabase) return;
  await supabase.rpc("revoke_member_hash", { p_hash: hash });
  revalidatePath("/admin");
}

/* ── Membership claims ───────────────────────────────────────────
   A brod claims their record at /portal/claim; the board decides it here
   against the roster held offline. Approving is the whole grant in one
   action: allowlist the hash, invite the account, close the claim. The RPC
   nulls the raw email whichever way the decision goes, so a decided claim
   keeps no address — only the HMAC and the masked label. */

export async function decideClaim(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const id = String(formData.get("id") ?? "").trim();
  const decision = String(formData.get("decision") ?? "");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const batch = String(formData.get("batch") ?? "").trim().slice(0, 40);
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  if (!id || (decision !== "approved" && decision !== "rejected")) return;

  const supabase = getAdminSupabase();
  if (!supabase) return;

  if (decision === "approved") {
    // Refuse rather than half-approve: a claim marked approved whose invite
    // never went out is worse than one still sitting in the queue, because
    // nobody will look at it again.
    if (!EMAIL_RE.test(email)) {
      console.error("decideClaim: approve called without a usable email");
      return;
    }
    const { error: rpcError } = await supabase.rpc("grant_member", {
      p_email: email,
      p_batch: batch || null,
    });
    if (rpcError) {
      console.error("grant_member RPC failed:", rpcError.message);
      return;
    }
    const { error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
      data: { batch: batch || null },
    });
    // An already-registered brod is not a failure: they are allow-listed now
    // and their next magic link will work. Log it and close the claim.
    if (inviteError) console.error("inviteUserByEmail failed:", inviteError.message);
  }

  const { error } = await supabase.rpc("decide_membership_claim", {
    p_id: id,
    p_status: decision,
    p_note: note || null,
  });
  if (error) console.error("decide_membership_claim failed:", error.message);

  revalidatePath("/admin");
}
/* ── The Brotherhood Assistance Fund ─────────────────────────────
   Requests are the most sensitive rows in this database: a summary may name
   a brod's illness or a death in their family. They are readable only here,
   behind the admin password, and they never reach a public page in any form.
   The ledger is the opposite — public by policy — and carries no names by
   construction, because the table has no column for one. */

const ASSISTANCE_STATUS = ["received", "reviewing", "assisted", "declined", "closed"];

export async function triageAssistance(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("board_note") ?? "").trim().slice(0, 2000);
  if (!id || !ASSISTANCE_STATUS.includes(status)) return;

  const supabase = getAdminSupabase();
  if (!supabase) return;
  await supabase
    .from("assistance_requests")
    .update({
      status,
      // Keep an existing note when the board only moves the status along.
      ...(note ? { board_note: note } : {}),
      decided_at: status === "assisted" || status === "declined" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  revalidatePath("/admin");
}

/* ── Sponsorship pipeline ────────────────────────────────────────
   PLAN §5's cash discipline, made structural: an expected amount and a
   collected amount are separate fields, and only the `paid` stage counts as
   money. The 2025 Sportsfest reported PHP 294,050 against PHP 136,050 actually
   collected; the point of this queue is that the gap cannot hide. */

const SPONSOR_STAGE = ["enquiry", "proposal_sent", "committed", "paid", "declined"];

export async function updateSponsor(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const id = String(formData.get("id") ?? "").trim();
  const stage = String(formData.get("stage") ?? "");
  const note = String(formData.get("committee_note") ?? "").trim().slice(0, 2000);
  const paidRaw = String(formData.get("amount_paid") ?? "").replace(/[^\d.]/g, "");
  if (!id || !SPONSOR_STAGE.includes(stage)) return;

  const supabase = getAdminSupabase();
  if (!supabase) return;
  const paid = Number(paidRaw);
  await supabase
    .from("sponsor_enquiries")
    .update({
      stage,
      ...(note ? { committee_note: note } : {}),
      ...(paidRaw !== "" && Number.isFinite(paid) ? { amount_paid: paid } : {}),
    })
    .eq("id", id);
  revalidatePath("/admin");
}

export async function addLedgerEntry(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const direction = String(formData.get("direction") ?? "");
  const amount = Number(String(formData.get("amount") ?? "").replace(/[^\d.]/g, ""));
  const note = String(formData.get("note") ?? "").trim().slice(0, 200);
  const beneficiaries = Number(String(formData.get("beneficiaries") ?? "0").replace(/[^\d]/g, "")) || 0;
  const entryDate = String(formData.get("entry_date") ?? "").trim();
  if (!["raised", "disbursed"].includes(direction) || !Number.isFinite(amount) || amount <= 0) return;

  const supabase = getAdminSupabase();
  if (!supabase) return;
  const { error } = await supabase.from("assistance_ledger").insert({
    direction,
    amount,
    // The note is PUBLIC. "Hospitalisation assistance", never who.
    note: note || null,
    beneficiaries: direction === "disbursed" ? beneficiaries : 0,
    ...(entryDate ? { entry_date: entryDate } : {}),
  });
  if (error) console.error("assistance_ledger insert failed:", error.message);
  revalidatePath("/admin");
  revalidatePath("/assistance");
}

export async function deleteLedgerEntry(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const id = String(formData.get("id") ?? "").trim();
  if (!id) return;
  const supabase = getAdminSupabase();
  if (!supabase) return;
  await supabase.from("assistance_ledger").delete().eq("id", id);
  revalidatePath("/admin");
  revalidatePath("/assistance");
}

/* ── Award nominations ───────────────────────────────────────────
   Screening precedes judging (PLAN §6). The committee moves a nomination
   along and may leave a note; that note is for the committee and is never
   part of what a judge reads. There is no payment field on a nomination at
   all, by design. */

const NOMINATION_STATUS = ["received", "screening", "shortlisted", "declined", "judged"];

export async function screenNomination(formData: FormData): Promise<void> {
  if (!(await isAuthed())) redirect("/admin");
  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  const note = String(formData.get("screening_note") ?? "").trim().slice(0, 2000);
  if (!id || !NOMINATION_STATUS.includes(status)) return;

  const supabase = getAdminSupabase();
  if (!supabase) return;
  await supabase
    .from("award_nominations")
    .update({ status, ...(note ? { screening_note: note } : {}) })
    .eq("id", id);
  revalidatePath("/admin");
}

