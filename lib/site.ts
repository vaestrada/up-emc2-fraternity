// Single source of truth for the site's absolute base URL.
// Domain cutover (see the metadataBase TODO) becomes one env var + redeploy;
// falls back to the current vercel.app host so nothing breaks without the env.
// TODO: switch the fallback to the final domain once the BOT settles ownership.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://up-emc2-fraternity.vercel.app";
