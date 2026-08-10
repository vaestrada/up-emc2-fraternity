import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({ eyebrow: "№ 04 — Citations", title: "Excellence, on the Record" });
}
