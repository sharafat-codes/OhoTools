import { toolCategories, categoryPages, categorySlugForName, getTool, POPULAR_SLUGS } from "@/modules/tools/registry";
import { posts } from "@/modules/blog";
import { SITE_URL as siteUrl, siteConfig } from "@/lib/site";

// llms.txt — a concise, curated map for AI crawlers (ChatGPT, Perplexity,
// Claude, AI Overviews). See https://llmstxt.org. Generated from the registry
// so it stays in sync as tools/categories/posts change.
export const dynamic = "force-static";

export function GET() {
  const lines: string[] = [];

  lines.push(`# ${siteConfig.name}`);
  lines.push("");
  lines.push(`> ${siteConfig.tagline}`);
  lines.push("");
  lines.push(
    "OhoTool is a free collection of fast, privacy-friendly online tools. Most tools run entirely in the browser — nothing is uploaded. No sign-up is required for the core tools.",
  );
  lines.push("");

  // Popular tools
  lines.push("## Popular tools");
  for (const slug of POPULAR_SLUGS) {
    const t = getTool(slug);
    if (t) lines.push(`- [${t.name}](${siteUrl}/tools/${t.slug}): ${t.tagline}`);
  }
  lines.push("");

  // Categories (with their tools)
  lines.push("## Categories");
  for (const cat of toolCategories) {
    const catSlug = categorySlugForName(cat.name);
    const href = catSlug ? `${siteUrl}/tools/${catSlug}` : `${siteUrl}/tools`;
    lines.push(`- [${cat.name}](${href}): ${cat.blurb}`);
  }
  lines.push("");

  // All tools grouped by category
  lines.push("## All tools");
  for (const cat of toolCategories) {
    lines.push(`### ${cat.name}`);
    for (const slug of cat.slugs) {
      const t = getTool(slug);
      if (t) lines.push(`- [${t.name}](${siteUrl}/tools/${t.slug}): ${t.tagline}`);
    }
    lines.push("");
  }

  // Guides
  lines.push("## Guides");
  for (const p of posts) {
    lines.push(`- [${p.title}](${siteUrl}/blog/${p.slug})`);
  }
  lines.push("");

  // Hubs
  lines.push("## Optional");
  lines.push(`- [All tools](${siteUrl}/tools)`);
  lines.push(`- [Blog](${siteUrl}/blog)`);
  for (const c of categoryPages) {
    lines.push(`- [${c.seoTitle}](${siteUrl}/tools/${c.slug})`);
  }
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
