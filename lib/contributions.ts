import { getAdminSupabase, CONTRIB_BUCKET } from "@/lib/supabase/server";

export type PublicContribution = {
  id: string;
  created_at: string;
  name: string;
  batch: string | null;
  kind: string | null;
  title: string;
  details: string;
  links: string | null;
  photos: string[]; // signed URLs (valid well past the daily revalidation window)
};

/* Approved contributions for public display. Runs server-side only.
   - Selects ONLY publish-safe columns (never email/ip).
   - Filters to status = 'approved', so pending/rejected rows and their photos
     are never queried or signed.
   - Signed URLs get a 7-day expiry; pages are ISR (revalidate daily) and are
     re-signed on every regeneration, so links never go stale in practice. */
export async function getApprovedContributions(limit = 24): Promise<PublicContribution[]> {
  const supabase = getAdminSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("contributions")
    .select("id,created_at,name,batch,kind,title,details,links,photo_paths")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error || !data) return [];

  const rows = data as Array<{
    id: string; created_at: string; name: string; batch: string | null;
    kind: string | null; title: string; details: string; links: string | null;
    photo_paths: string[] | null;
  }>;

  const allPaths = rows.flatMap((r) => r.photo_paths ?? []);
  const signed: Record<string, string> = {};
  if (allPaths.length) {
    const { data: urls } = await supabase.storage
      .from(CONTRIB_BUCKET)
      .createSignedUrls(allPaths, 60 * 60 * 24 * 7);
    (urls ?? []).forEach((u) => {
      if (u.path && u.signedUrl) signed[u.path] = u.signedUrl;
    });
  }

  return rows.map((r) => ({
    id: r.id,
    created_at: r.created_at,
    name: r.name,
    batch: r.batch,
    kind: r.kind,
    title: r.title,
    details: r.details,
    links: r.links,
    photos: (r.photo_paths ?? []).map((p) => signed[p]).filter(Boolean),
  }));
}
