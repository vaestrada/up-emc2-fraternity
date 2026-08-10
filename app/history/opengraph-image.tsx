import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({ eyebrow: "Vol. I — Since 1969", title: "The Archive" });
}
