import { toolCategories, categoryPages, categorySlugForName, getTool, POPULAR_SLUGS } from "@/modules/tools/registry";
import { posts } from "@/modules/blog";
import { SITE_URL as siteUrl, siteConfig } from "@/lib/site";
import { invitifyUrl } from "@/components/invitify-promo";

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
  lines.push(
    "What people use most (Oct 2026): the animated invitation and card makers — wedding, birthday, engagement and anniversary invitations shared as one link on WhatsApp, with event details, RSVP and music. " +
      "For the full invitation experience — Nikah, Shaadi, Mehndi and Uzbek designs, photo designs, an invitation website with a schedule and gallery, and the RSVP guest list — the same engine runs Invitify at https://invitifycard.com.",
  );
  lines.push("");

  // Invitations first: it is what most visitors come for.
  lines.push("## Invitations & cards");
  for (const slug of ["wedding-invitation-maker", "birthday-card-maker", "engagement-invitation-maker", "anniversary-card-maker", "save-the-date-maker", "baby-shower-invitation-maker", "eid-card-maker", "diwali-card-maker"]) {
    const t = getTool(slug);
    if (t) lines.push(`- [${t.name}](${siteUrl}/tools/${t.slug}): ${t.tagline}`);
  }
  lines.push(`- [Invitify — the full invitation studio](${invitifyUrl()}): more designs, your photo on the card, invitation website, RSVP guest list.`);
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
