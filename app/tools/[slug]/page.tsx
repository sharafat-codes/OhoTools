import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getTool, toolMetadata } from "@/modules/tools/registry";
import { conversionSlugs, getConversionView } from "@/modules/tools/conversions";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { Converter } from "@/modules/tools/components/converter";

// Only the generated unit-conversion slugs are served here; every other
// /tools/* path is a static folder that takes precedence, and anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return conversionSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return toolMetadata(slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const view = getConversionView(slug);
  const tool = getTool(slug);
  if (!view || !tool) notFound();

  return (
    <ToolShell tool={tool}>
      <Converter view={view} />
    </ToolShell>
  );
}
