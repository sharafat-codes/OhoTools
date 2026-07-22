"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

const FIELDS = [
  { key: "utm_source", label: "Campaign source", placeholder: "google, newsletter", required: true },
  { key: "utm_medium", label: "Campaign medium", placeholder: "cpc, email, social", required: true },
  { key: "utm_campaign", label: "Campaign name", placeholder: "spring_sale", required: true },
  { key: "utm_term", label: "Campaign term (optional)", placeholder: "running+shoes", required: false },
  { key: "utm_content", label: "Campaign content (optional)", placeholder: "logolink", required: false },
] as const;

export function UtmBuilder() {
  const [url, setUrl] = React.useState("");
  const [values, setValues] = React.useState<Record<string, string>>({});

  const params = new URLSearchParams();
  for (const f of FIELDS) {
    const v = values[f.key]?.trim();
    if (v) params.set(f.key, v);
  }
  const query = params.toString();
  const base = url.trim();
  const result = base && query ? `${base}${base.includes("?") ? "&" : "?"}${query}` : base;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="utm-url">Website URL</Label>
        <Input
          id="utm-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/landing"
          type="url"
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.key} className="flex flex-col gap-1.5">
            <Label htmlFor={f.key}>{f.label}</Label>
            <Input
              id={f.key}
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              placeholder={f.placeholder}
            />
          </div>
        ))}
      </div>

      {result && (
        <Card>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Your campaign URL</span>
              <CopyButton value={result} />
            </div>
            <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
              <code className="font-mono break-all whitespace-pre-wrap">{result}</code>
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
