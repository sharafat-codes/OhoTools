"use client";

import * as React from "react";
import Script from "next/script";
import { CloudIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";

const APP_KEY = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY;

export function isCloudImportConfigured(): boolean {
  return Boolean(APP_KEY);
}

type DropboxFile = { name: string; link: string; bytes: number };
type DropboxChooser = {
  choose: (opts: {
    success: (files: DropboxFile[]) => void;
    cancel?: () => void;
    linkType: "direct" | "preview";
    multiselect: boolean;
    extensions?: string[];
  }) => void;
};
declare global {
  interface Window {
    Dropbox?: DropboxChooser;
  }
}

// Pull the chosen file into the browser as a File. Dropbox "direct" links are
// usually CORS-friendly; if a direct fetch is blocked we fall back to our
// same-origin proxy.
async function fetchAsFile(link: string, name: string): Promise<File> {
  const toFile = async (res: Response) => {
    if (!res.ok) throw new Error("fetch failed");
    const blob = await res.blob();
    return new File([blob], name, { type: blob.type || "application/octet-stream" });
  };
  try {
    return await toFile(await fetch(link));
  } catch {
    return await toFile(await fetch(`/api/cloud/fetch?url=${encodeURIComponent(link)}`));
  }
}

/** "Import from Dropbox" button. Renders nothing until a Dropbox app key is set. */
export function CloudImport({
  onFile,
  onError,
  accept,
  disabled,
}: {
  onFile: (file: File) => void;
  onError?: (message: string) => void;
  /** Same string as the file input's `accept` (e.g. ".doc,.docx" or "image/*"). */
  accept?: string;
  disabled?: boolean;
}) {
  const [ready, setReady] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  if (!APP_KEY) return null;

  const extensions = (accept ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.startsWith("."));

  function open() {
    const dbx = window.Dropbox;
    if (!dbx) return;
    dbx.choose({
      linkType: "direct",
      multiselect: false,
      extensions: extensions.length ? extensions : undefined,
      success: async (files) => {
        const picked = files[0];
        if (!picked) return;
        setLoading(true);
        try {
          onFile(await fetchAsFile(picked.link, picked.name));
        } catch {
          onError?.("Couldn't import that file from Dropbox. Please try again or upload it directly.");
        }
        setLoading(false);
      },
    });
  }

  return (
    <>
      <Script
        id="dropboxjs"
        src="https://www.dropbox.com/static/api/2/dropins.js"
        data-app-key={APP_KEY}
        strategy="lazyOnload"
        onReady={() => setReady(true)}
        onLoad={() => setReady(true)}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={open}
        disabled={disabled || loading || !ready}
      >
        {loading ? <Loader2Icon className="size-4 animate-spin" /> : <CloudIcon className="size-4" />}
        {loading ? "Importing…" : "From Dropbox"}
      </Button>
    </>
  );
}
