import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { getTool, toolMetadata } from "@/modules/tools/registry";
import { conversionSlugs, getConversionView } from "@/modules/tools/conversions";
import { imageFormatSlugs, getImageFormatView } from "@/modules/tools/image-formats";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { Converter } from "@/modules/tools/components/converter";
import { ImageFormatConverter } from "@/modules/tools/components/image-format-converter";

// This route serves the generated data-driven tools (unit conversions +
// image-format converters). Every other /tools/* path is a static folder that
// takes precedence, and dynamicParams:false 404s anything not listed below.
export const dynamicParams = false;

export function generateStaticParams() {
  return [...conversionSlugs, ...imageFormatSlugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return toolMetadata(slug);
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool) notFound();

  const conversion = getConversionView(slug);
  if (conversion) {
    return (
      <ToolShell tool={tool}>
        <Converter view={conversion} />
      </ToolShell>
    );
  }

  const imageFormat = getImageFormatView(slug);
  if (imageFormat) {
    return (
      <ToolShell tool={tool}>
        <ImageFormatConverter view={imageFormat} />
      </ToolShell>
    );
  }

  notFound();
}
