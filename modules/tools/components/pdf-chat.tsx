"use client";

import * as React from "react";
import Link from "next/link";
import { FileTextIcon, Loader2Icon, SendIcon, SparklesIcon } from "lucide-react";

import { Dropzone } from "@/modules/tools/components/dropzone";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { isPro } from "@/lib/plans";

const FREE_LIMIT = 5; // matches FREE_DAILY_AI_LIMIT

type Msg = { role: "user" | "assistant"; content: string };

async function getPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
  return pdfjs;
}

const STARTERS = ["Summarize this document", "What are the key points?", "List any dates and names"];

export function PdfChat() {
  const { data } = useSession();
  const loggedIn = !!data?.user;
  const pro = isPro((data?.user as { plan?: string } | undefined)?.plan ?? "FREE");

  const [docText, setDocText] = React.useState("");
  const [docName, setDocName] = React.useState("");
  const [extracting, setExtracting] = React.useState(false);
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [question, setQuestion] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [remaining, setRemaining] = React.useState<number | null>(null);
  const [quotaHit, setQuotaHit] = React.useState(false);
  const [truncated, setTruncated] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  async function onFile(f: File | undefined) {
    if (!f) return;
    setExtracting(true);
    setError(null);
    setMessages([]);
    setTruncated(false);
    setDocName(f.name);
    try {
      const pdfjs = await getPdfjs();
      const doc = await pdfjs.getDocument({ data: await f.arrayBuffer() }).promise;
      let out = "";
      for (let n = 1; n <= doc.numPages; n++) {
        const page = await doc.getPage(n);
        const content = await page.getTextContent();
        out += content.items.map((it) => ("str" in it ? it.str : "")).join(" ").replace(/\s+/g, " ").trim() + "\n\n";
      }
      const text = out.trim();
      if (!text) {
        setError("No selectable text found — this looks like a scanned (image-only) PDF.");
        setDocText("");
      } else {
        setDocText(text);
      }
    } catch {
      setError("Could not read that PDF. It may be encrypted or corrupted.");
      setDocText("");
    }
    setExtracting(false);
  }

  async function ask(q: string) {
    const query = q.trim();
    if (!query || !docText || sending) return;
    setError(null);
    setSending(true);
    const prior = messages;
    setMessages((m) => [...m, { role: "user", content: query }]);
    setQuestion("");
    try {
      const res = await fetch("/api/ai/pdf", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ doc: docText, question: query, history: prior }),
      });
      const j = (await res.json().catch(() => ({}))) as {
        answer?: string;
        truncated?: boolean;
        error?: string;
        usage?: { remaining: number };
      };
      if (!res.ok) {
        setError(j.error || "Something went wrong. Please try again.");
        if (res.status === 429) {
          setQuotaHit(true);
          setRemaining(0);
        }
      } else {
        setMessages((m) => [...m, { role: "assistant", content: j.answer || "" }]);
        if (j.truncated) setTruncated(true);
        if (j.usage) {
          setRemaining(j.usage.remaining);
          if (j.usage.remaining <= 0) setQuotaHit(true);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setSending(false);
  }

  const banner = (() => {
    if (pro) return null;
    if (!loggedIn) {
      return (
        <>
          <span className="flex-1 text-muted-foreground">
            Sign up to use AI tools free — <span className="font-medium text-foreground">{FREE_LIMIT} questions a day</span>, or go Pro for unlimited.
          </span>
          <Link href="/signup" className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
            Sign up
          </Link>
        </>
      );
    }
    return (
      <>
        <span className="flex-1 text-muted-foreground">
          <span className="font-medium text-foreground">Free plan</span> —{" "}
          {remaining === null ? `${FREE_LIMIT} questions a day` : `${remaining} of ${FREE_LIMIT} left today`}. Go Pro for unlimited.
        </span>
        <Link href="/pricing" className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90">
          Go Pro
        </Link>
      </>
    );
  })();

  // No document yet → upload step.
  if (!docText) {
    return (
      <div className="flex flex-col gap-4">
        {banner && (
          <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
            <SparklesIcon className="size-4 shrink-0 text-primary" />
            {banner}
          </div>
        )}
        <Dropzone
          accept="application/pdf"
          onFile={onFile}
          title="Drop a PDF, or click to browse"
          hint="The text is read in your browser, then you can ask questions about it."
        />
        {extracting && (
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" /> Reading {docName}…
          </p>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {banner && (
        <div className="flex items-center gap-3 rounded-xl border border-primary/30 bg-primary/5 p-3 text-sm">
          <SparklesIcon className="size-4 shrink-0 text-primary" />
          {banner}
        </div>
      )}

      <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm">
        <FileTextIcon className="size-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate font-medium">{docName}</span>
        <button
          type="button"
          onClick={() => {
            setDocText("");
            setDocName("");
            setMessages([]);
            setError(null);
          }}
          className="shrink-0 text-xs text-muted-foreground hover:text-foreground"
        >
          Change PDF
        </button>
      </div>

      {truncated && (
        <p className="text-xs text-muted-foreground">
          This is a long document — answers use roughly the first 60,000 characters.
        </p>
      )}

      <div ref={scrollRef} className="flex max-h-96 flex-col gap-3 overflow-y-auto">
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => ask(s)}
                disabled={sending || (!pro && quotaHit)}
                className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground disabled:opacity-50"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground"
                : "mr-auto max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-2 text-sm"
            }
          >
            {m.content}
          </div>
        ))}
        {sending && (
          <div className="mr-auto flex items-center gap-2 rounded-2xl rounded-bl-sm border border-border bg-card px-3.5 py-2 text-sm text-muted-foreground">
            <Loader2Icon className="size-4 animate-spin" /> Thinking…
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {!loggedIn ? (
        <Button className="w-fit" render={<Link href="/signup" />}>
          Sign up to ask questions
        </Button>
      ) : !pro && quotaHit ? (
        <Button className="w-fit" render={<Link href="/pricing" />}>
          <SparklesIcon className="size-4" />
          Upgrade to Pro for unlimited
        </Button>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            ask(question);
          }}
          className="flex items-end gap-2"
        >
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                ask(question);
              }
            }}
            placeholder="Ask anything about this PDF…"
            rows={1}
            className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
          <Button type="submit" size="icon" disabled={sending || !question.trim()} aria-label="Send">
            <SendIcon className="size-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
