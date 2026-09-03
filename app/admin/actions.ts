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
