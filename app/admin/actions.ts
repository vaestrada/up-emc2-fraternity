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
  // Approving/rejecting a contribution changes what the public archive shows.
  if (table === "contributions") revalidatePath("/history");
}
