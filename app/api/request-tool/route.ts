import { sendEmail } from "@/lib/email";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => (c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&amp;"));
}

export async function POST(req: Request) {
  const to = process.env.CONTACT_EMAIL?.trim();
  if (!to) return Response.json({ error: "Requests aren't configured yet." }, { status: 503 });

  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const tool = String(data.tool ?? "").trim().slice(0, 200);
  const details = String(data.details ?? "").trim().slice(0, 3000);
  const email = String(data.email ?? "").trim().slice(0, 200);
  const honeypot = String(data.website ?? "").trim();

  // Bots fill the hidden honeypot — silently accept and drop.
  if (honeypot) return Response.json({ ok: true });

  if (!tool) return Response.json({ error: "Please tell us which tool you'd like." }, { status: 400 });
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Please enter a valid email address (or leave it blank)." }, { status: 400 });
  }

  // Save to the admin requests inbox (fail-open — still email if the DB/table
  // is unavailable).
  try {
    await prisma.toolRequest.create({ data: { tool, details: details || null, email: email || null } });
  } catch {
    /* tool_request table not migrated / db down — the email below still sends */
  }

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#111;line-height:1.6;">
    <h2 style="margin:0 0 12px;font-size:18px;">New tool request</h2>
    <p style="margin:0 0 4px;"><strong>Tool:</strong> ${esc(tool)}</p>
    ${details ? `<div style="white-space:pre-wrap;border-top:1px solid #e4e4e7;padding-top:12px;margin-top:8px;">${esc(details)}</div>` : ""}
    <p style="margin:12px 0 0;color:#666;"><strong>From:</strong> ${email ? esc(email) : "anonymous"}</p>
  </div>`;

  const { ok } = await sendEmail({
    to,
    subject: `[OhoTool] Tool request — ${tool.slice(0, 60)}`,
    html,
    replyTo: email || undefined,
  });

  // In dev without a Resend key the message is logged (ok:false) — still succeed.
  if (!ok && process.env.RESEND_API_KEY) {
    return Response.json({ error: "Couldn't send your request. Please try again." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
