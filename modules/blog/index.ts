import type { ComponentType } from "react";

import * as restaurantQr from "./posts/dynamic-qr-restaurant-menu";
import * as cidrGuide from "./posts/cidr-subnet-cheat-sheet";
import * as devTools from "./posts/free-browser-developer-tools";
import * as formatJson from "./posts/how-to-format-json";
import * as base64Guide from "./posts/what-is-base64-encoding";
import * as strongPassword from "./posts/how-to-create-strong-password";
import * as qrLogo from "./posts/qr-code-with-logo";
import * as decodeJwt from "./posts/how-to-decode-jwt";

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

const modules: BlogPost[] = [
  restaurantQr,
  cidrGuide,
  devTools,
  formatJson,
  base64Guide,
  strongPassword,
  qrLogo,
  decodeJwt,
];

/** All posts, newest first. */
export const posts: PostMeta[] = modules
  .map((m) => m.meta)
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export function getPost(slug: string): BlogPost | undefined {
  return modules.find((m) => m.meta.slug === slug);
}
