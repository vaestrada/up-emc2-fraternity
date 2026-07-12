import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/* Server-only Supabase admin client (service-role key → bypasses RLS).
   NEVER import this from a client component. The service-role key is not
   NEXT_PUBLIC, so it is undefined in browser bundles regardless — but keep
   all usage inside "use server" actions or route handlers.

   Env names carry the Vercel integration's "emc2fraternity" store prefix. */
const SUPABASE_URL = process.env.NEXT_PUBLIC_emc2fraternity_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.emc2fraternity_SUPABASE_SERVICE_ROLE_KEY;

export const SUPABASE_CONFIGURED = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);
export const CONTRIB_BUCKET = "contributions";

let cached: SupabaseClient | null = null;

/** Returns the admin client, or null when env isn't configured (so callers
    can degrade gracefully instead of throwing). */
export function getAdminSupabase(): SupabaseClient | null {
  if (!SUPABASE_CONFIGURED) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL!, SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
