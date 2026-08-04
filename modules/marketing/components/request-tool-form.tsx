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
      const j = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok || !j.ok) {
        setError(j.error || "Something went wrong. Please try again.");
      } else {
        setDone(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setBusy(false);
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/30 bg-primary/5 px-6 py-12 text-center">
        <CheckCircle2Icon className="size-10 text-primary" />
        <h2 className="font-heading text-xl font-semibold">Thanks — request received!</h2>
        <p className="max-w-md text-sm text-muted-foreground">
          We read every request and use them to decide what to build next.{" "}
          {email.trim() ? "We'll email you if we add it." : "Add your email next time and we'll let you know when it's live."}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setTool("");
            setDetails("");
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
