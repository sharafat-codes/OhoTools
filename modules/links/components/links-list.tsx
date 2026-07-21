"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BarChart3Icon,
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  LoaderCircleIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import {
  deleteDynamicLink,
  setLinkActive,
  updateDynamicLink,
} from "@/modules/links/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type LinkRow = {
  id: string;
  name: string | null;
  shortCode: string;
  targetUrl: string;
  active: boolean;
  scanCount: number;
  url: string;
  expiresAt: string | null;
};

export function LinksList({ links }: { links: LinkRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = React.useState<LinkRow | null>(null);
  const [copied, setCopied] = React.useState<string | null>(null);
  const [pendingId, setPendingId] = React.useState<string | null>(null);

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast.error("Couldn't copy.");
    }
  }

  async function toggle(row: LinkRow) {
    setPendingId(row.id);
    await setLinkActive(row.id, !row.active);
    setPendingId(null);
    router.refresh();
  }

  async function remove(row: LinkRow) {
    if (!window.confirm(`Delete "${row.name || row.shortCode}"? This also deletes its scan history.`)) {
      return;
    }
    setPendingId(row.id);
    await deleteDynamicLink(row.id);
    setPendingId(null);
    toast.success("Link deleted.");
    router.refresh();
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        {links.map((row) => (
          <Card key={row.id}>
            <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="truncate font-medium">
                    {row.name || row.shortCode}
                  </span>
                  <Badge variant={row.active ? "secondary" : "outline"}>
                    {row.active ? "Active" : "Off"}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-1.5">
                  <code className="truncate text-xs text-muted-foreground">{row.url}</code>
                  <button
                    onClick={() => copy(row.url)}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Copy short link"
                  >
                    {copied === row.url ? (
                      <CheckIcon className="size-3.5" />
                    ) : (
                      <CopyIcon className="size-3.5" />
                    )}
                  </button>
                </div>
                <a
                  href={row.targetUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
                >
                  <span className="truncate">→ {row.targetUrl}</span>
                  <ExternalLinkIcon className="size-3 shrink-0" />
                </a>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div className="mr-1 text-right">
                  <div className="font-heading text-lg font-semibold leading-none">
                    {row.scanCount}
                  </div>
                  <div className="text-xs text-muted-foreground">scans</div>
                </div>
                <label className="flex cursor-pointer items-center" title="Active">
                  <input
                    type="checkbox"
                    checked={row.active}
                    disabled={pendingId === row.id}
                    onChange={() => toggle(row)}
                    className="size-4 accent-primary"
                  />
                </label>
                <Button variant="outline" size="icon-sm" render={<Link href={`/dashboard/links/${row.id}`} />} aria-label="Analytics">
                  <BarChart3Icon />
                </Button>
                <Button variant="outline" size="icon-sm" onClick={() => setEditing(row)} aria-label="Edit">
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => remove(row)}
                  disabled={pendingId === row.id}
                  aria-label="Delete"
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

      <EditDialog
        link={editing}
        onClose={() => setEditing(null)}
        onSaved={() => {
          setEditing(null);
          router.refresh();
        }}
      />
    </>
  );
}

function EditDialog({
  link,
  onClose,
  onSaved,
}: {
  link: LinkRow | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  return (
    <Dialog open={!!link} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {/* Keyed by id so form state re-initializes per link (no sync effect). */}
        {link && (
          <EditForm key={link.id} link={link} onClose={onClose} onSaved={onSaved} />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditForm({
  link,
  onClose,
  onSaved,
}: {
  link: LinkRow;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = React.useState(link.name ?? "");
  const [targetUrl, setTargetUrl] = React.useState(link.targetUrl);
  const [active, setActive] = React.useState(link.active);
  const [expiresAt, setExpiresAt] = React.useState(
    link.expiresAt ? link.expiresAt.slice(0, 10) : "",
  );
  const [saving, setSaving] = React.useState(false);

  async function save() {
    setSaving(true);
    const res = await updateDynamicLink({
      id: link.id,
      name: name || undefined,
      targetUrl,
      active,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
    });
    setSaving(false);
    if (res?.error) {
      toast.error(res.error);
      return;
    }
    toast.success("Link updated.");
    onSaved();
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Edit link</DialogTitle>
      </DialogHeader>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-target">Destination URL</Label>
          <Input id="edit-target" value={targetUrl} onChange={(e) => setTargetUrl(e.target.value)} type="url" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-name">Name</Label>
          <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="edit-expiry">Expires (optional)</Label>
          <Input id="edit-expiry" type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium select-none">
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} className="size-4 accent-primary" />
          Active
        </label>
      </div>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={save} disabled={saving}>
          {saving && <LoaderCircleIcon className="animate-spin" />}
          Save changes
        </Button>
      </DialogFooter>
    </>
  );
}
