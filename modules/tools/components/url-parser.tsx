"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="max-w-[62%] truncate font-mono text-sm font-medium">{value || "—"}</span>
    </div>
  );
}

export function UrlParser() {
  const [url, setUrl] = React.useState("https://user@example.com:8080/path/page?q=hello&lang=en#section");

  let parsed: URL | null = null;
  let error = "";
  try {
    parsed = new URL(url);
  } catch {
    error = url.trim() ? "That doesn't look like a valid URL — include the protocol (e.g. https://)." : "";
  }
  const params = parsed ? Array.from(parsed.searchParams.entries()) : [];

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com/path?query=value#hash"
        className="font-mono text-xs"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}

      {parsed && (
        <>
          <Card>
            <CardContent className="py-1">
              <Row label="Protocol" value={parsed.protocol.replace(/:$/, "")} />
              <Row label="Host" value={parsed.host} />
              <Row label="Hostname" value={parsed.hostname} />
              <Row label="Port" value={parsed.port} />
              <Row label="Path" value={parsed.pathname} />
              <Row label="Query string" value={parsed.search} />
              <Row label="Hash" value={parsed.hash} />
              {parsed.username && <Row label="Username" value={parsed.username} />}
            </CardContent>
          </Card>

          {params.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-3 py-2">Parameter</th>
                    <th className="px-3 py-2">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {params.map(([k, v], i) => (
                    <tr key={i} className="border-t border-border/60">
                      <td className="px-3 py-1.5 font-mono">{k}</td>
                      <td className="px-3 py-1.5 font-mono text-muted-foreground">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
