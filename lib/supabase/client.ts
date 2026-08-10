"use client";

import { createBrowserClient } from "@supabase/ssr";

/* Browser Supabase client for the member portal. Uses the anon key (safe to
   expose — RLS on `public.members` is what actually gates access), unlike
   lib/supabase/server.ts's admin client, which must never reach the browser. */

const SUPABASE_URL = process.env.NEXT_PUBLIC_emc2fraternity_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_emc2fraternity_SUPABASE_ANON_KEY;

export const SUPABASE_AUTH_CONFIGURED = Boolean(SUPABASE_URL && ANON_KEY);

export function getBrowserSupabase() {
  if (!SUPABASE_AUTH_CONFIGURED) return null;
  return createBrowserClient(SUPABASE_URL!, ANON_KEY!);
}
