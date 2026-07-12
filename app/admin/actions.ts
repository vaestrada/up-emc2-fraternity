"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { verifyPassword, startSession, endSession, isAuthed } from "@/lib/admin/auth";
import { getAdminSupabase } from "@/lib/supabase/server";

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    redirect("/admin?error=1");
  }
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
