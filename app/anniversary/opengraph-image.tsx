import { renderOgImage, ogSize, ogContentType } from "@/lib/og";
import { anniversary } from "@/lib/content";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({
    eyebrow: `${anniversary.month} · ${anniversary.venue}`,
    title: `The ${anniversary.ordinal} Anniversary`,
  });
}
