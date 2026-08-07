"use client";

import * as React from "react";
import { CheckCircle2Icon, XCircleIcon, Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";

// bcryptjs emits a "$2b$" version marker; PHP's password_hash() / Laravel's
// Hash::make() write "$2y$". The algorithm is byte-for-byte identical across
// $2a/$2b/$2y — only the marker differs — so rewriting the prefix produces a
// hash that verifies cleanly in PHP while still verifying here.
const PREFIXES = [
  { value: "$2y$", label: "$2y$", hint: "PHP / Laravel" },
  { value: "$2b$", label: "$2b$", hint: "Node / general" },
  { value: "$2a$", label: "$2a$", hint: "legacy" },
] as const;

function applyPrefix(hash: string, prefix: string) {
  // Every bcrypt marker is 4 chars ("$2b$"), so swap the first 4.
  return prefix + hash.slice(4);
}

export function BcryptGenerator() {
  const [mode, setMode] = React.useState<"generate" | "verify">("generate");

  // Generate
  const [password, setPassword] = React.useState("");
  const [rounds, setRounds] = React.useState(12);
  const [prefix, setPrefix] = React.useState<string>("$2y$");
  const [hash, setHash] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState("");

  // Verify
  const [vPassword, setVPassword] = React.useState("");
  const [vHash, setVHash] = React.useState("");
  const [vBusy, setVBusy] = React.useState(false);
  const [vResult, setVResult] = React.useState<null | boolean>(null);
  const [vError, setVError] = React.useState("");

  async function generate() {
    setError("");
    setHash("");
    if (!password) return;
    setBusy(true);
    try {
      const bcrypt = (await import("bcryptjs")).default;
      // Async hash — bcryptjs splits the work across timers, so the UI stays
      // responsive even at high cost factors.
      const raw = await bcrypt.hash(password, rounds);
      setHash(applyPrefix(raw, prefix));
    } catch {
      setError("Couldn't generate the hash. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function verify() {
    setVError("");
    setVResult(null);
    if (!vPassword || !vHash.trim()) return;
    setVBusy(true);
    try {
      const bcrypt = (await import("bcryptjs")).default;
      const ok = await bcrypt.compare(vPassword, vHash.trim());
      setVResult(ok);
    } catch {
      setVError("That doesn't look like a valid bcrypt hash.");
    } finally {
      setVBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Mode switch */}
      <div className="inline-flex w-full rounded-lg border border-border p-1 sm:w-fit">
        {(["generate", "verify"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 rounded-md px-4 py-1.5 text-sm font-medium capitalize transition-colors sm:flex-none",
              mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {m === "generate" ? "Generate hash" : "Verify"}
          </button>
        ))}
      </div>

      {mode === "generate" ? (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="bcrypt-pw">Password / plain text</Label>
            <Input
              id="bcrypt-pw"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="Enter the password to hash…"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="bcrypt-rounds">Cost factor (rounds)</Label>
                <span className="font-mono text-sm tabular-nums">{rounds}</span>
              </div>
              <input
                id="bcrypt-rounds"
                type="range"
                min={8}
                max={15}
                step={1}
                value={rounds}
                onChange={(e) => setRounds(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className="text-xs text-muted-foreground">Higher is slower and stronger. Laravel&rsquo;s default is 12.</p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Prefix</Label>
              <div className="inline-flex rounded-lg border border-border p-1">
                {PREFIXES.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPrefix(p.value)}
                    title={p.hint}
                    className={cn(
                      "flex-1 rounded-md px-2 py-1 font-mono text-xs transition-colors",
                      prefix === p.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {PREFIXES.find((p) => p.value === prefix)?.hint} — use <span className="font-mono">$2y$</span> for Laravel &amp; PHP.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={generate} disabled={!password || busy}>
              {busy && <Loader2Icon className="animate-spin" />}
              {hash ? "Regenerate" : "Generate hash"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setPassword("");
                setHash("");
                setError("");
              }}
            >
              Clear
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          {hash && (
            <Card>
              <CardContent className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs text-muted-foreground">
                    bcrypt hash · {rounds} rounds · <span className="font-mono">{prefix}</span>
                  </div>
                  <CopyButton value={hash} />
                </div>
                <code className="block break-all rounded-md bg-muted/50 p-3 font-mono text-sm">{hash}</code>
                <p className="text-xs text-muted-foreground">
                  A fresh salt is used every time, so the hash changes on each run — that&rsquo;s expected. Store this whole
                  string; the salt and cost are baked in.
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="border-primary/25 bg-primary/[0.03]">
            <CardContent className="flex flex-col gap-1.5 text-sm">
              <div className="font-medium">Using this in Laravel</div>
              <p className="text-muted-foreground">
                A <span className="font-mono">$2y$</span> hash is exactly what <span className="font-mono">Hash::make()</span>{" "}
                stores — paste it straight into your <span className="font-mono">users.password</span> column. Log in with the
                plain password and Laravel&rsquo;s <span className="font-mono">Hash::check()</span> (PHP&rsquo;s{" "}
                <span className="font-mono">password_verify()</span>) will match it.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="verify-pw">Password / plain text</Label>
            <Input
              id="verify-pw"
              value={vPassword}
              onChange={(e) => setVPassword(e.target.value)}
              placeholder="The password to check…"
              autoComplete="off"
              spellCheck={false}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="verify-hash">bcrypt hash</Label>
            <Input
              id="verify-hash"
              value={vHash}
              onChange={(e) => setVHash(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && verify()}
              placeholder="$2y$12$…"
              autoComplete="off"
              spellCheck={false}
              className="font-mono"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={verify} disabled={!vPassword || !vHash.trim() || vBusy}>
              {vBusy && <Loader2Icon className="animate-spin" />}
              Check match
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setVPassword("");
                setVHash("");
                setVResult(null);
                setVError("");
              }}
            >
              Clear
            </Button>
          </div>

          {vError && <p className="text-sm text-destructive">{vError}</p>}

          {vResult !== null && !vError && (
            <Card className={cn(vResult ? "border-green-500/40 bg-green-500/[0.06]" : "border-destructive/40 bg-destructive/[0.06]")}>
              <CardContent className="flex items-center gap-2.5">
                {vResult ? (
                  <>
                    <CheckCircle2Icon className="size-5 shrink-0 text-green-600 dark:text-green-500" />
                    <span className="text-sm font-medium">The password matches this hash.</span>
                  </>
                ) : (
                  <>
                    <XCircleIcon className="size-5 shrink-0 text-destructive" />
                    <span className="text-sm font-medium">No match — the password doesn&rsquo;t produce this hash.</span>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          <p className="text-xs text-muted-foreground">
            Verifying accepts any bcrypt marker (<span className="font-mono">$2y$</span>, <span className="font-mono">$2b$</span>,{" "}
            <span className="font-mono">$2a$</span>), so it works on hashes from Laravel, PHP, Node, or anywhere else.
          </p>
        </div>
      )}

      <p className="text-xs text-muted-foreground">
        Everything runs in your browser — passwords and hashes are never uploaded. bcrypt only reads the first 72 bytes of a
        password.
      </p>
    </div>
  );
}
