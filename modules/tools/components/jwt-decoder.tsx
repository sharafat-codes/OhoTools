"use client";

import * as React from "react";
import { AlertCircleIcon } from "lucide-react";

import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

function b64urlToString(part: string) {
  const b64 = part.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

function decode(token: string) {
  const parts = token.trim().split(".");
  if (parts.length < 2) throw new Error("A JWT has at least two dot-separated parts.");
  return {
    header: JSON.stringify(JSON.parse(b64urlToString(parts[0])), null, 2),
    payload: JSON.parse(b64urlToString(parts[1])) as Record<string, unknown>,
  };
}

export function JwtDecoder() {
  const [token, setToken] = React.useState("");

  let header: string | null = null;
  let payloadJson: string | null = null;
  let claims: { label: string; value: string }[] = [];
  let error: string | null = null;

  if (token.trim()) {
    try {
      const decoded = decode(token);
      header = decoded.header;
      payloadJson = JSON.stringify(decoded.payload, null, 2);
      claims = (["iat", "nbf", "exp"] as const)
        .filter((k) => typeof decoded.payload[k] === "number")
        .map((k) => ({
          label: k,
          value: new Date((decoded.payload[k] as number) * 1000).toUTCString(),
        }));
    } catch (e) {
      error = (e as Error).message || "Not a valid JWT.";
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Textarea
        value={token}
        onChange={(e) => setToken(e.target.value)}
        placeholder="Paste a JWT (eyJhbGciOi…)"
        rows={4}
        className="font-mono text-xs"
      />

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircleIcon className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {header && payloadJson && (
        <>
          <Section title="Header" json={header} />
          <Section title="Payload" json={payloadJson} />
          {claims.length > 0 && (
            <Card>
              <CardContent className="flex flex-col gap-1.5">
                <span className="text-sm font-medium">Timestamps</span>
                {claims.map((c) => (
                  <div key={c.label} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{c.label}</span>
                    <span>{c.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          <p className="text-xs text-muted-foreground">
            Signature is not verified — decoding only reveals the contents.
          </p>
        </>
      )}
    </div>
  );
}

function Section({ title, json }: { title: string; json: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">{title}</span>
          <CopyButton value={json} label="" />
        </div>
        <pre className="max-h-64 overflow-auto rounded-lg bg-muted p-3 text-xs">
          <code className="font-mono">{json}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
