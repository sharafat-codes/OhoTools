"use client";

import * as React from "react";
import { CheckCircle2Icon, Loader2Icon, WandSparklesIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export function RequestToolForm({ initialTool = "" }: { initialTool?: string }) {
  const [tool, setTool] = React.useState(initialTool);
  const [details, setDetails] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [website, setWebsite] = React.useState(""); // honeypot
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);
  // Set when the request was saved and the person left no address: the one
  // follow-up question is only worth asking if there is a row to attach it to.
  const [requestId, setRequestId] = React.useState<string | null>(null);
  const [lateEmail, setLateEmail] = React.useState("");
  const [lateState, setLateState] = React.useState<"idle" | "saving" | "saved" | "error">("idle");

  // A few sentences of detail is someone who wants an answer, not a drive-by.
  const detailed = details.trim().length >= 120;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!tool.trim() || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/request-tool", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tool, details, email, website }),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; id?: string; error?: string };
      if (!res.ok || !j.ok) {
        setError(j.error || "Something went wrong. Please try again.");
      } else {
        setRequestId(!email.trim() && j.id ? j.id : null);
        setDone(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  async function attachEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!requestId || lateState === "saving") return;
    setLateState("saving");
    try {
      const res = await fetch("/api/request-tool", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ id: requestId, email: lateEmail }),
      });
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !j.ok) {
        setError(j.error || "Couldn't save that. Please try again.");
        setLateState("error");
      } else {
        setError(null);
        setLateState("saved");
      }
    } catch {
      setError("Couldn't save that. Please try again.");
      setLateState("error");
    }
  }

  if (done) {
    const askForEmail = requestId && detailed && lateState !== "saved";
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-6 py-12 text-center">
        <CheckCircle2Icon className="size-10 text-primary" />
        <h2 className="font-heading text-xl font-semibold">Thanks — request received!</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          We read every request and use them to decide what to build next.{" "}
          {email.trim() || lateState === "saved"
            ? "We'll email you if we add it."
            : askForEmail
              ? ""
              : "Add your email next time and we'll let you know when it's live."}
        </p>

        {askForEmail && (
          <form onSubmit={attachEmail} className="mt-2 w-full max-w-md rounded-xl border border-border bg-card p-4 text-left">
            <p className="text-sm font-medium">This is a detailed request — leave an email and I&apos;ll reply personally.</p>
            <p className="mt-0.5 text-xs text-muted-foreground">No newsletter. Just the answer, from the person who builds this.</p>
            <div className="mt-3 flex gap-2">
              <Input
                type="email"
                value={lateEmail}
                onChange={(e) => setLateEmail(e.target.value)}
                placeholder="you@example.com"
                maxLength={200}
                autoFocus
                className="flex-1"
              />
              <Button type="submit" disabled={lateState === "saving" || !lateEmail.trim()}>
                {lateState === "saving" ? <Loader2Icon className="animate-spin" /> : null}
                Send
              </Button>
            </div>
            {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          </form>
        )}
        {lateState === "saved" && (
          <p className="text-sm font-medium text-primary">Got it — you&apos;ll hear back at {lateEmail.trim()}.</p>
        )}

        <Button
          variant="outline"
          onClick={() => {
            setTool("");
            setDetails("");
            setEmail("");
            setLateEmail("");
            setLateState("idle");
            setRequestId(null);
            setError(null);
            setDone(false);
          }}
        >
          Request another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {/* Honeypot — hidden from users, catches bots */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        className="hidden"
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rt-tool">What tool do you want?</Label>
        <Input
          id="rt-tool"
          value={tool}
          onChange={(e) => setTool(e.target.value)}
          placeholder="e.g. 'PDF to Excel' or 'YouTube thumbnail downloader'"
          maxLength={200}
          autoFocus
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rt-details">
          Any details? <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="rt-details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="What should it do? What would you use it for?"
          className="min-h-28"
          maxLength={3000}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="rt-email">
          Your email <span className="text-muted-foreground">(optional — to hear when it's live)</span>
        </Label>
        <Input
          id="rt-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          maxLength={200}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={busy || !tool.trim()} className="w-fit">
        {busy ? <Loader2Icon className="animate-spin" /> : <WandSparklesIcon className="size-4" />}
        Request tool
      </Button>
    </form>
  );
}
