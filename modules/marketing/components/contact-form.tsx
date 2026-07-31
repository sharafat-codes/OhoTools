"use client";

import * as React from "react";
import { toast } from "sonner";
import { LoaderCircleIcon, SendIcon } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const CATEGORIES = ["General", "Bug report", "Feature request", "Suggest a tool", "Business"];
const selectClass =
  "h-9 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";
const textareaClass =
  "w-full resize-y rounded-lg border border-input bg-transparent p-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

export function ContactForm() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    category: "General",
    message: "",
    website: "", // honeypot
  });
  const [busy, setBusy] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  function set(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in your name, email, and message.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Couldn't send your message.");
      setSent(true);
      toast.success("Message sent — thanks!");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return (
      <div className="not-prose rounded-xl border border-border bg-muted/30 p-6 text-center">
        <p className="font-heading text-lg font-semibold">Thanks — your message is on its way.</p>
        <p className="mt-1 text-sm text-muted-foreground">We&apos;ll get back to you by email as soon as we can.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="not-prose flex flex-col gap-4">
      {/* Honeypot — hidden from users, catches bots. */}
      <input
        type="text"
        name="website"
        value={form.website}
        onChange={(e) => set("website", e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="hidden"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="c-category">Topic</Label>
        <select id="c-category" value={form.category} onChange={(e) => set("category", e.target.value)} className={selectClass}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="c-message">Message</Label>
        <textarea
          id="c-message"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          rows={6}
          required
          placeholder="How can we help? Bug reports and tool suggestions are very welcome."
          className={textareaClass}
        />
      </div>

      <Button type="submit" disabled={busy} className="w-fit">
        {busy ? <LoaderCircleIcon className="animate-spin" /> : <SendIcon />}
        {busy ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
