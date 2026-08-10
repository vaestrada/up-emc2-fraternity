import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({ eyebrow: "№ 09 — The Next Quantum Leap", title: "What's Next" });
}
