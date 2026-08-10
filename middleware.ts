import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/* Refreshes the member portal's Supabase auth session cookie on every
   request. Required by @supabase/ssr's Next.js App Router pattern — without
   this, a session that expires mid-visit won't refresh until the next full
   page load, and Server Components (which can't write cookies themselves,
   see lib/supabase/rsc.ts) would otherwise never see the renewed token. */

const SUPABASE_URL = process.env.NEXT_PUBLIC_emc2fraternity_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_emc2fraternity_SUPABASE_ANON_KEY;

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!SUPABASE_URL || !ANON_KEY) return response;

  const supabase = createServerClient(SUPABASE_URL, ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        response = NextResponse.next({ request });
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Touching auth.getUser() is what actually triggers the refresh.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    /* Skip static assets and images; the portal is the only thing that
       needs the auth cookie refreshed on navigation. */
    "/((?!_next/static|_next/image|favicon.ico|icon.png|apple-icon.png|photos|logo).*)",
  ],
};
