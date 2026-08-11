import { renderOgImage, ogSize, ogContentType } from "@/lib/og";

export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return renderOgImage({
    eyebrow: "University of the Philippines · Est. 1969",
    title: "EMC² Fraternity",
  });
}
