"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  DownloadIcon,
  LoaderCircleIcon,
  QrCodeIcon,
  ScanBarcodeIcon,
  SearchIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { renderHistoryItem } from "@/modules/history/render";
import { AssetThumb } from "@/modules/history/components/asset-thumb";
import type { HistoryItem } from "@/modules/history/types";
import { deleteQRCode } from "@/modules/qr/actions";
import { deleteBarcode } from "@/modules/barcode/actions";
import { downloadDataUrl, toFileStem } from "@/lib/download";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function HistoryList({ items }: { items: HistoryItem[] }) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [pending, setPending] = React.useState<HistoryItem | null>(null);
  const [isDeleting, startDelete] = React.useTransition();

  const q = query.trim().toLowerCase();
  const filtered = q
    ? items.filter(
        (i) =>
          i.name?.toLowerCase().includes(q) || i.data.toLowerCase().includes(q),
      )
    : items;

  async function handleDownload(item: HistoryItem) {
    try {
      const url = await renderHistoryItem(item, { full: true });
      downloadDataUrl(url, `${toFileStem(item.name || item.data, item.kind)}.png`);
    } catch {
      toast.error("Couldn't render this item for download.");
    }
  }

  function confirmDelete() {
    if (!pending) return;
    const item = pending;
    startDelete(async () => {
      const res =
        item.kind === "qr"
          ? await deleteQRCode(item.id)
          : await deleteBarcode(item.id);
      if (res?.error) {
        toast.error("Couldn't delete that item.");
        return;
      }
      toast.success("Deleted.");
      setPending(null);
      router.refresh();
    });
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <p className="text-sm text-muted-foreground">
            Nothing saved yet. Create something and hit “Save to history”.
          </p>
          <div className="flex gap-2">
            <Button size="sm" render={<Link href="/dashboard/qr" />}>
              <QrCodeIcon />
              New QR code
            </Button>
            <Button size="sm" variant="outline" render={<Link href="/dashboard/barcodes" />}>
              <ScanBarcodeIcon />
              New barcode
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or content…"
          className="pl-8"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted-foreground">
          No items match “{query}”.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item) => (
            <Card key={`${item.kind}-${item.id}`}>
              <CardContent className="flex gap-3">
                <AssetThumb item={item} className="size-20 shrink-0" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="secondary" className="gap-1">
                      {item.kind === "qr" ? (
                        <QrCodeIcon className="size-3" />
                      ) : (
                        <ScanBarcodeIcon className="size-3" />
                      )}
                      {item.kind === "qr" ? "QR" : item.format}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium">
                    {item.name || item.data}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {item.data}
                  </p>
                  <p className="mt-auto pt-2 text-xs text-muted-foreground">
                    {format(new Date(item.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </CardContent>
              <div className="flex gap-1 border-t border-border px-2 py-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  onClick={() => handleDownload(item)}
                >
                  <DownloadIcon />
                  Download
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Delete"
                  onClick={() => setPending(item)}
                >
                  <Trash2Icon className="text-muted-foreground" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!pending}
        onOpenChange={(open) => {
          if (!open && !isDeleting) setPending(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this item?</DialogTitle>
            <DialogDescription>
              This permanently removes “{pending?.name || pending?.data}” from
              your history. This can’t be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPending(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting && <LoaderCircleIcon className="animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
