import type { MetadataRoute } from "next";

import { devTools } from "@/modules/tools/registry";

const siteUrl = process.env.BETTER_AUTH_URL || "https://oho-tools.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const toolPages: MetadataRoute.Sitemap = devTools.map((t) => ({
    url: `${siteUrl}/tools/${t.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tools`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...toolPages,
    { url: `${siteUrl}/login`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/signup`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
