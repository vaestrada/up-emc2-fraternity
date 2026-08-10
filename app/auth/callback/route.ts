import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/supabase/rsc";

/* Supabase magic-link redirects here with a one-time `code`. Exchange it for
   a session (writes the auth cookie via lib/supabase/rsc.ts's setAll), then
   send the member on to the portal. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/portal";

  if (code) {
    const supabase = await getServerSupabase();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/portal?error=auth`);
}
