import { NextResponse, type NextRequest } from "next/server";
import { getServerSupabase } from "@/lib/supabase/rsc";

/* Supabase magic-link redirects here with a one-time `code`. Exchange it for
   a session (writes the auth cookie via lib/supabase/rsc.ts's setAll), then
   send the member on to the portal. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // Only honour a same-origin relative path. `origin` is prepended below, so an
  // absolute URL or a protocol-relative "//evil.com" would otherwise become a
  // malformed-but-host-controlled redirect target; a bare "/portal" is all the
  // client ever sends anyway.
  const requested = searchParams.get("next") ?? "/portal";
  const next = requested.startsWith("/") && !requested.startsWith("//") && !requested.startsWith("/\\")
    ? requested
    : "/portal";

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
