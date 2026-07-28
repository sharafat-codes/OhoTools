"use client";

import * as React from "react";
import { DownloadIcon, Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/copy-button";
import { Textarea } from "@/components/ui/textarea";

const KEY = "oho-notepad";

export function OnlineNotepad() {
  const [text, setText] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const [saved, setSaved] = React.useState(true);

  // Restore once on mount (client only, avoids hydration mismatch).
  React.useEffect(() => {
    let v: string | null = null;
    try {
      v = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    // Deferred to avoid a synchronous setState inside the effect.
    Promise.resolve().then(() => {
      if (v) setText(v);
      setLoaded(true);
    });
  }, []);

  // Debounced autosave.
  React.useEffect(() => {
    if (!loaded) return;
    Promise.resolve().then(() => setSaved(false));
    const t = setTimeout(() => {
      try {
        localStorage.setItem(KEY, text);
      } catch {
        /* ignore */
      }
      setSaved(true);
    }, 400);
    return () => clearTimeout(t);
  }, [text, loaded]);

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;

  function download() {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function clear() {
    if (window.confirm("Clear all notes? This can't be undone.")) setText("");
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing… your notes save automatically in this browser."
        className="min-h-[60vh] text-sm leading-relaxed"
      />
      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span>
          {words.toLocaleString()} words · {text.length.toLocaleString()} characters
        </span>
        {loaded && <span className={saved ? "text-emerald-500" : "text-muted-foreground"}>{saved ? "Saved" : "Saving…"}</span>}
        <div className="ml-auto flex items-center gap-2">
          <CopyButton value={text} label="Copy" />
          <Button variant="outline" size="sm" onClick={download}>
            <DownloadIcon className="size-4" /> Download .txt
          </Button>
          <Button variant="ghost" size="sm" onClick={clear}>
            <Trash2Icon className="size-4" /> Clear
          </Button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        Your notes are saved only in this browser (nothing is uploaded). Clearing your browser data will remove them.
      </p>
    </div>
  );
}
