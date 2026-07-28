"use client";

import * as React from "react";
import { XIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Card, CardContent } from "@/components/ui/card";
import { CloudImport } from "@/modules/cloud/cloud-import";

export function ImageToBase64() {
  const [dataUri, setDataUri] = React.useState<string | null>(null);
  const [fileName, setFileName] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setError(null);
    setFileName(file.name);
    const fr = new FileReader();
    fr.onload = () => setDataUri(String(fr.result));
    fr.onerror = () => setError("Couldn't read that file.");
    fr.readAsDataURL(file);
  }

  const rawBase64 = dataUri ? (dataUri.split(",")[1] ?? "") : "";

  return (
    <div className="flex flex-col gap-4">
      <Dropzone
        accept="image/*"
        onFile={(f) => onFile(f)}
        title="Drag & drop an image, or click to browse"
        hint="PNG, JPG, SVG, GIF, WebP — up to 5MB"
      />

      <CloudImport accept="image/*" onFile={(f) => onFile(f)} onError={setError} />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {dataUri && (
        <>
          <Card>
            <CardContent className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUri} alt="preview" className="size-16 rounded-md border border-border object-contain" />
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{fileName}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.ceil(rawBase64.length / 1024)} KB encoded
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                className="ml-auto"
                onClick={() => {
                  setDataUri(null);
                  setFileName("");
                }}
                aria-label="Clear"
              >
                <XIcon />
              </Button>
            </CardContent>
          </Card>

          <OutputBlock label="Data URI (for HTML/CSS)" value={dataUri} />
          <OutputBlock label="Raw Base64" value={rawBase64} />
        </>
      )}
    </div>
  );
}

function OutputBlock({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">{label}</span>
          <CopyButton value={value} />
        </div>
        <pre className="max-h-40 overflow-auto rounded-lg bg-muted p-3 text-xs">
          <code className="font-mono break-all whitespace-pre-wrap">{value}</code>
        </pre>
      </CardContent>
    </Card>
  );
}
