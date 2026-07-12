import { getAdminSupabase } from "@/lib/supabase/server";

export type Patron = { name: string; batch: string | null };

/* Public Roll of Patrons — names only, never amounts. Shows a pledge only
   when BOTH: the donor opted in (consent_public) AND an admin has acknowledged
   it (transfer verified). Runs server-side; selects only name + batch. */
export async function getPatrons(limit = 200): Promise<Patron[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("pledges")
    .select("name,batch")
    .eq("status", "acknowledged")
    .eq("consent_public", true)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];
  return data as Patron[];
}
