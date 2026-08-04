import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRightIcon, KeyRoundIcon, TerminalIcon, ZapIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "API — Developer Documentation",
  description:
    "OhoTool API: convert files, generate QR codes, and more from your own apps. Simple REST endpoints, Bearer-key auth. Included with Pro.",
  alternates: { canonical: "/developers" },
};

const BASE = `${SITE_URL}/api/v1`;

function Code({ code }: { code: string }) {
  return (
    <div className="relative">
      <pre className="overflow-x-auto rounded-lg border border-border bg-muted/40 p-4 pr-12 text-xs leading-relaxed sm:text-sm">
        <code>{code}</code>
      </pre>
      <div className="absolute right-2 top-2">
        <CopyButton value={code} label="" />
      </div>
    </div>
  );
}

function Endpoint({
  method,
  path,
  children,
}: {
  method: string;
  path: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
      <div className="flex items-center gap-2 font-mono text-sm">
        <span className="rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">{method}</span>
        <span className="break-all">{path}</span>
      </div>
      {children}
    </div>
  );
}

export default function DevelopersPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
      {/* Hero */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <TerminalIcon className="size-4" />
          {SITE_NAME} API
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Developer API</h1>
        <p className="text-pretty text-muted-foreground">
          Use OhoTool&apos;s tools straight from your own apps and scripts — convert files (Office ↔ PDF, and more) and
          generate QR codes over a simple REST API. Authenticate with a Bearer key. Included with Pro.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          <Button render={<Link href="/dashboard/api-keys" />}>
            <KeyRoundIcon className="size-4" />
            Get an API key
          </Button>
          <Button variant="outline" render={<Link href="/pricing" />}>
            See Pro pricing
          </Button>
        </div>
      </div>

      {/* Quick start */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Quick start</h2>
        <ol className="mt-4 flex flex-col gap-3 text-sm text-muted-foreground">
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium">1</span>
            <span>
              <Link href="/pricing" className="font-medium text-primary hover:underline">
                Upgrade to Pro
              </Link>{" "}
              (API access is a Pro feature).
            </span>
          </li>
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium">2</span>
            <span>
              Create a key in{" "}
              <Link href="/dashboard/api-keys" className="font-medium text-primary hover:underline">
                Dashboard → API keys
              </Link>
              . Copy it once — it&apos;s shown only at creation.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="grid size-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-medium">3</span>
            <span>Call the API with your key in the Authorization header (below).</span>
          </li>
        </ol>
      </section>

      {/* Auth */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Authentication</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Send your key as a Bearer token. Keep it secret — treat it like a password and use it only server-side.
        </p>
        <div className="mt-3">
          <Code code={`Authorization: Bearer oho_your_api_key`} />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          Base URL: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{BASE}</code>
        </p>
      </section>

      {/* Endpoints */}
      <section className="mt-12 flex flex-col gap-4">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Endpoints</h2>

        <Endpoint method="POST" path="/api/v1/convert">
          <p className="text-sm text-muted-foreground">
            Convert a file (e.g. Office ↔ PDF) or a URL/HTML to PDF. Returns the converted file. Send{" "}
            <code className="rounded bg-muted px-1 text-xs">GET /api/v1/convert</code> for the full list of supported{" "}
            <code className="rounded bg-muted px-1 text-xs">op</code> values.
          </p>
          <div className="text-xs font-medium text-muted-foreground">File → file (multipart)</div>
          <Code
            code={`curl -X POST "${BASE}/convert" \\
  -H "Authorization: Bearer oho_..." \\
  -F op=to-pdf \\
  -F file=@document.docx \\
  --output document.pdf`}
          />
          <div className="text-xs font-medium text-muted-foreground">URL → PDF (JSON)</div>
          <Code
            code={`curl -X POST "${BASE}/convert" \\
  -H "Authorization: Bearer oho_..." \\
  -H "Content-Type: application/json" \\
  -d '{"op":"url-to-pdf","url":"https://example.com"}' \\
  --output page.pdf`}
          />
        </Endpoint>

        <Endpoint method="GET" path="/api/v1/qr">
          <p className="text-sm text-muted-foreground">Generate a QR code PNG.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-muted-foreground">
                <tr>
                  <th className="py-1 pr-4 font-medium">Param</th>
                  <th className="py-1 pr-4 font-medium">Default</th>
                  <th className="py-1 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr><td className="py-1 pr-4 font-mono text-xs">data</td><td className="py-1 pr-4">—</td><td className="py-1">Required. Text/URL to encode.</td></tr>
                <tr><td className="py-1 pr-4 font-mono text-xs">size</td><td className="py-1 pr-4">512</td><td className="py-1">128–1024 px.</td></tr>
                <tr><td className="py-1 pr-4 font-mono text-xs">margin</td><td className="py-1 pr-4">2</td><td className="py-1">0–10 modules.</td></tr>
                <tr><td className="py-1 pr-4 font-mono text-xs">ec</td><td className="py-1 pr-4">M</td><td className="py-1">Error correction: L, M, Q, H.</td></tr>
                <tr><td className="py-1 pr-4 font-mono text-xs">dark / light</td><td className="py-1 pr-4">000000 / ffffff</td><td className="py-1">Hex colors.</td></tr>
              </tbody>
            </table>
          </div>
          <Code
            code={`curl "${BASE}/qr?data=https://ohotool.com&size=512" \\
  -H "Authorization: Bearer oho_..." \\
  --output qr.png`}
          />
        </Endpoint>

        <Endpoint method="GET" path="/api/v1/me">
          <p className="text-sm text-muted-foreground">Verify your key and see your plan.</p>
          <Code code={`curl "${BASE}/me" -H "Authorization: Bearer oho_..."`} />
        </Endpoint>
      </section>

      {/* Rate limits */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Rate limits</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The Pro plan includes <span className="font-medium text-foreground">1,000 API calls per month</span> (all
          endpoints combined), resetting on the 1st. Exceeding the limit returns HTTP{" "}
          <code className="rounded bg-muted px-1 text-xs">429</code>. Need more? Reach out and we&apos;ll sort out a
          higher tier.
        </p>
      </section>

      {/* Errors */}
      <section className="mt-12">
        <h2 className="font-heading text-xl font-semibold tracking-tight">Errors</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm">
            <tbody>
              <tr className="border-b border-border"><td className="px-4 py-2 font-mono text-xs">401</td><td className="px-4 py-2 text-muted-foreground">Missing or invalid API key.</td></tr>
              <tr className="border-b border-border"><td className="px-4 py-2 font-mono text-xs">403</td><td className="px-4 py-2 text-muted-foreground">Key exists but the account isn&apos;t on Pro.</td></tr>
              <tr><td className="px-4 py-2 font-mono text-xs">400</td><td className="px-4 py-2 text-muted-foreground">Bad request — unsupported op or missing field.</td></tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
          <ZapIcon className="size-4 text-primary" />
          Errors return JSON like <code className="rounded bg-muted px-1 text-xs">{`{ "error": "..." }`}</code>.
        </p>
      </section>

      {/* CTA */}
      <section className="mt-14 flex flex-col items-center gap-3 rounded-2xl border border-border bg-muted/30 px-6 py-10 text-center">
        <h2 className="font-heading text-xl font-semibold">Build with OhoTool</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          Get a Pro plan, create a key, and start converting files and generating QR codes from your own apps.
        </p>
        <Button render={<Link href="/dashboard/api-keys" />}>
          Get an API key
          <ArrowRightIcon />
        </Button>
      </section>
    </div>
  );
}
