import { NextResponse } from "next/server";

import { devTools, getToolCategory } from "@/modules/tools/registry";

// Lightweight tool index for the global header search. Static (built once,
// cached) so the registry data never ships in the client bundle.
export const dynamic = "force-static";

export function GET() {
  const index = devTools.map((t) => ({
    slug: t.slug,
    name: t.name,
    tagline: t.tagline,
    category: getToolCategory(t.slug)?.name ?? "",
    keywords: t.keywords,
  }));
  return NextResponse.json(index);
}
