import type { MetadataRoute } from "next";

import { devTools, categoryPages } from "@/modules/tools/registry";
import { posts } from "@/modules/blog";
import { questionBankSlugs } from "@/modules/interview/questions";
import { SITE_URL as siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const categoryHubs: MetadataRoute.Sitemap = categoryPages.map((c) => ({
    url: `${siteUrl}/tools/${c.slug}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.75,
  }));

  const toolPages: MetadataRoute.Sitemap = devTools.map((t) => ({
    url: `${siteUrl}/tools/${t.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/tools`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/widgets`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/interview`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/resume-review`, lastModified, changeFrequency: "weekly", priority: 0.8 },
    ...questionBankSlugs.map((slug) => ({
      url: `${siteUrl}/interview/${slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    { url: `${siteUrl}/send`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/pricing`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/developers`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/request-tool`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    ...categoryHubs,
    ...toolPages,
    { url: `${siteUrl}/blog`, lastModified, changeFrequency: "weekly", priority: 0.7 },
    ...blogPages,
    { url: `${siteUrl}/login`, lastModified, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/signup`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/privacy`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/terms`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/refunds`, lastModified, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: "yearly", priority: 0.3 },
  ];
}
