import type { Metadata } from "next";

import { RequestToolForm } from "@/modules/marketing/components/request-tool-form";
import { TOOL_COUNT_LABEL } from "@/modules/tools/registry";

export const metadata: Metadata = {
  title: "Request a Tool",
  description:
    "Can't find the tool you need? Request it — we read every suggestion and use them to decide what to build next. Free.",
  alternates: { canonical: "/request-tool" },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Request a tool</h1>
        <p className="mt-3 text-muted-foreground">
          We&apos;ve built {TOOL_COUNT_LABEL} tools — and the best ideas for the next ones come from you. Tell us what you
          need and we&apos;ll consider it for the roadmap.
        </p>
      </div>
      <RequestToolForm initialTool={q ?? ""} />
    </div>
  );
}
