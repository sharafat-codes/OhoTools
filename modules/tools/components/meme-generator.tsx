"use client";

import * as React from "react";
import Link from "next/link";
import { DownloadIcon, LoaderCircleIcon, SparklesIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { ResultCard } from "@/modules/tools/components/tool-result";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MEME_TEMPLATES, type MemeTemplate } from "@/modules/tools/components/meme-templates";

type Suggestion = { top: string; bottom: string };

/** Build the base image for a template — generated for solid/gradient, loaded for image. */
function loadTemplate(t: MemeTemplate): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (t.kind === "image") {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load template."));
      img.src = t.src;
      return;
    }
    const size = 800;
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("Canvas not supported."));
      return;
    }
    if (t.kind === "gradient") {
      const g = ctx.createLinearGradient(0, 0, size, size);
      g.addColorStop(0, t.from);
      g.addColorStop(1, t.to);
      ctx.fillStyle = g;
    } else {
      ctx.fillStyle = t.color;
    }
    ctx.fillRect(0, 0, size, size);
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not build template."));
    img.src = canvas.toDataURL("image/png");
  });
}

function templateThumbStyle(t: MemeTemplate): React.CSSProperties {
  if (t.kind === "solid") return { background: t.color };
  if (t.kind === "gradient") return { backgroundImage: `linear-gradient(135deg, ${t.from}, ${t.to})` };
  return { backgroundImage: `url(${t.src})`, backgroundSize: "cover", backgroundPosition: "center" };
}

