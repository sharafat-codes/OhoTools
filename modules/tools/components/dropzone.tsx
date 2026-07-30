"use client";

import * as React from "react";
import { UploadCloudIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Modern drag-and-drop file picker. Click or drag a file onto it.
 * Reusable across file tools for a consistent, professional upload experience.
 */
export function Dropzone({
  accept,
  onFile,
  onFiles,
  multiple = false,
  title = "Drag & drop a file",
  hint,
  disabled,
}: {
  accept?: string;
  onFile?: (file: File) => void;
  onFiles?: (files: FileList) => void;
  multiple?: boolean;
  title?: string;
  hint?: string;
  disabled?: boolean;
}) {
  const [drag, setDrag] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  function deliver(files: FileList | null) {
    if (!files || files.length === 0) return;
    if (multiple && onFiles) onFiles(files);
    else onFile?.(files[0]);
  }

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDrag(true);
      }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDrag(false);
        deliver(e.dataTransfer.files);
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-4 py-12 text-center outline-none transition-colors",
        "focus-visible:ring-2 focus-visible:ring-ring",
        disabled && "pointer-events-none opacity-60",
        drag ? "border-primary bg-primary/10" : "border-border bg-muted/30 hover:border-foreground/25 hover:bg-muted/50",
      )}
    >
      <div className="grid size-12 place-items-center rounded-full bg-primary/10 text-primary">
        <UploadCloudIcon className="size-6" />
      </div>
      <div>
        <p className="text-sm font-medium">{title}</p>
        {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <span className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium">
        Browse files
      </span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => deliver(e.target.files)}
      />
    </div>
  );
}
