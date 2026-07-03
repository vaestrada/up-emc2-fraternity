import type { MetadataRoute } from "next";

const BASE = "https://up-emc2-fraternity.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/history", "/projects", "/brods", "/donate", "/contact"].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
