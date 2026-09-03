import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/join", "/history", "/projects", "/anniversary", "/quantum-leap", "/brods", "/donate", "/contribute", "/roadmap", "/contact", "/privacy"].map(
    (path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly",
      priority: path === "" ? 1 : path === "/privacy" ? 0.3 : 0.7,
    })
  );
}
