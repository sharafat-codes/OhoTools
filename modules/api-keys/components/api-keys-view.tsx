"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  CheckIcon,
  CopyIcon,
  KeyIcon,
  LoaderCircleIcon,
  LockIcon,
  PlusIcon,
  Trash2Icon,
  TriangleAlertIcon,
} from "lucide-react";
import { toast } from "sonner";

import { createApiKey, revokeApiKey } from "@/modules/api-keys/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type KeyRow = {
  id: string;
  name: string;
  prefix: string;
  last4: string;
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
};

export function ApiKeysView({
  keys,
  isPro,
  appUrl,
}: {
  keys: KeyRow[];
  isPro: boolean;
  appUrl: string;
}) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [creating, setCreating] = React.useState(false);
  const [newKey, setNewKey] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  if (!isPro) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <div className="grid size-10 place-items-center rounded-full bg-muted">
            <LockIcon className="size-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-heading font-medium">API access is a Pro feature</p>
            <p className="mt-1 max-w-md text-sm text-muted-foreground">
              Generate keys and create QR codes programmatically from your own
              apps and scripts.
            </p>
          </div>
          <Button render={<Link href="/dashboard/billing" />}>Upgrade to Pro</Button>
        </CardContent>
      </Card>
    );
  }

  async function create() {
    setCreating(true);
    const res = await createApiKey(name);
    setCreating(false);
    if (!res || "error" in res) {
      toast.error(res?.error ?? "Could not create key.");
      return;
    }
    setNewKey(res.key);
    setName("");
    router.refresh();
  }

  async function copyKey() {
    if (!newKey) return;
    await navigator.clipboard.writeText(newKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function revoke(row: KeyRow) {
    if (!window.confirm(`Revoke "${row.name}"? Apps using it will stop working.`)) return;
    setPendingId(row.id);
    await revokeApiKey(row.id);
    setPendingId(null);
    toast.success("Key revoked.");
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Create */}
      <Card>
        <CardHeader>
          <CardTitle>Create an API key</CardTitle>
          <CardDescription>Name it so you remember where it&apos;s used.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Production server"
              maxLength={60}
            />
          </div>
          <Button onClick={create} disabled={creating}>
            {creating ? <LoaderCircleIcon className="animate-spin" /> : <PlusIcon />}
            Create key
          </Button>
        </CardContent>
      </Card>

      {/* List */}
      {keys.length > 0 && (
        <div className="flex flex-col gap-2">
          {keys.map((row) => (
            <Card key={row.id}>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-9 place-items-center rounded-lg bg-muted">
                    <KeyIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{row.name}</p>
                    <code className="text-xs text-muted-foreground">
                      {row.prefix}
                      {"•".repeat(6)}
                      {row.last4}
                    </code>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{row.usageCount} calls</span>
                  <span className="hidden sm:inline">
                    {row.lastUsedAt
                      ? `Used ${format(new Date(row.lastUsedAt), "MMM d")}`
                      : "Never used"}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => revoke(row)}
                    disabled={pendingId === row.id}
                    aria-label="Revoke"
                  >
                    {pendingId === row.id ? (
                      <LoaderCircleIcon className="animate-spin" />
                    ) : (
                      <Trash2Icon />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Docs */}
      <Card>
        <CardHeader>
          <CardTitle>Using the API</CardTitle>
          <CardDescription>
            Authenticate with the <code>Authorization: Bearer</code> header.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <CodeBlock>{`curl -H "Authorization: Bearer <your-key>" \\\n  ${appUrl}/api/v1/me`}</CodeBlock>
          <CodeBlock>{`curl -H "Authorization: Bearer <your-key>" \\\n  "${appUrl}/api/v1/qr?data=https://example.com&size=512" \\\n  --output qr.png`}</CodeBlock>
          <p className="text-xs text-muted-foreground">
            <code>/api/v1/qr</code> params: <code>data</code> (required),{" "}
            <code>size</code>, <code>margin</code>, <code>ec</code> (L/M/Q/H),{" "}
            <code>dark</code>, <code>light</code>.
          </p>
        </CardContent>
      </Card>

      {/* New key dialog */}
      <Dialog open={!!newKey} onOpenChange={(o) => !o && setNewKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Your new API key</DialogTitle>
            <DialogDescription className="flex items-center gap-1.5">
              <TriangleAlertIcon className="size-3.5" />
              Copy it now — you won&apos;t be able to see it again.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-2">
            <Input value={newKey ?? ""} readOnly className="font-mono text-xs" />
            <Button variant="outline" size="icon" onClick={copyKey} aria-label="Copy">
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
          <DialogFooter>
            <Button onClick={() => setNewKey(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-muted p-3 text-xs">
      <code className="font-mono">{children}</code>
    </pre>
  );
}