const FONT_SCALES: Record<string, number> = { S: 0.07, M: 0.09, L: 0.115 };
const COLORS: Record<string, { fill: string; stroke: string }> = {
  white: { fill: "#ffffff", stroke: "#000000" },
  black: { fill: "#000000", stroke: "#ffffff" },
  yellow: { fill: "#ffe600", stroke: "#000000" },
};
const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function MemeGenerator() {
  const [img, setImg] = React.useState<HTMLImageElement | null>(null);
  const [top, setTop] = React.useState("");
  const [bottom, setBottom] = React.useState("");
  const [fontSize, setFontSize] = React.useState("M");
  const [color, setColor] = React.useState("white");
  const [url, setUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // AI captions
  const [idea, setIdea] = React.useState("");
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([]);
  const [aiBusy, setAiBusy] = React.useState(false);
  const [aiError, setAiError] = React.useState<React.ReactNode>(null);

  const draw = React.useCallback(
    (image: HTMLImageElement, t: string, b: string, scaleKey: string, colorKey: string) => {
      const canvas = canvasRef.current ?? document.createElement("canvas");
      canvasRef.current = canvas;
      const w = image.naturalWidth || 600;
      const h = image.naturalHeight || 600;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(image, 0, 0, w, h);

      const size = Math.round(h * (FONT_SCALES[scaleKey] ?? 0.09));
      const palette = COLORS[colorKey] ?? COLORS.white;
      ctx.font = `bold ${size}px Impact, "Arial Black", sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "alphabetic";
      ctx.fillStyle = palette.fill;
      ctx.strokeStyle = palette.stroke;
      ctx.lineWidth = Math.max(2, Math.round(size / 12));
      ctx.lineJoin = "round";

      const maxWidth = w * 0.92;
      const wrap = (text: string) => {
        const words = text.toUpperCase().split(/\s+/).filter(Boolean);
        const lines: string[] = [];
        let line = "";
        for (const word of words) {
          const test = line ? `${line} ${word}` : word;
          if (ctx.measureText(test).width > maxWidth && line) {
            lines.push(line);
            line = word;
          } else {
            line = test;
          }
        }
        if (line) lines.push(line);
        return lines;
      };

      const paint = (text: string, pos: "top" | "bottom") => {
        if (!text.trim()) return;
        const lines = wrap(text);
        const lh = size * 1.1;
        lines.forEach((ln, i) => {
          const y = pos === "top" ? size + i * lh + h * 0.02 : h - (lines.length - 1 - i) * lh - h * 0.03;
          ctx.strokeText(ln, w / 2, y);
          ctx.fillText(ln, w / 2, y);
        });
      };

      paint(t, "top");
      paint(b, "bottom");

      canvas.toBlob((blob) => {
        if (!blob) return;
        setUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      }, "image/png");
    },
    [],
  );

  React.useEffect(() => {
    if (img) draw(img, top, bottom, fontSize, color);
  }, [img, top, bottom, fontSize, color, draw]);

  function onFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      setError(null);
      setImg(image);
      URL.revokeObjectURL(objectUrl);
    };
    image.onerror = () => {
      setError("Could not read that image.");
      URL.revokeObjectURL(objectUrl);
    };
    image.src = objectUrl;
  }

  async function selectTemplate(t: MemeTemplate) {
    try {
      const image = await loadTemplate(t);
      setError(null);
      setImg(image);
    } catch {
      setError("Could not load that template.");
    }
  }

  async function suggest() {
    if (!idea.trim()) {
      setAiError("Describe your meme first (a topic or situation).");
      return;
    }
    setAiBusy(true);
    setAiError(null);
    setSuggestions([]);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "meme-caption", text: idea, options: { count: "5" } }),
      });
      const data = (await res.json().catch(() => ({}))) as { result?: string; error?: string };
      if (res.status === 401) {
        setAiError(
          <>
            <Link href="/login" className="font-medium text-primary underline">
              Sign in
            </Link>{" "}
            to use AI captions — the manual editor is free without an account.
          </>,
        );
        return;
      }
      if (!res.ok) {
        setAiError(data.error || "Couldn't generate captions. Try again.");
        return;
      }
      const parsed = (data.result ?? "")
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => {
          const [t, b] = line.split("||").map((s) => s.trim().replace(/^["']|["']$/g, ""));
          return { top: t ?? "", bottom: b ?? "" };
        })
        .filter((s) => s.top || s.bottom);
      if (parsed.length === 0) {
        setAiError("Couldn't parse captions. Try rephrasing your idea.");
        return;
      }
      setSuggestions(parsed);
    } catch {
      setAiError("Couldn't reach the AI service. Try again.");
    } finally {
      setAiBusy(false);
    }
  }

  function download() {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "meme.png";
    a.click();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label>Start from a template</Label>
        <div className="flex flex-wrap gap-2">
          {MEME_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTemplate(t)}
              title={t.name}
              aria-label={`Use ${t.name} template`}
              style={templateThumbStyle(t)}
              className="size-14 shrink-0 rounded-lg border border-border transition-transform hover:scale-105 hover:border-primary/50"
            />
          ))}
        </div>
        <p className="text-xs text-muted-foreground">…or upload your own image below.</p>
      </div>

      <Dropzone
        accept="image/*"
        onFile={onFile}
        title="Drag & drop an image, or click to browse"
        hint="Add captions and download your meme — in your browser."
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {img && (
        <>
          {/* AI caption suggestions */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-4">
            <Label htmlFor="meme-idea" className="flex items-center gap-1.5">
              <SparklesIcon className="size-4 text-primary" />
              Get caption ideas with AI
            </Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="meme-idea"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder="Describe the vibe, e.g. “Monday morning meetings”"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    suggest();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={suggest} disabled={aiBusy} className="shrink-0">
                {aiBusy ? <LoaderCircleIcon className="animate-spin" /> : <SparklesIcon />}
                {aiBusy ? "Thinking…" : "Suggest"}
              </Button>
            </div>
            {aiError && <p className="text-sm text-muted-foreground">{aiError}</p>}
            {suggestions.length > 0 && (
              <div className="flex flex-col gap-1.5">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setTop(s.top);
                      setBottom(s.bottom);
                    }}
                    className="rounded-lg border border-border px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-background"
                  >
                    <span className="font-medium">{s.top}</span>
                    {s.top && s.bottom ? " · " : ""}
                    <span className="text-muted-foreground">{s.bottom}</span>
                  </button>
                ))}
                <p className="text-xs text-muted-foreground">Tap a suggestion to use it, then tweak below.</p>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meme-top">Top text</Label>
              <Input id="meme-top" value={top} onChange={(e) => setTop(e.target.value)} placeholder="TOP TEXT" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meme-bottom">Bottom text</Label>
              <Input id="meme-bottom" value={bottom} onChange={(e) => setBottom(e.target.value)} placeholder="BOTTOM TEXT" />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meme-size">Text size</Label>
              <select id="meme-size" value={fontSize} onChange={(e) => setFontSize(e.target.value)} className={selectClass}>
                <option value="S">Small</option>
                <option value="M">Medium</option>
                <option value="L">Large</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="meme-color">Text color</Label>
              <select id="meme-color" value={color} onChange={(e) => setColor(e.target.value)} className={selectClass}>
                <option value="white">White</option>
                <option value="black">Black</option>
                <option value="yellow">Yellow</option>
              </select>
            </div>
          </div>

          {url && (
            <ResultCard title="Your meme">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Meme preview" className="max-h-96 w-fit max-w-full rounded-lg border border-border" />
              <div className="flex justify-end">
                <Button onClick={download}>
                  <DownloadIcon />
                  Download PNG
                </Button>
              </div>
            </ResultCard>
          )}
        </>
      )}
    </div>
  );
}
