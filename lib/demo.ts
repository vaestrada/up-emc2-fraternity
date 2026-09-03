/* One switch for every piece of synthetic walkthrough content.
 *
 * lib/content.ts carries four AI-generated "prominent brods", two demo donor
 * quotes, and a demo gallery, all clearly labelled in the UI. They exist so a
 * board walkthrough shows what a populated archive looks like — but the public
 * site must never present fictional alumni as real citations. This flag is
 * that guarantee: set NEXT_PUBLIC_DEMO_CONTENT=off in Vercel and every
 * synthetic item disappears, and each page falls back to its honest
 * "entry pending" state.
 *
 * Read at build time (NEXT_PUBLIC_*), so flipping it means a redeploy — which
 * is the right cost for a switch that changes what the public record says. */
export const DEMO_CONTENT = process.env.NEXT_PUBLIC_DEMO_CONTENT !== "off";

/** Keep an item unless it is synthetic and demo content is switched off. */
export function withoutDemo<T extends { synthetic?: boolean }>(items: T[]): T[] {
  return DEMO_CONTENT ? items : items.filter((item) => !item.synthetic);
}
