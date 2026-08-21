"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type Status = { code: number; name: string; desc: string };

const STATUSES: Status[] = [
  { code: 100, name: "Continue", desc: "The server received the request headers and the client should proceed to send the body." },
  { code: 101, name: "Switching Protocols", desc: "The server is switching protocols as requested by the client (e.g. to WebSocket)." },
  { code: 103, name: "Early Hints", desc: "Used to return preliminary headers so the client can preload resources." },
  { code: 200, name: "OK", desc: "The request succeeded. The meaning depends on the HTTP method." },
  { code: 201, name: "Created", desc: "The request succeeded and a new resource was created." },
  { code: 202, name: "Accepted", desc: "The request was accepted for processing, but it isn't complete yet." },
  { code: 204, name: "No Content", desc: "The request succeeded but there's no content to return." },
  { code: 206, name: "Partial Content", desc: "The server is delivering only part of the resource (used for range requests / resumable downloads)." },
  { code: 301, name: "Moved Permanently", desc: "The resource has permanently moved to a new URL. Update your links; passes SEO value." },
  { code: 302, name: "Found", desc: "The resource is temporarily at a different URL. Keep using the original URL." },
  { code: 303, name: "See Other", desc: "Redirects to another URL, typically after a POST, using GET." },
  { code: 304, name: "Not Modified", desc: "The cached version is still valid, so no body is sent. Speeds up repeat loads." },
  { code: 307, name: "Temporary Redirect", desc: "Like 302, but the HTTP method must not change on redirect." },
  { code: 308, name: "Permanent Redirect", desc: "Like 301, but the HTTP method must not change on redirect." },
  { code: 400, name: "Bad Request", desc: "The server couldn't understand the request due to malformed syntax." },
  { code: 401, name: "Unauthorized", desc: "Authentication is required and has failed or not been provided." },
  { code: 402, name: "Payment Required", desc: "Reserved for future use; sometimes used by APIs for billing/quota limits." },
  { code: 403, name: "Forbidden", desc: "The server understood the request but refuses to authorize it." },
  { code: 404, name: "Not Found", desc: "The server can't find the requested resource. The most famous error code." },
  { code: 405, name: "Method Not Allowed", desc: "The HTTP method isn't supported for this resource." },
  { code: 406, name: "Not Acceptable", desc: "The resource can't produce a response matching the request's Accept headers." },
  { code: 408, name: "Request Timeout", desc: "The server timed out waiting for the request." },
  { code: 409, name: "Conflict", desc: "The request conflicts with the current state of the resource." },
  { code: 410, name: "Gone", desc: "The resource is permanently gone with no forwarding address." },
  { code: 413, name: "Payload Too Large", desc: "The request body is larger than the server is willing to process." },
  { code: 414, name: "URI Too Long", desc: "The requested URL is longer than the server will interpret." },
  { code: 415, name: "Unsupported Media Type", desc: "The request's media type isn't supported by the server." },
  { code: 418, name: "I'm a teapot", desc: "An April Fools' joke code — the server refuses to brew coffee because it is a teapot." },
  { code: 422, name: "Unprocessable Entity", desc: "The request was well-formed but has semantic errors (common for validation failures)." },
  { code: 429, name: "Too Many Requests", desc: "The user has sent too many requests in a given time (rate limiting)." },
  { code: 451, name: "Unavailable For Legal Reasons", desc: "The resource is blocked for legal reasons (e.g. censorship)." },
  { code: 500, name: "Internal Server Error", desc: "A generic server error — something went wrong and there's no more specific message." },
  { code: 501, name: "Not Implemented", desc: "The server doesn't support the functionality to fulfill the request." },
  { code: 502, name: "Bad Gateway", desc: "A server acting as a gateway got an invalid response from the upstream server." },
  { code: 503, name: "Service Unavailable", desc: "The server is temporarily overloaded or down for maintenance." },
  { code: 504, name: "Gateway Timeout", desc: "A gateway server didn't get a timely response from the upstream server." },
  { code: 505, name: "HTTP Version Not Supported", desc: "The server doesn't support the HTTP version used in the request." },
  { code: 511, name: "Network Authentication Required", desc: "The client must authenticate to gain network access (e.g. a captive Wi-Fi portal)." },
];

const CLASSES = [
  { key: "all", label: "All" },
  { key: "1", label: "1xx Info" },
  { key: "2", label: "2xx Success" },
  { key: "3", label: "3xx Redirect" },
  { key: "4", label: "4xx Client" },
  { key: "5", label: "5xx Server" },
];

function toneFor(code: number) {
  if (code < 200) return "text-sky-600 dark:text-sky-400";
  if (code < 300) return "text-emerald-600 dark:text-emerald-400";
  if (code < 400) return "text-amber-600 dark:text-amber-400";
  if (code < 500) return "text-orange-600 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

export function HttpStatusCodes() {
  const [q, setQ] = React.useState("");
  const [cls, setCls] = React.useState("all");

  const filtered = STATUSES.filter((s) => {
    if (cls !== "all" && String(s.code)[0] !== cls) return false;
    if (!q.trim()) return true;
    const t = q.toLowerCase();
    return String(s.code).includes(t) || s.name.toLowerCase().includes(t) || s.desc.toLowerCase().includes(t);
  });

  return (
    <div className="flex flex-col gap-4">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by code, name, or meaning (e.g. 404, redirect, timeout)…"
      />

      <div className="flex flex-wrap gap-1.5">
        {CLASSES.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setCls(c.key)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors",
              cls === c.key ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:border-primary/40",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((s) => (
          <div key={s.code} className="flex items-start gap-3 rounded-xl border border-border bg-card p-3.5">
            <span className={cn("shrink-0 font-heading text-xl font-semibold tabular-nums", toneFor(s.code))}>{s.code}</span>
            <div className="min-w-0">
              <div className="text-sm font-semibold">{s.name}</div>
              <p className="mt-0.5 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No status codes match &quot;{q}&quot;.</p>}
      </div>
    </div>
  );
}
