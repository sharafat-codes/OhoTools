import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { posts } from "@/modules/blog";
import { Badge } from "@/components/ui/badge";
import { SITE_URL as siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog — Guides & Tutorials",
  description:
    "Guides and tutorials on QR codes, developer tools, networking, and productivity from the OhoTool team.",
  alternates: { canonical: "/blog" },
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export default function BlogIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        name: "OhoTool Blog",
        description:
          "Guides and tutorials on online tools, PDF, images, developer tools, and productivity from the OhoTool team.",
        url: `${siteUrl}/blog`,
        blogPost: posts.map((p) => ({
          "@type": "BlogPosting",
          headline: p.title,
          url: `${siteUrl}/blog/${p.slug}`,
          datePublished: p.date,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${siteUrl}/` },
          { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
        ],
      },
    ],
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-14 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="max-w-2xl">
        <p className="text-sm font-medium text-primary">Blog</p>
        <h1 className="mt-2 font-heading text-4xl font-semibold tracking-tight">Guides &amp; tutorials</h1>
        <p className="mt-4 text-muted-foreground">
          Practical guides on QR codes, developer tools, networking, and getting more done — from the
          OhoTool team.
        </p>
      </header>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <div className="flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Badge key={t} variant="secondary">{t}</Badge>
              ))}
            </div>
            <h2 className="mt-3 font-heading text-lg font-semibold tracking-tight group-hover:text-primary">
              {post.title}
            </h2>
            <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.description}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {formatDate(post.date)} · {post.readingMinutes} min read
              </span>
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
