import type { Metadata } from "next";

import { getTool } from "@/modules/tools/registry";
import { ToolShell } from "@/modules/tools/components/tool-shell";
import { UrlEncoder } from "@/modules/tools/components/url-encoder";

const tool = getTool("url-encoder")!;

export const metadata: Metadata = {
  title: tool.name,
  description: tool.description,
  keywords: tool.keywords,
  alternates: { canonical: "/tools/url-encoder" },
};

export default function Page() {
  return (
    <ToolShell tool={tool}>
      <UrlEncoder />
    </ToolShell>
  );
}
