import type { ComponentType } from "react";

import * as restaurantQr from "./posts/dynamic-qr-restaurant-menu";
import * as cidrGuide from "./posts/cidr-subnet-cheat-sheet";
import * as devTools from "./posts/free-browser-developer-tools";

export type PostMeta = {
  slug: string;
  title: string;
  /** Used for <meta description> and the card blurb. */
  description: string;
  keywords: string[];
  /** ISO date, e.g. "2026-07-22". */
  date: string;
  readingMinutes: number;
  tags: string[];
  /** Related tool slugs to surface at the end of the post. */
  related: string[];
};

export type BlogPost = { meta: PostMeta; Body: ComponentType };

const modules: BlogPost[] = [restaurantQr, cidrGuide, devTools];

/** All posts, newest first. */
export const posts: PostMeta[] = modules
  .map((m) => m.meta)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return modules.find((m) => m.meta.slug === slug);
}
