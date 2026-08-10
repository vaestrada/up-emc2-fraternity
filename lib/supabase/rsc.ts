import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

/* Cookie-aware Supabase client for server components and server actions in
   the member portal — reads the signed-in member's own session, so RLS on
   public.members applies as that member, not as an admin. This is separate
   from lib/supabase/server.ts's getAdminSupabase(), which uses the
   service-role key and bypasses RLS entirely; that one stays reserved for
   the existing contact/pledge/contribute forms and must not be reused here. */

const SUPABASE_URL = process.env.NEXT_PUBLIC_emc2fraternity_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_emc2fraternity_SUPABASE_ANON_KEY;

export const SUPABASE_AUTH_CONFIGURED = Boolean(SUPABASE_URL && ANON_KEY);

export async function getServerSupabase() {
  if (!SUPABASE_AUTH_CONFIGURED) return null;
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL!, ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component render, where cookies() is
          // read-only — middleware.ts is what actually refreshes the
          // session cookie in that case, so this is safe to swallow.
        }
      },
    },
  });
}
