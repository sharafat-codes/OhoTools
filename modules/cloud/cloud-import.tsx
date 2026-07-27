"use client";

import * as React from "react";
import Script from "next/script";
import { CloudIcon, HardDriveIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { isGoogleDriveConfigured, importFromGoogleDrive } from "./google-drive";

const APP_KEY = process.env.NEXT_PUBLIC_DROPBOX_APP_KEY;

export function isCloudImportConfigured(): boolean {
  return Boolean(APP_KEY) || isGoogleDriveConfigured();
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

// Pull a chosen file into the browser as a File. Dropbox "direct" links are
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

function toFileList(files: File[]): FileList {
  const dt = new DataTransfer();
  files.forEach((f) => dt.items.add(f));
  return dt.files;
}

/**
 * "Import from Dropbox / Google Drive" buttons. Renders only for the providers
 * that are configured. Pass `onFile` for single-file tools, or `multiple` +
 * `onFileList` for tools whose `addFiles` handler takes a FileList.
 */
export function CloudImport({
  onFile,
  onFileList,
  multiple,
  onError,
  accept,
  disabled,
}: {
  onFile?: (file: File) => void;
  onFileList?: (files: FileList) => void;
  multiple?: boolean;
  onError?: (message: string) => void;
  /** Same string as the file input's `accept` (e.g. ".doc,.docx" or "image/*"). */
  accept?: string;
  disabled?: boolean;
}) {
  const [dbxReady, setDbxReady] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const dropbox = Boolean(APP_KEY);
  const google = isGoogleDriveConfigured();
  if (!dropbox && !google) return null;

  const extensions = (accept ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.startsWith("."));

  function deliver(files: File[]) {
    if (!files.length) return;
    if (multiple && onFileList) onFileList(toFileList(files));
    else onFile?.(files[0]);
  }

  function openDropbox() {
    const dbx = window.Dropbox;
    if (!dbx) return;
    dbx.choose({
      linkType: "direct",
      multiselect: Boolean(multiple),
      extensions: extensions.length ? extensions : undefined,
      success: async (files) => {
        if (!files.length) return;
        setBusy(true);
        try {
          deliver(await Promise.all(files.map((f) => fetchAsFile(f.link, f.name))));
        } catch {
          onError?.("Couldn't import from Dropbox. Please try again or upload directly.");
        }
        setBusy(false);
      },
    });
  }

  async function openGoogle() {
    setBusy(true);
    try {
      deliver(await importFromGoogleDrive({ accept, multiple }));
    } catch {
      onError?.("Couldn't import from Google Drive. Please try again or upload directly.");
    }
    setBusy(false);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {dropbox && (
        <>
          <Script
            id="dropboxjs"
            src="https://www.dropbox.com/static/api/2/dropins.js"
            data-app-key={APP_KEY}
            strategy="lazyOnload"
            onReady={() => setDbxReady(true)}
            onLoad={() => setDbxReady(true)}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={openDropbox}
            disabled={disabled || busy || !dbxReady}
          >
            {busy ? <Loader2Icon className="size-4 animate-spin" /> : <CloudIcon className="size-4" />}
            From Dropbox
          </Button>
        </>
      )}
      {google && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openGoogle}
          disabled={disabled || busy}
        >
          {busy ? <Loader2Icon className="size-4 animate-spin" /> : <HardDriveIcon className="size-4" />}
          From Google Drive
        </Button>
      )}
    </div>
  );
}
