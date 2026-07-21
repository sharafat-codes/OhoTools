import type { MetadataRoute } from "next";

const siteUrl = process.env.BETTER_AUTH_URL || "https://oho-tools.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/login`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/signup`, lastModified, changeFrequency: "monthly", priority: 0.6 },
  ];
}
