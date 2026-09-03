/* One switch for every piece of synthetic walkthrough content.
 *
 * lib/content.ts carries four AI-generated "prominent brods", two demo donor
 * quotes, and a demo gallery, all labelled in the UI. They exist so a board
 * walkthrough can show what a populated archive looks like. They are OFF by
 * default: the public record shows only real people and real photographs,
 * and each page falls back to its honest "entry pending" state. Set
 * NEXT_PUBLIC_DEMO_CONTENT=on in the environment to show them.
 *
 * Read at build time (NEXT_PUBLIC_*), so flipping it means a redeploy, which
 * is the right cost for a switch that changes what the public record says. */
export const DEMO_CONTENT = process.env.NEXT_PUBLIC_DEMO_CONTENT === "on";

/** Keep an item unless it is synthetic and demo content is switched off. */
export function withoutDemo<T extends { synthetic?: boolean }>(items: T[]): T[] {
  return DEMO_CONTENT ? items : items.filter((item) => !item.synthetic);
}
