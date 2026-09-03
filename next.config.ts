import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// The Member Portal talks to Supabase straight from the browser (magic-link
// sign-in, the profile upsert under the member's own JWT), and the archive
// renders contributed photos from Supabase Storage via signed URLs. Both were
// silently blocked by the previous `connect-src 'self'` / `img-src 'self'` —
// the sign-in button did nothing and the console showed a CSP refusal — so
// the Supabase origin is allow-listed here, derived from the same env the
// clients read. When the env is unset the CSP stays strictly same-origin.
const supabaseOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_emc2fraternity_SUPABASE_URL;
  if (!raw) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
})();
const supabaseWs = supabaseOrigin ? supabaseOrigin.replace(/^https?:/, "wss:") : null;

// next dev needs eval'd source maps and inline styles for HMR; production stays strict.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  `img-src 'self' data: blob:${supabaseOrigin ? ` ${supabaseOrigin}` : ""}`,
  "font-src 'self' data:",
  "media-src 'self'",
  `connect-src 'self'${supabaseOrigin ? ` ${supabaseOrigin} ${supabaseWs}` : ""}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

const nextConfig: NextConfig = {
  // a stray lockfile in the home directory makes Next mis-infer the workspace root
  turbopack: {
    root: __dirname,
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
};

export default nextConfig;
